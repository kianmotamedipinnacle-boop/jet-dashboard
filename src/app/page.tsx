'use client';

import { useState, useEffect } from 'react';
import { SideNavLayout } from '@/components/SideNavLayout';
import { KanbanBoard } from '@/components/KanbanBoard';
import { BrainSection } from '@/components/BrainSection';
import { DashboardOverview } from '@/components/DashboardOverview';
import { ActivityLog } from '@/components/ActivityLog';
import { DocsSection } from '@/components/DocsSection';
import { StatusIndicator } from '@/components/StatusIndicator';
import { AnimatedJetAvatar } from '@/components/AnimatedJetAvatar';
import { JetProductivityDashboard } from '@/components/JetProductivityDashboard';
import { PageTransition } from '@/components/PageTransition';
import { MultiChatInterface } from '@/components/multi-chat';
import { KanbanCard, BrainCard } from '@/lib/database';

type AgentStatus = 'idle' | 'working' | 'thinking' | 'error';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'kanban' | 'brain' | 'log' | 'docs' | 'medicare' | 'multi-chat'>('dashboard');
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
    <SideNavLayout 
      currentView={currentView} 
      onViewChange={setCurrentView}
      agentStatus={agentStatus}
    >
      
      <div className="h-full overflow-y-auto">
        {/* Status Header */}
        <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <StatusIndicator status={agentStatus} />
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {currentView === 'dashboard' && 'Dashboard Overview'}
                    {currentView === 'multi-chat' && 'Multi-Chat Interface'}
                    {currentView === 'medicare' && 'Jet Productivity Dashboard'}
                    {currentView === 'kanban' && "Jet's Task Board"}
                    {currentView === 'brain' && 'Second Brain'}
                    {currentView === 'log' && 'Activity Log'}
                    {currentView === 'docs' && 'Documents'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Last sync: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
        {currentView === 'dashboard' && (
          <DashboardOverview 
            onNewNote={handleNewNote} 
            agentStatus={agentStatus}
            setAgentStatus={setAgentStatus}
          />
        )}
        
        {currentView === 'medicare' && (
          <JetProductivityDashboard />
        )}
        
        {currentView === 'multi-chat' && (
          <MultiChatInterface />
        )}
        
        {currentView === 'kanban' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Jet's Task Board</h1>
              <p className="text-gray-400">My current projects and ongoing work</p>
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
    </SideNavLayout>
  );
}