'use client';

import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { KanbanCard, BrainCard } from '@/lib/database';

interface CardModalProps {
  type: 'kanban' | 'brain';
  card?: KanbanCard | BrainCard;
  onClose: () => void;
  onSave: (cardData: any) => void;
  onDelete?: () => void;
}

export function CardModal({ type, card, onClose, onSave, onDelete }: CardModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
    status: 'backlog' as KanbanCard['status'],
    priority: 'medium' as KanbanCard['priority'],
    auto_pickup: false,
    category: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || '',
        description: type === 'kanban' ? (card as KanbanCard).description || '' : '',
        content: type === 'brain' ? (card as BrainCard).content || '' : '',
        tags: card.tags || '',
        status: type === 'kanban' ? (card as KanbanCard).status : 'backlog',
        priority: type === 'kanban' ? (card as KanbanCard).priority || 'medium' : 'medium',
        auto_pickup: type === 'kanban' ? (card as KanbanCard).auto_pickup || false : false,
        category: type === 'brain' ? (card as BrainCard).category || '' : '',
      });
    }
  }, [card, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      const dataToSave = type === 'kanban' 
        ? {
            title: formData.title,
            description: formData.description,
            tags: formData.tags,
            status: formData.status,
            priority: formData.priority,
            auto_pickup: formData.auto_pickup,
          }
        : {
            title: formData.title,
            content: formData.content,
            tags: formData.tags,
            category: formData.category,
          };

      await onSave(dataToSave);
    } catch (error) {
      console.error('Error saving card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this card?')) {
      onDelete();
    }
  };

  const statusOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const categoryOptions = [
    { value: 'business', label: 'Business' },
    { value: 'product', label: 'Product' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'personal', label: 'Personal' },
    { value: 'tech', label: 'Tech' },
    { value: 'ideas', label: 'Ideas' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {card ? 'Edit' : 'New'} {type === 'kanban' ? 'Task' : 'Idea'}
          </h2>
          <div className="flex items-center space-x-2">
            {card && onDelete && (
              <button
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700"
                title="Delete card"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title..."
            />
          </div>

          {type === 'kanban' ? (
            <>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description..."
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as KanbanCard['status'] })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as KanbanCard['priority'] })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  id="auto_pickup"
                  type="checkbox"
                  checked={formData.auto_pickup}
                  onChange={(e) => setFormData({ ...formData, auto_pickup: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="auto_pickup" className="ml-2 block text-sm text-gray-300">
                  Auto-pickup (Jet will automatically start working on this task)
                </label>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your idea or note..."
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category...</option>
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tags separated by commas..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}