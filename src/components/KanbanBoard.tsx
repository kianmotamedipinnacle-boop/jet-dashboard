'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import { KanbanCard } from './KanbanCard';
import { CardModal } from './CardModal';
import { KanbanCard as KanbanCardType } from '@/lib/database';

interface KanbanBoardProps {
  cards: KanbanCardType[];
  onCardsChange: () => void;
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-700' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-700' },
  { id: 'review', title: 'Review', color: 'bg-yellow-700' },
  { id: 'done', title: 'Done', color: 'bg-green-700' },
] as const;

function SortableCard({ card, onEdit }: { card: KanbanCardType; onEdit: (card: KanbanCardType) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard card={card} isDragging={isDragging} onEdit={onEdit} />
    </div>
  );
}

export function KanbanBoard({ cards, onCardsChange }: KanbanBoardProps) {
  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null);
  const [editingCard, setEditingCard] = useState<KanbanCardType | null>(null);
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [newCardStatus, setNewCardStatus] = useState<KanbanCardType['status']>('backlog');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getCardsByStatus = (status: KanbanCardType['status']) => {
    return cards.filter(card => card.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find(c => c.id === event.active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveCard(null);
    
    const { active, over } = event;
    if (!over) return;

    const activeCard = cards.find(c => c.id === active.id);
    if (!activeCard) return;

    const newStatus = over.id as KanbanCardType['status'];
    if (activeCard.status === newStatus) return;

    try {
      const response = await fetch(`/api/kanban/${activeCard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (response.ok) {
        onCardsChange();
      } else {
        console.error('Failed to update card status');
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleSaveCard = async (cardData: Partial<KanbanCardType>) => {
    try {
      if (editingCard) {
        // Update existing card
        const response = await fetch(`/api/kanban/${editingCard.id}`, {
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
        const response = await fetch('/api/kanban', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...cardData,
            status: newCardStatus,
          }),
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
      const response = await fetch(`/api/kanban/${cardId}`, {
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
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map(column => {
            const columnCards = getCardsByStatus(column.id);
            return (
              <SortableContext
                key={column.id}
                id={column.id}
                items={columnCards}
                strategy={verticalListSortingStrategy}
              >
                <div className="bg-gray-900 rounded-lg p-4 min-h-96">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${column.color} mr-2`} />
                      <h2 className="text-white font-semibold">{column.title}</h2>
                      <span className="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {columnCards.length}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setNewCardStatus(column.id);
                        setShowNewCardModal(true);
                      }}
                      className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800"
                      title="Add card"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {columnCards.map(card => (
                      <SortableCard
                        key={card.id}
                        card={card}
                        onEdit={setEditingCard}
                      />
                    ))}
                  </div>
                </div>
              </SortableContext>
            );
          })}
        </div>

        <DragOverlay>
          {activeCard ? (
            <KanbanCard card={activeCard} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      {showNewCardModal && (
        <CardModal
          type="kanban"
          onClose={() => setShowNewCardModal(false)}
          onSave={handleSaveCard}
        />
      )}

      {editingCard && (
        <CardModal
          type="kanban"
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onSave={handleSaveCard}
          onDelete={() => handleDeleteCard(editingCard.id)}
        />
      )}
    </>
  );
}