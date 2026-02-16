'use client';

import { DynamicMultiChatInterface } from '@/components/multi-chat';

export default function MultiChatDemo() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Demo header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Multi-Chat Interface Demo
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Dynamic chat interface like Claude in VSCode. Create unlimited tabs on any topic, 
            name them anything you want, and close them when done. Features include 
            real-time messaging, persistent state, and intuitive tab management.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-blue-400 font-semibold">Dynamic Tabs</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Create unlimited tabs with custom names for any conversation topic
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="text-green-400 font-semibold">Persistent State</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Your tabs and conversations are saved and restored automatically
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h3 className="text-purple-400 font-semibold">Tab Management</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Close tabs when done, see unread counts, and switch contexts instantly
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/20 to-amber-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <h3 className="text-orange-400 font-semibold">VSCode-like UX</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Familiar interface inspired by Claude's integration in VSCode
            </p>
          </div>
        </div>

        {/* Main multi-chat interface */}
        <div className="h-[calc(100vh-280px)] min-h-[600px]">
          <DynamicMultiChatInterface />
        </div>

        {/* Usage instructions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
              Create New Tabs
            </h3>
            <p className="text-gray-400">
              Click "+ New Tab" to create a conversation. Name it anything like "ProtonMail Setup" or "Cost Analysis".
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
              Manage Tabs
            </h3>
            <p className="text-gray-400">
              Click X to close tabs. See unread message counts. Your tabs persist across page refreshes.
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
              VSCode Experience
            </h3>
            <p className="text-gray-400">
              Works just like Claude in VSCode - dynamic tabs for parallel conversations on any topic.
            </p>
          </div>
        </div>

        {/* Technical info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Built with React, TypeScript, Tailwind CSS • 
            Responsive Design • Dark Theme • Real-time Updates •
            Component-based Architecture
          </p>
        </div>
      </div>
    </div>
  );
}