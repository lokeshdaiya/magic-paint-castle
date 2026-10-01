import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 px-4 py-2 bg-amber-500/90 backdrop-blur-md border border-amber-300/60 text-white rounded-full font-bold text-xs shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4 text-white" />
      <span>Offline Mode — All drawing, colors & stamps work completely offline!</span>
    </div>
  );
};
