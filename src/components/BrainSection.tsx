'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { BrainCard } from './BrainCard';
import { CardModal } from './CardModal';
import { BrainCard as BrainCardType } from '@/lib/database';

interface BrainSectionProps {
  cards: BrainCardType[];
  onCardsChange: () => void;
}

export function BrainSection({ cards, onCardsChange }: BrainSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredCards, setFilteredCards] = useState(cards);
  const [editingCard, setEditingCard] = useState<BrainCardType | null>(null);
  const [showNewCardModal, setShowNewCardModal] = useState(false);

  const categories = Array.from(new Set(cards.map(card => card.category).filter(Boolean)));

  useEffect(() => {
    let filtered = cards;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        card =>
          card.title.toLowerCase().includes(term) ||
          card.content?.toLowerCase().includes(term) ||
          card.tags?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }

    setFilteredCards(filtered);
  }, [cards, searchTerm, selectedCategory]);

  const handleSaveCard = async (cardData: Partial<BrainCardType>) => {
    try {
      if (editingCard) {
        // Update existing card
        const response = await fetch(`/api/brain/${editingCard.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cardData),
        });

        if (response.ok) {
          onCardsChange();
          setEditingCard(null);
        }
      } else {
        // Create new card
        const response = await fetch('/api/brain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cardData),
        });

        if (response.ok) {
          onCardsChange();
          setShowNewCardModal(false);
        }
      }
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    try {
      const response = await fetch(`/api/brain/${cardId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onCardsChange();
        setEditingCard(null);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Second Brain</h1>
          <button
            onClick={() => setShowNewCardModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Idea
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 h-4 w-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white">{cards.length}</div>
            <div className="text-sm text-gray-400">Total Ideas</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white">{categories.length}</div>
            <div className="text-sm text-gray-400">Categories</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white">{filteredCards.length}</div>
            <div className="text-sm text-gray-400">Filtered Results</div>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {searchTerm || selectedCategory ? 'No ideas match your filters' : 'No ideas yet'}
            </div>
            {!searchTerm && !selectedCategory && (
              <button
                onClick={() => setShowNewCardModal(true)}
                className="text-blue-400 hover:text-blue-300"
              >
                Create your first idea
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map(card => (
              <BrainCard
                key={card.id}
                card={card}
                onEdit={setEditingCard}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewCardModal && (
        <CardModal
          type="brain"
          onClose={() => setShowNewCardModal(false)}
          onSave={handleSaveCard}
        />
      )}

      {editingCard && (
        <CardModal
          type="brain"
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onSave={handleSaveCard}
          onDelete={() => handleDeleteCard(editingCard.id)}
        />
      )}
    </>
  );
}