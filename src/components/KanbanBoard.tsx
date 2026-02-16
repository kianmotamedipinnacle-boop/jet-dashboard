'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverEvent,
  MeasuringStrategy,
  KeyboardCoordinateGetter,
  CollisionDetection,
  rectIntersection,
  getFirstCollision,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Plus, GripVertical, Loader2 } from 'lucide-react';
import { SortableKanbanCard } from './SortableKanbanCard';
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

export function KanbanBoard({ cards, onCardsChange }: KanbanBoardProps) {
  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null);
  const [editingCard, setEditingCard] = useState<KanbanCardType | null>(null);
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [newCardStatus, setNewCardStatus] = useState<KanbanCardType['status']>('backlog');
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [localCards, setLocalCards] = useState(cards);
  const [isUpdating, setIsUpdating] = useState(false);
  const [draggedOver, setDraggedOver] = useState<{ id: string; position: 'before' | 'after' } | null>(null);

  // Update local cards when props change
  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  // Enhanced collision detection for better drop zones
  const customCollisionDetection: CollisionDetection = useCallback((args) => {
    // Start by finding any intersecting droppable
    const rectIntersectionCollisions = rectIntersection(args);
    
    if (rectIntersectionCollisions.length > 0) {
      return rectIntersectionCollisions;
    }

    // If no intersections, return the closest corners collision
    return closestCorners(args);
  }, []);

  // Measuring strategy for better performance
  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.WhileDragging,
    },
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getCardsByStatus = (status: KanbanCardType['status']) => {
    return localCards
      .filter(card => card.status === status)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const card = localCards.find(c => c.id === event.active.id);
    if (card) {
      setActiveCard(card);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      // Add subtle vibration feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active, delta } = event;
    if (!over) {
      setDragOverColumn(null);
      setDraggedOver(null);
      return;
    }

    // Check if we're over a column
    const columnId = COLUMNS.find(col => col.id === over.id)?.id;
    if (columnId) {
      setDragOverColumn(columnId);
      setDraggedOver(null);
    } else {
      // Check if we're over a card and get its column
      const overCard = localCards.find(c => c.id === over.id);
      if (overCard) {
        setDragOverColumn(overCard.status);
        
        // Determine drop position based on cursor position
        const overCardElement = document.querySelector(`[data-id="${over.id}"]`);
        if (overCardElement && delta.y !== 0) {
          const rect = overCardElement.getBoundingClientRect();
          const midpoint = rect.top + rect.height / 2;
          const cursorY = rect.top + delta.y;
          
          setDraggedOver({
            id: over.id.toString(),
            position: cursorY < midpoint ? 'before' : 'after'
          });
        }
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    setActiveCard(null);
    setDragOverColumn(null);
    setDraggedOver(null);
    
    const { active, over } = event;
    if (!over || isUpdating) return;

    const activeCard = localCards.find(c => c.id === active.id);
    if (!activeCard) return;

    setIsUpdating(true);

    try {
      const overId = over.id;
      
      // Check if dropping on a column directly
      const targetColumn = COLUMNS.find(col => col.id === overId);
      if (targetColumn) {
        // Dropping on empty column
        if (activeCard.status !== targetColumn.id) {
          await moveCardToColumn(activeCard, targetColumn.id as KanbanCardType['status']);
        }
        return;
      }

      // Dropping on another card
      const overCard = localCards.find(c => c.id === overId);
      if (!overCard) return;

      if (activeCard.status === overCard.status) {
        // Reordering within the same column
        const columnCards = getCardsByStatus(activeCard.status);
        const oldIndex = columnCards.findIndex(c => c.id === activeCard.id);
        let newIndex = columnCards.findIndex(c => c.id === overCard.id);
        
        // Adjust index based on drop position
        if (draggedOver?.position === 'after') {
          newIndex += 1;
        }
        
        if (oldIndex !== newIndex) {
          await reorderCardsInColumn(activeCard.status, oldIndex, newIndex);
        }
      } else {
        // Moving to a different column
        let targetOrder = overCard.order;
        if (draggedOver?.position === 'after') {
          targetOrder = (targetOrder ?? 0) + 1;
        }
        await moveCardToColumn(activeCard, overCard.status, targetOrder);
      }
    } catch (error) {
      console.error('Drag operation failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const moveCardToColumn = async (
    card: KanbanCardType, 
    newStatus: KanbanCardType['status'],
    targetOrder?: number
  ) => {
    const targetColumnCards = getCardsByStatus(newStatus);
    let newOrder: number;

    if (targetOrder !== undefined) {
      // Insert at specific position
      newOrder = Math.max(0, targetOrder);
    } else {
      // Add to end
      newOrder = targetColumnCards.length;
    }

    // Create optimistic update with proper ordering
    const updatedCards = localCards.map(c => {
      if (c.id === card.id) {
        return { ...c, status: newStatus, order: newOrder };
      }
      // Shift existing cards in target column
      if (c.status === newStatus && c.order >= newOrder) {
        return { ...c, order: c.order + 1 };
      }
      return c;
    });
    
    setLocalCards(updatedCards);

    try {
      // Batch all updates for better performance
      const updatePromises = [];
      
      // Update the moved card
      updatePromises.push(
        fetch(`/api/kanban/${card.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            status: newStatus, 
            order: newOrder,
            updated_date: new Date().toISOString()
          }),
        })
      );

      // Update shifted cards
      targetColumnCards
        .filter(c => c.id !== card.id && c.order >= newOrder)
        .forEach((c, index) => {
          updatePromises.push(
            fetch(`/api/kanban/${c.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                order: c.order + 1,
                updated_date: new Date().toISOString()
              }),
            })
          );
        });

      const responses = await Promise.allSettled(updatePromises);
      
      // Check for any failed requests
      const failedRequests = responses.filter(r => r.status === 'rejected');
      if (failedRequests.length > 0) {
        console.error('Some updates failed:', failedRequests);
      }

      onCardsChange();
      
      // Success feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
    } catch (error) {
      console.error('Error moving card:', error);
      // Revert optimistic update on error
      setLocalCards(cards);
      
      // Error feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
    }
  };

  const reorderCardsInColumn = async (
    status: KanbanCardType['status'],
    oldIndex: number,
    newIndex: number
  ) => {
    const columnCards = getCardsByStatus(status);
    const reorderedCards = arrayMove(columnCards, oldIndex, newIndex);
    
    // Update order values
    const updates = reorderedCards.map((card, index) => ({
      id: card.id,
      order: index
    }));

    // Optimistic update
    const updatedCards = localCards.map(card => {
      const update = updates.find(u => u.id === card.id);
      if (update) {
        return { ...card, order: update.order };
      }
      return card;
    });
    setLocalCards(updatedCards);

    try {
      // Batch update all affected cards
      const updatePromises = updates.map(update => 
        fetch(`/api/kanban/${update.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: update.order }),
        })
      );
      
      await Promise.all(updatePromises);
      onCardsChange();
    } catch (error) {
      console.error('Error reordering cards:', error);
      // Revert on error
      setLocalCards(cards);
    }
  };

  const handleSaveCard = async (cardData: Partial<KanbanCardType>) => {
    try {
      if (editingCard) {
        // Update existing card
        const response = await fetch(`/api/kanban/${editingCard.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
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
          headers: { 'Content-Type': 'application/json' },
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
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map(column => {
            const columnCards = getCardsByStatus(column.id);
            const isHighlighted = dragOverColumn === column.id && activeCard?.status !== column.id;
            
            return (
              <div
                key={column.id}
                className={`bg-gray-900 rounded-lg p-4 min-h-96 transition-all duration-200 ${
                  isHighlighted ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
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
                    className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
                    title="Add card"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <SortableContext
                  id={column.id}
                  items={columnCards.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-24">
                    {columnCards.map(card => (
                      <SortableKanbanCard
                        key={card.id}
                        card={card}
                        onEdit={setEditingCard}
                      />
                    ))}
                    {columnCards.length === 0 && (
                      <div
                        className="h-24 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center"
                        id={column.id}
                      >
                        <p className="text-gray-600 text-sm">Drop cards here</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3 opacity-90">
              <KanbanCard card={activeCard} isDragging />
            </div>
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