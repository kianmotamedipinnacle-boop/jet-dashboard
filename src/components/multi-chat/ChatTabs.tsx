'use client';

import { useState } from 'react';
import { ActivityIndicator } from './ActivityIndicator';

export type ChatType = 'Medicare' | 'Tech' | 'Strategy' | 'General';

interface ChatTabData {
  type: ChatType;
  unreadCount: number;
  isTyping: boolean;
  lastActivity?: Date;
}

interface ChatTabsProps {
  activeTab: ChatType;
  onTabChange: (tab: ChatType) => void;
  tabData: ChatTabData[];
}

export function ChatTabs({ activeTab, onTabChange, tabData }: ChatTabsProps) {
  const [hoveredTab, setHoveredTab] = useState<ChatType | null>(null);

  const getTabColor = (tabType: ChatType, isActive: boolean, isHovered: boolean) => {
    const baseColors = {
      Medicare: {
        active: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg ring-2 ring-green-400/30',
        inactive: 'text-green-400 hover:bg-green-900/20',
        border: 'border-green-500/30'
      },
      Tech: {
        active: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg ring-2 ring-blue-400/30',
        inactive: 'text-blue-400 hover:bg-blue-900/20',
        border: 'border-blue-500/30'
      },
      Strategy: {
        active: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg ring-2 ring-purple-400/30',
        inactive: 'text-purple-400 hover:bg-purple-900/20',
        border: 'border-purple-500/30'
      },
      General: {
        active: 'bg-gradient-to-r from-gray-600 to-slate-600 text-white shadow-lg ring-2 ring-gray-400/30',
        inactive: 'text-gray-400 hover:bg-gray-700/20',
        border: 'border-gray-500/30'
      }
    };

    const colors = baseColors[tabType];
    if (isActive) return colors.active;
    if (isHovered) return `${colors.inactive} ${colors.border} border`;
    return colors.inactive;
  };

  const getTabIcon = (tabType: ChatType) => {
    switch (tabType) {
      case 'Medicare':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Tech':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'Strategy':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 001.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'General':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700">
      {/* Desktop tabs */}
      <div className="hidden md:flex">
        {tabData.map((tab) => {
          const isActive = activeTab === tab.type;
          const isHovered = hoveredTab === tab.type;
          
          return (
            <button
              key={tab.type}
              onClick={() => onTabChange(tab.type)}
              onMouseEnter={() => setHoveredTab(tab.type)}
              onMouseLeave={() => setHoveredTab(null)}
              className={`
                flex-1 relative px-6 py-4 transition-all duration-300
                ${getTabColor(tab.type, isActive, isHovered)}
                ${isActive ? 'transform scale-[1.02]' : 'hover:transform hover:scale-[1.01]'}
              `}
            >
              {/* Tab content */}
              <div className="flex items-center justify-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getTabIcon(tab.type)}
                  <span className="font-medium hidden lg:inline">
                    {tab.type}
                  </span>
                </div>
                
                {/* Unread badge */}
                {tab.unreadCount > 0 && (
                  <div className="
                    min-w-[20px] h-5 px-1.5 
                    bg-red-500 text-white text-xs font-bold 
                    rounded-full flex items-center justify-center
                    animate-bounce shadow-lg
                  ">
                    {tab.unreadCount > 99 ? '99+' : tab.unreadCount}
                  </div>
                )}
                
                {/* Typing indicator */}
                {tab.isTyping && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              
              {/* Active tab indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-md shadow-lg"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile tabs - Horizontal scroll */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 px-4 py-2">
          {tabData.map((tab) => {
            const isActive = activeTab === tab.type;
            
            return (
              <button
                key={tab.type}
                onClick={() => onTabChange(tab.type)}
                className={`
                  flex-shrink-0 relative px-4 py-3 mx-1 rounded-lg transition-all duration-300
                  ${isActive 
                    ? getTabColor(tab.type, true, false)
                    : getTabColor(tab.type, false, false)
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                  <div className="relative">
                    {getTabIcon(tab.type)}
                    
                    {/* Mobile unread badge */}
                    {tab.unreadCount > 0 && (
                      <div className="
                        absolute -top-2 -right-2
                        min-w-[16px] h-4 px-1 
                        bg-red-500 text-white text-xs font-bold 
                        rounded-full flex items-center justify-center
                        animate-bounce
                      ">
                        {tab.unreadCount > 9 ? '9+' : tab.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <span className="text-xs font-medium truncate">
                    {tab.type}
                  </span>
                  
                  {/* Mobile typing indicator */}
                  {tab.isTyping && (
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Tab overview - Desktop only */}
      <div className="hidden lg:flex justify-between items-center px-6 py-2 bg-gray-800/50 border-t border-gray-700/50">
        <div className="text-sm text-gray-400">
          Active Conversations
        </div>
        <div className="flex items-center space-x-4">
          {tabData.map((tab) => (
            <ActivityIndicator
              key={tab.type}
              chatType={tab.type}
              unreadCount={tab.unreadCount}
              isTyping={tab.isTyping}
              isActive={activeTab === tab.type}
              lastActivity={tab.lastActivity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}