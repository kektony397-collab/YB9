
import React from 'react';

type IconProps = {
  className?: string;
};

export const DashboardIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

export const MotorcycleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811V8a2 2 0 00-2-2h-3.358L14.28 3.22a2 2 0 00-1.789-1.11H11.5a2 2 0 00-1.789 1.11L8.358 6H5a2 2 0 00-2 2v8.811a2 2 0 00.518 1.344l4.332 3.821a2 2 0 002.3 0l4.332-3.821a2 2 0 00.518-1.344zM12 8a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
);

export const FuelIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.008 1.11-1.226a1.14 1.14 0 011.082.098l.526.435a1.14 1.14 0 001.494.026l.515-.36a1.14 1.14 0 011.392.618c.09.24.135.495.135.75v.526a1.14 1.14 0 00.63.99c.37.17.69.41.95.7l.435.526a1.14 1.14 0 010 1.638l-.435.526c-.26.29-.58.53-.95.7a1.14 1.14 0 00-.63.99v.526c0 .255-.045.51-.135.75a1.14 1.14 0 01-1.392.618l-.515-.36a1.14 1.14 0 00-1.494.026l-.526.435a1.14 1.14 0 01-1.082.098c-.55-.218-1.02-.684-1.11-1.226a1.14 1.14 0 01.098-1.082l.435-.526a1.14 1.14 0 00.026-1.494l-.36-.515a1.14 1.14 0 01.618-1.392c.24-.09.495-.135.75-.135h.526a1.14 1.14 0 00.99-.63c.17-.37.41-.69.7-.95l.526-.435a1.14 1.14 0 011.638 0l.526.435c.29.26.53.58.7.95a1.14 1.14 0 00.99.63h.526c.255 0 .51.045.75.135a1.14 1.14 0 01.618 1.392l-.36.515a1.14 1.14 0 00.026 1.494l.435.526a1.14 1.14 0 01.098 1.082c-.09.542-.56 1.008-1.11 1.226a1.14 1.14 0 01-1.082-.098l-.526-.435a1.14 1.14 0 00-1.494-.026l-.515.36a1.14 1.14 0 01-1.392-.618c-.09-.24-.135-.495-.135-.75v-.526a1.14 1.14 0 00-.63-.99c-.37-.17-.69-.41-.95-.7l-.435-.526a1.14 1.14 0 010-1.638l.435-.526c.26-.29.58-.53.95-.7a1.14 1.14 0 00.63-.99v-.526c0-.255.045-.51.135-.75a1.14 1.14 0 011.392-.618l.515.36a1.14 1.14 0 001.494-.026l.526-.435a1.14 1.14 0 011.082-.098c.55.218 1.02.684 1.11 1.226a1.14 1.14 0 01-.098 1.082l-.435.526a1.14 1.14 0 00-.026 1.494l.36.515a1.14 1.14 0 01-.618 1.392c-.24.09-.495.135-.75.135h-.526a1.14 1.14 0 00-.99.63c-.17.37-.41.69-.7.95l-.526.435a1.14 1.14 0 01-1.638 0l-.526-.435c-.29-.26-.53-.58-.7-.95a1.14 1.14 0 00-.99-.63h-.526c-.255 0-.51-.045-.75-.135a1.14 1.14 0 01-.618-1.392l.36-.515a1.14 1.14 0 00-.026-1.494l-.435-.526a1.14 1.14 0 01-.098-1.082z" />
  </svg>
);

export const UserCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
