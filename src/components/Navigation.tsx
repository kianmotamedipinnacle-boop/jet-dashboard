'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Brain, LogOut, Menu, ScrollText, FileText, Home, Zap, MessageSquare } from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'kanban' | 'brain' | 'log' | 'docs' | 'medicare' | 'multi-chat';
  onViewChange: (view: 'dashboard' | 'kanban' | 'brain' | 'log' | 'docs' | 'medicare' | 'multi-chat') => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'multi-chat' as const,
      label: 'Multi-Chat',
      icon: MessageSquare,
    },
    {
      id: 'medicare' as const,
      label: 'Jet Productivity',
      icon: Zap,
    },
    {
      id: 'kanban' as const,
      label: 'Kanban Board',
      icon: LayoutGrid,
    },
    {
      id: 'brain' as const,
      label: 'Second Brain',
      icon: Brain,
    },
    {
      id: 'log' as const,
      label: 'Log',
      icon: ScrollText,
    },
    {
      id: 'docs' as const,
      label: 'Docs',
      icon: FileText,
    },
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-600">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Left side - Navigation tabs */}
          <div className="flex items-center">
            <div className="flex space-x-8">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center px-1 py-4 border-b-2 text-sm font-medium transition-colors ${
                      currentView === item.id
                        ? 'border-blue-500 text-white'
                        : 'border-transparent text-slate-400 hover:text-white hover:border-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center text-slate-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-400 hover:text-white focus:outline-none focus:text-white p-2"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}