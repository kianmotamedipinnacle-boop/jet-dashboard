'use client';

import { format } from 'date-fns';
import { Calendar, Tag, Zap, AlertTriangle } from 'lucide-react';
import { KanbanCard as KanbanCardType } from '@/lib/database';

interface KanbanCardProps {
  card: KanbanCardType;
  isDragging?: boolean;
  onEdit?: (card: KanbanCardType) => void;
}

export function KanbanCard({ card, isDragging, onEdit }: KanbanCardProps) {
  const formatTags = (tags?: string) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(Boolean);
  };

  const statusColors = {
    backlog: 'bg-gray-700 text-gray-300',
    in_progress: 'bg-blue-700 text-blue-300',
    review: 'bg-yellow-700 text-yellow-300',
    done: 'bg-green-700 text-green-300',
  };

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-blue-500',
    high: 'text-orange-500',
    urgent: 'text-red-500'
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-3 w-3" />;
      case 'high':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onEdit?.(card)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-white font-medium text-sm line-clamp-2 flex-1">
              {card.title}
            </h3>
            {card.auto_pickup && (
              <div className="flex items-center text-green-400" title="Auto-pickup enabled">
                <Zap className="h-3 w-3" />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 text-xs ${priorityColors[card.priority]}`}>
              {getPriorityIcon(card.priority)}
              <span className="capitalize">{card.priority}</span>
            </div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ml-2 ${statusColors[card.status]}`}>
          {card.status.replace('_', ' ')}
        </div>
      </div>
      
      {card.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-3">
          {card.description}
        </p>
      )}

      {formatTags(card.tags).length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {formatTags(card.tags).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center text-gray-500 text-xs">
        <Calendar className="h-3 w-3 mr-1" />
        {format(new Date(card.created_date), 'MMM dd, yyyy')}
      </div>
    </div>
  );
}