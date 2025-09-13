import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ActiveView } from '../types';

interface AppState {
  activeView: ActiveView;
  darkMode: boolean;
  notifications: boolean;
  gpsHighAccuracy: boolean;
  metricUnits: boolean;
  setActiveView: (view: ActiveView) => void;
  setDarkMode: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  setGpsHighAccuracy: (enabled: boolean) => void;
  setMetricUnits: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeView: 'dashboard',
      darkMode: true,
      notifications: true,
      gpsHighAccuracy: false,
      metricUnits: true,
      setActiveView: (view) => set({ activeView: view }),
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      setNotifications: (enabled) => set({ notifications: enabled }),
      setGpsHighAccuracy: (enabled) => set({ gpsHighAccuracy: enabled }),
      setMetricUnits: (enabled) => set({ metricUnits: enabled }),
    }),
    {
      name: 'bike-advance-settings', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      // Only persist settings, not the active view
      partialize: (state) => ({
        darkMode: state.darkMode,
        notifications: state.notifications,
        gpsHighAccuracy: state.gpsHighAccuracy,
        metricUnits: state.metricUnits,
      }),
    }
  )
);
