import React, { useState, useCallback, useEffect } from 'react';
// @ts-ignore - This is a virtual module provided by vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register';
import { ActiveView } from './types';
import { DashboardIcon, MotorcycleIcon, FuelIcon, SettingsIcon, UserCircleIcon } from './components/Icons';
import Dashboard from './components/Dashboard';
import BikeDatabase from './components/BikeDatabase';
import FuelCalculator from './components/FuelCalculator';
import Settings from './components/Settings';

const TopAppBar: React.FC<{ title: string }> = ({ title }) => (
  <header className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm z-10 border-b border-slate-700/50">
    <div className="mx-auto max-w-4xl h-16 flex items-center justify-between px-4">
      <h1 className="text-xl font-bold text-sky-400 tracking-wider">
        Bike<span className="text-slate-100">Advance</span>
      </h1>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-300 hidden sm:block">{title}</span>
        <UserCircleIcon className="w-8 h-8 text-slate-400" />
      </div>
    </div>
  </header>
);

const BottomNav: React.FC<{ activeView: ActiveView; setActiveView: (view: ActiveView) => void }> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', icon: DashboardIcon, label: 'Dashboard' },
    { id: 'bikes', icon: MotorcycleIcon, label: 'Bikes' },
    { id: 'fuel', icon: FuelIcon, label: 'Fuel' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm z-10 border-t border-slate-700/50">
      <div className="mx-auto max-w-4xl h-20 flex justify-around items-center px-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as ActiveView)}
            className={`flex flex-col items-center justify-center w-20 h-16 rounded-lg transition-all duration-200 ease-in-out ${
              activeView === item.id ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-sky-400'
            }`}
          >
            <item.icon className="w-7 h-7 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  useEffect(() => {
    // Register the service worker for PWA functionality.
    // It will automatically update on new deployments.
    registerSW({ immediate: true });
  }, []);

  const renderView = useCallback(() => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'bikes':
        return <BikeDatabase />;
      case 'fuel':
        return <FuelCalculator />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  }, [activeView]);
  
  const viewTitles: Record<ActiveView, string> = {
    dashboard: 'Real-time Monitor',
    bikes: 'Bike Database',
    fuel: 'Fuel Management',
    settings: 'Configuration'
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <TopAppBar title={viewTitles[activeView]} />
      <main className="pt-16 pb-20">
        <div className="mx-auto max-w-4xl p-4">
          {renderView()}
        </div>
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}