
import React, { useState } from 'react';

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, enabled, setEnabled }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
      <span className="font-medium text-slate-200">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-sky-500' : 'bg-slate-600'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
};

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [gpsHighAccuracy, setGpsHighAccuracy] = useState(false);
  const [metricUnits, setMetricUnits] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-slate-400">Customize your application experience.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-sky-400 border-b border-slate-700 pb-2">Display</h3>
        <ToggleSwitch label="Dark Mode" enabled={darkMode} setEnabled={setDarkMode} />
        <ToggleSwitch label="Use Metric Units (km)" enabled={metricUnits} setEnabled={setMetricUnits} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-sky-400 border-b border-slate-700 pb-2">Functionality</h3>
        <ToggleSwitch label="Enable Notifications" enabled={notifications} setEnabled={setNotifications} />
        <ToggleSwitch label="High Accuracy GPS" enabled={gpsHighAccuracy} setEnabled={setGpsHighAccuracy} />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-sky-400 border-b border-slate-700 pb-2">Account</h3>
        <button className="w-full text-left p-4 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-700/50 transition-colors">
          Manage Profile
        </button>
        <button className="w-full text-left p-4 bg-slate-800 rounded-lg border border-slate-700 text-red-400 hover:bg-red-900/20 transition-colors">
          Log Out
        </button>
      </div>
    </div>
  );
}
