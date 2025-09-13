import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Coordinates, Route } from '../types';
import { useAppStore } from '../store/store';
import { addRoute, getAllRoutes } from '../services/db';

const useMockGps = () => {
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(750);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prevSpeed => {
        const randomChange = (Math.random() - 0.45) * 10;
        const newSpeed = prevSpeed + randomChange;
        return Math.max(0, Math.min(220, newSpeed));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
     setRpm(Math.round(750 + (speed / 220) * 8000));
  }, [speed])

  return { speed, rpm };
};

const Speedometer: React.FC<{ speed: number }> = ({ speed }) => {
  const percentage = Math.min(100, (speed / 220) * 100);

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
      <div
        className="absolute w-full h-full rounded-full"
        style={{
          background: `conic-gradient(
            from -135deg,
            #0ea5e9 0deg,
            #0ea5e9 ${percentage * 2.7}deg,
            #334155 ${percentage * 2.7}deg,
            #334155 270deg
          )`,
        }}
      ></div>
      <div className="absolute w-[85%] h-[85%] bg-slate-800 rounded-full"></div>
      <div className="absolute w-full h-full rounded-full border-[1.5rem] sm:border-[2rem] border-slate-900"></div>
      
      <div className="relative z-10 text-center">
        <span className="text-7xl sm:text-8xl font-black text-white tracking-tighter">
          {Math.round(speed)}
        </span>
        <span className="block text-xl font-bold text-slate-400 -mt-2">km/h</span>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; unit: string }> = ({ title, value, unit }) => (
  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex-1 min-w-[120px]">
    <p className="text-sm text-slate-400 font-medium">{title}</p>
    <p className="text-3xl font-bold text-white">
      {value}<span className="text-lg text-slate-300 ml-1">{unit}</span>
    </p>
  </div>
);

const FuelIndicator: React.FC<{ level: number }> = ({ level }) => (
  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-slate-200">Fuel Level</h3>
        <span className="font-bold text-sky-400">{level}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-4">
          <div className="bg-gradient-to-r from-sky-500 to-cyan-400 h-4 rounded-full" style={{ width: `${level}%` }}></div>
      </div>
  </div>
);

// Custom hook for managing the Screen Wake Lock API
const useWakeLock = () => {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLock.current = await navigator.wakeLock.request('screen');
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock.current) {
      await wakeLock.current.release();
      wakeLock.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      // Ensure wake lock is released on component unmount
      releaseWakeLock();
    };
  }, [releaseWakeLock]);

  return { requestWakeLock, releaseWakeLock };
};

export default function Dashboard() {
  const { speed, rpm } = useMockGps();
  const [fuel] = useState(78);
  const [range] = useState(214);
  const [trip, setTrip] = useState(42.8);
  
  // Zustand state
  const gpsHighAccuracy = useAppStore((state) => state.gpsHighAccuracy);

  // GPS Tracking State
  const [isTracking, setIsTracking] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Coordinates[]>([]);
  const [pastRoutes, setPastRoutes] = useState<Route[]>([]);
  const [currentPosition, setCurrentPosition] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  useEffect(() => {
    if (speed > 0) {
      const tripInterval = setInterval(() => {
        setTrip(prev => parseFloat((prev + speed / 3600).toFixed(1))); // update trip every second
      }, 1000);
      return () => clearInterval(tripInterval);
    }
  }, [speed]);

  // Load past routes from Dexie on mount
  useEffect(() => {
    const fetchRoutes = async () => {
      const routes = await getAllRoutes();
      setPastRoutes(routes);
    };
    fetchRoutes();
  }, []);

  const handleStartTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    requestWakeLock();
    setError(null);
    setCurrentRoute([]);
    setIsTracking(true);

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentPosition(position.coords);
        const newPoint: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        };
        setCurrentRoute((prevRoute) => [...prevRoute, newPoint]);
      },
      (err) => {
        setError(`GPS Error: ${err.message}`);
        setIsTracking(false);
        releaseWakeLock();
      },
      { enableHighAccuracy: gpsHighAccuracy, timeout: 20000, maximumAge: 1000 }
    );
  };

  const handleStopTracking = async () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsTracking(false);
    releaseWakeLock();

    if (currentRoute.length > 1) {
      const newRoute: Route = {
        id: `route-${Date.now()}`,
        startTime: currentRoute[0].timestamp,
        endTime: currentRoute[currentRoute.length - 1].timestamp,
        path: currentRoute,
      };
      await addRoute(newRoute);
      const updatedRoutes = await getAllRoutes(); // re-fetch to update UI
      setPastRoutes(updatedRoutes);
    }
    setCurrentRoute([]);
  };

  const formatDuration = (ms: number) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <Speedometer speed={speed} />
      <div className="w-full max-w-md grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard title="RPM" value={(rpm / 1000).toFixed(1)} unit="k" />
        <StatCard title="Range" value={String(range)} unit="km" />
        <StatCard title="Trip" value={String(trip)} unit="km" />
      </div>
      <div className="w-full max-w-md">
        <FuelIndicator level={fuel} />
      </div>

      {/* GPS Tracking Section */}
      <div className="w-full max-w-md space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 space-y-3">
          <h3 className="text-lg font-semibold text-slate-200">GPS Tracking</h3>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {currentPosition ? (
             <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-slate-400">Latitude:</span> <span className="text-white font-mono">{currentPosition.latitude.toFixed(5)}</span>
                <span className="text-slate-400">Longitude:</span> <span className="text-white font-mono">{currentPosition.longitude.toFixed(5)}</span>
                <span className="text-slate-400">Altitude:</span> <span className="text-white font-mono">{currentPosition.altitude ? `${currentPosition.altitude.toFixed(1)}m` : 'N/A'}</span>
                 <span className="text-slate-400">Speed:</span> <span className="text-white font-mono">{currentPosition.speed ? `${(currentPosition.speed * 3.6).toFixed(1)} km/h` : 'N/A'}</span>
            </div>
          ) : (
             <p className="text-sm text-slate-400">{isTracking ? 'Acquiring GPS signal...' : 'GPS is idle. Start tracking to see live data.'}</p>
          )}
          <div className="flex gap-4 pt-2">
            {!isTracking ? (
              <button onClick={handleStartTracking} className="flex-1 bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500">Start Tracking</button>
            ) : (
              <button onClick={handleStopTracking} className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500">Stop Tracking</button>
            )}
          </div>
        </div>
        
        {isTracking && (
           <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
               <h4 className="text-md font-semibold text-slate-200 mb-2">Live Route</h4>
               <p className="text-sm text-sky-400">Points recorded: {currentRoute.length}</p>
               <div className="mt-2 bg-slate-900/50 rounded-lg p-2 h-24 overflow-y-auto text-xs font-mono text-slate-300">
                  {currentRoute.length > 0 ? currentRoute.map(p => (
                      <div key={p.timestamp}>{`[${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}]`}</div>
                  )) : <p>Waiting for first coordinate...</p>}
               </div>
           </div>
        )}
        
        {pastRoutes.length > 0 && !isTracking && (
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <h3 className="text-md font-semibold text-slate-200 mb-2">Route History</h3>
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {pastRoutes.map(route => (
                <li key={route.id} className="text-sm border-b border-slate-700 pb-2 last:border-b-0">
                  <p className="font-semibold text-slate-100">{new Date(route.startTime).toLocaleString()}</p>
                  <div className="flex justify-between text-slate-400">
                      <span>Duration: {formatDuration(route.endTime - route.startTime)}</span>
                      <span>Points: {route.path.length}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}