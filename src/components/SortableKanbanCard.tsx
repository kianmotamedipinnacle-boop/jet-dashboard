'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { KanbanCard } from './KanbanCard';
import { KanbanCard as KanbanCardType } from '@/lib/database';

interface SortableKanbanCardProps {
  card: KanbanCardType;
  onEdit: (card: KanbanCardType) => void;
}

export function SortableKanbanCard({ card, onEdit }: SortableKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: card.id,
    transition: {
      duration: 350,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group relative"
    >
      <div 
        className="absolute left-0 top-0 h-full w-6 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>
      <div className="ml-6">
        <KanbanCard 
          card={card} 
          isDragging={isDragging} 
          onEdit={onEdit} 
        />
      </div>
    </div>
  );
}