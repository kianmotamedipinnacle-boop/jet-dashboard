'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { KanbanBoard } from '@/components/KanbanBoard';
import { BrainSection } from '@/components/BrainSection';
import { DashboardOverview } from '@/components/DashboardOverview';
import { ActivityLog } from '@/components/ActivityLog';
import { DocsSection } from '@/components/DocsSection';
import { StatusIndicator } from '@/components/StatusIndicator';
import { JetAvatar } from '@/components/JetAvatar';
import { KanbanCard, BrainCard } from '@/lib/database';

type AgentStatus = 'idle' | 'working' | 'thinking' | 'error';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'kanban' | 'brain' | 'log' | 'docs'>('dashboard');
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>([]);
  const [brainCards, setBrainCards] = useState<BrainCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('idle');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchKanbanCards = async () => {
    try {
      setAgentStatus('working');
      const response = await fetch('/api/kanban');
      if (response.ok) {
        const cards = await response.json();
        setKanbanCards(cards);
        setAgentStatus('idle');
      } else {
        setAgentStatus('error');
        setTimeout(() => setAgentStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error fetching kanban cards:', error);
      setAgentStatus('error');
      setTimeout(() => setAgentStatus('idle'), 3000);
    }
  };

  const fetchBrainCards = async () => {
    try {
      setAgentStatus('working');
      const response = await fetch('/api/brain');
      if (response.ok) {
        const cards = await response.json();
        setBrainCards(cards);
        setAgentStatus('idle');
      } else {
        setAgentStatus('error');
        setTimeout(() => setAgentStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error fetching brain cards:', error);
      setAgentStatus('error');
      setTimeout(() => setAgentStatus('idle'), 3000);
    }
  };

  const handleNewNote = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setAgentStatus('working');
      await Promise.all([fetchKanbanCards(), fetchBrainCards()]);
      setLoading(false);
      setAgentStatus('idle');
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg flex items-center gap-3">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          Initializing Jet...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Header with Jet Avatar & Status */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Thomas-style Jet Avatar */}
              <div className="relative">
                <JetAvatar status={agentStatus} size={64} />
                <StatusIndicator status={agentStatus} />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Jet 
                  <div className={`w-3 h-3 rounded-full ${
                    agentStatus === 'idle' ? 'bg-green-500' : 
                    agentStatus === 'working' ? 'bg-yellow-500 animate-pulse' :
                    agentStatus === 'thinking' ? 'bg-blue-500 animate-bounce' :
                    'bg-red-500'
                  }`} />
                </h1>
                <p className="text-slate-400 text-sm capitalize">
                  {agentStatus === 'idle' ? 'Ready for tasks' : 
                   agentStatus === 'working' ? 'Processing...' :
                   agentStatus === 'thinking' ? 'Analyzing...' :
                   'Error occurred'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>Last sync: {new Date().toLocaleTimeString()}</span>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {currentView === 'dashboard' && (
          <DashboardOverview 
            onNewNote={handleNewNote} 
            agentStatus={agentStatus}
            setAgentStatus={setAgentStatus}
          />
        )}
        
        {currentView === 'kanban' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Task Board</h1>
              <p className="text-gray-400">Current projects and actionable items</p>
            </div>
            <KanbanBoard cards={kanbanCards} onCardsChange={fetchKanbanCards} />
          </div>
        )}
        
        {currentView === 'brain' && (
          <BrainSection cards={brainCards} onCardsChange={fetchBrainCards} />
        )}
        
        {currentView === 'log' && (
          <ActivityLog />
        )}
        
        {currentView === 'docs' && (
          <DocsSection />
        )}
      </main>
    </div>
  );
}