'use client';

import { format } from 'date-fns';
import { Calendar, Tag, FileText } from 'lucide-react';
import { BrainCard as BrainCardType } from '@/lib/database';

interface BrainCardProps {
  card: BrainCardType;
  onEdit?: (card: BrainCardType) => void;
}

export function BrainCard({ card, onEdit }: BrainCardProps) {
  const formatTags = (tags?: string) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(Boolean);
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-700 text-gray-300';
    
    const colors: Record<string, string> = {
      business: 'bg-blue-700 text-blue-300',
      product: 'bg-purple-700 text-purple-300',
      marketing: 'bg-pink-700 text-pink-300',
      personal: 'bg-green-700 text-green-300',
      tech: 'bg-orange-700 text-orange-300',
      ideas: 'bg-yellow-700 text-yellow-300',
    };

    return colors[category.toLowerCase()] || 'bg-gray-700 text-gray-300';
  };

  return (
    <div
      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
      onClick={() => onEdit?.(card)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-white font-medium text-sm line-clamp-2 flex-1">
          {card.title}
        </h3>
        {card.category && (
          <div className={`px-2 py-1 rounded text-xs font-medium ml-2 ${getCategoryColor(card.category)}`}>
            {card.category}
          </div>
        )}
      </div>
      
      {card.content && (
        <div className="flex items-start mb-3">
          <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-gray-400 text-sm line-clamp-3 flex-1">
            {card.content}
          </p>
        </div>
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