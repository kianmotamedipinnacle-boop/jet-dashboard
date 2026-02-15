'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Brain, LogOut, Menu } from 'lucide-react';

interface NavigationProps {
  currentView: 'kanban' | 'brain';
  onViewChange: (view: 'kanban' | 'brain') => void;
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
      id: 'kanban' as const,
      label: 'Kanban Board',
      icon: LayoutGrid,
    },
    {
      id: 'brain' as const,
      label: 'Second Brain',
      icon: Brain,
    },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">Jet Dashboard</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentView === item.id
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white p-2"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-700">
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
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
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