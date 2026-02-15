'use client';

import { useState, useEffect } from 'react';
import { Doc } from '@/lib/database';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Plus, Edit2, Trash2, Save, X, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function DocsSection() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/docs');
      if (response.ok) {
        const data = await response.json();
        setDocs(data);
      }
    } catch (error) {
      console.error('Failed to fetch docs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoc = () => {
    setEditForm({ title: '', content: '', category: '' });
    setIsCreating(true);
    setSelectedDoc(null);
  };

  const handleEditDoc = (doc: Doc) => {
    setEditForm({
      title: doc.title,
      content: doc.content,
      category: doc.category || ''
    });
    setIsEditing(true);
    setSelectedDoc(doc);
  };

  const handleSaveDoc = async () => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      return;
    }

    try {
      const url = isCreating ? '/api/docs' : `/api/docs/${selectedDoc?.id}`;
      const method = isCreating ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        await fetchDocs();
        setIsEditing(false);
        setIsCreating(false);
        setSelectedDoc(null);
        setEditForm({ title: '', content: '', category: '' });
      }
    } catch (error) {
      console.error('Failed to save doc:', error);
    }
  };

  const handleDeleteDoc = async (doc: Doc) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(`/api/docs/${doc.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchDocs();
        if (selectedDoc?.id === doc.id) {
          setSelectedDoc(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete doc:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditForm({ title: '', content: '', category: '' });
  };

  const handleSelectDoc = (doc: Doc) => {
    if (isEditing || isCreating) {
      return;
    }
    setSelectedDoc(doc);
  };

  const formatDate = (timestamp: number) => {
    return {
      relative: formatDistanceToNow(new Date(timestamp), { addSuffix: true }),
      absolute: new Date(timestamp).toLocaleDateString()
    };
  };

  const groupedDocs = docs.reduce((groups, doc) => {
    const category = doc.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(doc);
    return groups;
  }, {} as Record<string, Doc[]>);

  useEffect(() => {
    fetchDocs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-800 rounded"></div>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Documents</h1>
          <p className="text-gray-400">Manage your documents and reports</p>
        </div>
        <button
          onClick={handleCreateDoc}
          disabled={isEditing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="space-y-4">
          {Object.keys(groupedDocs).length > 0 ? (
            Object.entries(groupedDocs).map(([category, categoryDocs]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  {category}
                </h3>
                {categoryDocs.map((doc) => {
                  const dateFormat = formatDate(doc.updated_at);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => handleSelectDoc(doc)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDoc?.id === doc.id
                          ? 'bg-blue-900 border-blue-600'
                          : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      } ${isEditing || isCreating ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">
                            {doc.title}
                          </h4>
                          <p className="text-xs text-gray-400" title={dateFormat.absolute}>
                            {dateFormat.relative}
                          </p>
                        </div>
                        {!isEditing && !isCreating && (
                          <div className="flex space-x-1 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDoc(doc);
                              }}
                              className="p-1 text-gray-400 hover:text-white"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDoc(doc);
                              }}
                              className="p-1 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No documents found</p>
            </div>
          )}
        </div>

        {/* Document Viewer/Editor */}
        <div className="lg:col-span-2">
          {isCreating || isEditing ? (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">
                  {isCreating ? 'Create Document' : 'Edit Document'}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveDoc}
                    disabled={!editForm.title.trim() || !editForm.content.trim()}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Document title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category (optional)
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Reports, Notes, Research"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content (Markdown supported)
                  </label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={15}
                    placeholder="Write your document content here... Markdown is supported!"
                  />
                </div>
              </div>
            </div>
          ) : selectedDoc ? (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedDoc.title}</h3>
                  {selectedDoc.category && (
                    <span className="inline-block px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full mt-2">
                      {selectedDoc.category}
                    </span>
                  )}
                  <p className="text-sm text-gray-400 mt-2">
                    Created {formatDate(selectedDoc.created_at).relative}
                    {selectedDoc.updated_at !== selectedDoc.created_at && (
                      <span> • Updated {formatDate(selectedDoc.updated_at).relative}</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleEditDoc(selectedDoc)}
                  className="flex items-center px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({...props}) => <h1 className="text-2xl font-bold text-white mb-4" {...props} />,
                    h2: ({...props}) => <h2 className="text-xl font-semibold text-white mb-3" {...props} />,
                    h3: ({...props}) => <h3 className="text-lg font-medium text-white mb-2" {...props} />,
                    p: ({...props}) => <p className="text-gray-300 mb-3 leading-relaxed" {...props} />,
                    ul: ({...props}) => <ul className="text-gray-300 mb-3 list-disc list-inside" {...props} />,
                    ol: ({...props}) => <ol className="text-gray-300 mb-3 list-decimal list-inside" {...props} />,
                    li: ({...props}) => <li className="mb-1" {...props} />,
                    code: ({...props}) => <code className="bg-gray-700 px-1 py-0.5 rounded text-sm" {...props} />,
                    pre: ({...props}) => <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto mb-3" {...props} />,
                    blockquote: ({...props}) => <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 mb-3" {...props} />,
                  }}
                >
                  {selectedDoc.content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="text-center py-12">
                <Eye className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a document to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}