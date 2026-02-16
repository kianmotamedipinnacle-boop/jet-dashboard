'use client';

import { useState, useEffect } from 'react';

interface ActivityIndicatorProps {
  chatType: string;
  unreadCount: number;
  isTyping?: boolean;
  isActive?: boolean;
  lastActivity?: Date;
}

export function ActivityIndicator({ 
  chatType, 
  unreadCount, 
  isTyping = false, 
  isActive = false,
  lastActivity
}: ActivityIndicatorProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate when unread count changes
  useEffect(() => {
    if (unreadCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const getIconAndColors = () => {
    // Generate consistent colors based on the chat name
    const colorSchemes = [
      { colors: 'from-green-500 to-emerald-500', textColor: 'text-green-400', bgColor: 'bg-green-500' },
      { colors: 'from-blue-500 to-cyan-500', textColor: 'text-blue-400', bgColor: 'bg-blue-500' },
      { colors: 'from-purple-500 to-violet-500', textColor: 'text-purple-400', bgColor: 'bg-purple-500' },
      { colors: 'from-orange-500 to-amber-500', textColor: 'text-orange-400', bgColor: 'bg-orange-500' },
      { colors: 'from-pink-500 to-rose-500', textColor: 'text-pink-400', bgColor: 'bg-pink-500' },
      { colors: 'from-indigo-500 to-blue-500', textColor: 'text-indigo-400', bgColor: 'bg-indigo-500' },
      { colors: 'from-teal-500 to-cyan-500', textColor: 'text-teal-400', bgColor: 'bg-teal-500' },
      { colors: 'from-gray-500 to-slate-500', textColor: 'text-gray-400', bgColor: 'bg-gray-500' },
    ];
    
    // Use chat name to determine color index
    const colorIndex = chatType.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorSchemes.length;
    const colorScheme = colorSchemes[colorIndex];
    
    return {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      ),
      ...colorScheme
    };
  };

  const getLastActivityText = () => {
    if (!lastActivity) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - lastActivity.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const { icon, colors, textColor, bgColor } = getIconAndColors();

  return (
    <div className="relative flex items-center space-x-2">
      {/* Chat type icon */}
      <div className={`
        p-2 rounded-lg bg-gradient-to-r ${colors} 
        ${isActive ? 'shadow-lg ring-2 ring-white/20' : 'opacity-70'}
        transition-all duration-300
      `}>
        {icon}
      </div>
      
      {/* Status indicators container */}
      <div className="flex flex-col items-start space-y-1">
        {/* Chat type name and status */}
        <div className="flex items-center space-x-2">
          <span className={`
            font-medium text-sm 
            ${isActive ? 'text-white' : 'text-gray-400'}
            transition-colors duration-300
          `}>
            {chatType}
          </span>
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full ${bgColor} animate-pulse`}></div>
              <div className={`w-1.5 h-1.5 rounded-full ${bgColor} animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
              <div className={`w-1.5 h-1.5 rounded-full ${bgColor} animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>
        
        {/* Last activity */}
        {lastActivity && !isTyping && (
          <span className="text-xs text-gray-500">
            {getLastActivityText()}
          </span>
        )}
        
        {/* Typing status text */}
        {isTyping && (
          <span className={`text-xs ${textColor} animate-fade-in`}>
            Assistant is typing...
          </span>
        )}
      </div>
      
      {/* Unread count badge */}
      {unreadCount > 0 && (
        <div className={`
          absolute -top-1 -right-1 
          min-w-[20px] h-5 px-1 
          bg-red-500 text-white text-xs font-bold 
          rounded-full flex items-center justify-center
          ${isAnimating ? 'animate-bounce' : ''}
          transition-transform duration-300
          shadow-lg
        `}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
      
      {/* Active indicator dot */}
      {isActive && (
        <div className={`
          absolute -bottom-1 left-1/2 transform -translate-x-1/2
          w-2 h-2 rounded-full bg-gradient-to-r ${colors}
          animate-pulse shadow-lg
        `}></div>
      )}
    </div>
  );
}