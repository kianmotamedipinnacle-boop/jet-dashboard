'use client';

import { MultiChatInterface } from '@/components/multi-chat';

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
            Experience the complete multi-chat dashboard with specialized AI conversations 
            across Medicare, Tech, Strategy, and General contexts. Features include 
            real-time messaging, activity indicators, mobile responsiveness, and context preservation.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="text-green-400 font-semibold">Medicare Chat</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Agent management, compliance, and Medicare plan assistance
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-blue-400 font-semibold">Tech Chat</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Development support, debugging, and system architecture
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h3 className="text-purple-400 font-semibold">Strategy Chat</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Business planning, growth strategies, and competitive analysis
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/20 to-slate-900/20 border border-gray-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <h3 className="text-gray-400 font-semibold">General Chat</h3>
            </div>
            <p className="text-gray-300 text-sm">
              General assistance, brainstorming, and open conversations
            </p>
          </div>
        </div>

        {/* Main multi-chat interface */}
        <div className="h-[calc(100vh-280px)] min-h-[600px]">
          <MultiChatInterface />
        </div>

        {/* Usage instructions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
              Try the Tabs
            </h3>
            <p className="text-gray-400">
              Click between Medicare, Tech, Strategy, and General tabs. Each maintains its own conversation state.
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
              Send Messages
            </h3>
            <p className="text-gray-400">
              Type questions relevant to each chat type. Use Enter to send, Shift+Enter for new lines.
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
              Mobile Ready
            </h3>
            <p className="text-gray-400">
              Resize your window or view on mobile. The interface adapts with touch-friendly controls.
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