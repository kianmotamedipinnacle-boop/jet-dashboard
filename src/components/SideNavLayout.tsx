'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutGrid, Brain, LogOut, Menu, ScrollText, FileText, 
  Home, Zap, MessageSquare, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { AnimatedJetAvatar } from './AnimatedJetAvatar';

interface SideNavLayoutProps {
  currentView: 'dashboard' | 'kanban' | 'brain' | 'log' | 'docs' | 'medicare' | 'multi-chat';
  onViewChange: (view: 'dashboard' | 'kanban' | 'brain' | 'log' | 'docs' | 'medicare' | 'multi-chat') => void;
  children: React.ReactNode;
  agentStatus?: 'idle' | 'working' | 'thinking' | 'error';
}

export function SideNavLayout({ currentView, onViewChange, children, agentStatus = 'idle' }: SideNavLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'multi-chat' as const, label: 'Multi-Chat', icon: MessageSquare },
    { id: 'medicare' as const, label: 'Jet Productivity', icon: Zap },
    { id: 'kanban' as const, label: 'Kanban Board', icon: LayoutGrid },
    { id: 'brain' as const, label: 'Second Brain', icon: Brain },
    { id: 'log' as const, label: 'Activity Log', icon: ScrollText },
    { id: 'docs' as const, label: 'Documents', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Side Navigation */}
      <nav className={`
        ${isCollapsed ? 'w-20' : 'w-64'} 
        bg-gray-800 border-r border-gray-700 
        transition-all duration-300 ease-in-out
        flex flex-col
      `}>
        {/* Header with Avatar */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <AnimatedJetAvatar status={agentStatus} size={isCollapsed ? 32 : 48} />
              {!isCollapsed && (
                <div>
                  <h1 className="text-white font-bold">Jet Dashboard</h1>
                  <p className="text-gray-400 text-xs">AI Assistant Control</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`
                text-gray-400 hover:text-white p-1 rounded transition-colors
                ${isCollapsed ? 'mx-auto mt-2' : ''}
              `}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 group
                    ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <Icon 
                    size={20} 
                    className={`
                      flex-shrink-0
                      ${isCollapsed ? 'mx-auto' : ''}
                    `}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="
                      absolute left-full ml-2 px-2 py-1 
                      bg-gray-700 text-white text-sm rounded
                      opacity-0 group-hover:opacity-100
                      pointer-events-none transition-opacity
                      whitespace-nowrap z-50
                    ">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-gray-300 hover:bg-gray-700 hover:text-white
              transition-all duration-200 group
            `}
          >
            <LogOut 
              size={20} 
              className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}
            />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="
                absolute left-full ml-2 px-2 py-1 
                bg-gray-700 text-white text-sm rounded
                opacity-0 group-hover:opacity-100
                pointer-events-none transition-opacity
                whitespace-nowrap z-50
              ">
                Logout
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}