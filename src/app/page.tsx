'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { KanbanBoard } from '@/components/KanbanBoard';
import { BrainSection } from '@/components/BrainSection';
import { KanbanCard, BrainCard } from '@/lib/database';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<'kanban' | 'brain'>('kanban');
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>([]);
  const [brainCards, setBrainCards] = useState<BrainCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKanbanCards = async () => {
    try {
      const response = await fetch('/api/kanban');
      if (response.ok) {
        const cards = await response.json();
        setKanbanCards(cards);
      }
    } catch (error) {
      console.error('Error fetching kanban cards:', error);
    }
  };

  const fetchBrainCards = async () => {
    try {
      const response = await fetch('/api/brain');
      if (response.ok) {
        const cards = await response.json();
        setBrainCards(cards);
      }
    } catch (error) {
      console.error('Error fetching brain cards:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchKanbanCards(), fetchBrainCards()]);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {currentView === 'kanban' ? (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Kanban Board</h1>
              <p className="text-gray-400">Manage your tasks and track progress</p>
            </div>
            <KanbanBoard cards={kanbanCards} onCardsChange={fetchKanbanCards} />
          </div>
        ) : (
          <BrainSection cards={brainCards} onCardsChange={fetchBrainCards} />
        )}
      </main>
    </div>
  );
}