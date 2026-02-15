'use client';

import { useEffect, useState } from 'react';

interface StatusIndicatorProps {
  status: 'idle' | 'working' | 'thinking' | 'error';
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (status !== 'idle') {
      setPulse(true);
      const interval = setInterval(() => {
        setPulse(prev => !prev);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setPulse(false);
    }
  }, [status]);

  const getStatusColor = () => {
    switch (status) {
      case 'idle':
        return 'bg-green-500';
      case 'working':
        return 'bg-yellow-500';
      case 'thinking':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusAnimation = () => {
    switch (status) {
      case 'working':
        return 'animate-pulse';
      case 'thinking':
        return 'animate-bounce';
      case 'error':
        return 'animate-ping';
      default:
        return '';
    }
  };

  return (
    <div className="absolute -bottom-1 -right-1">
      <div 
        className={`w-5 h-5 rounded-full border-2 border-slate-800 ${getStatusColor()} ${getStatusAnimation()}`}
        title={status.charAt(0).toUpperCase() + status.slice(1)}
      />
    </div>
  );
}