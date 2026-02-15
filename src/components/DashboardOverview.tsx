'use client';

import { useState, useEffect } from 'react';
import { ActivityLog, Note, KanbanCard, Status } from '@/lib/database';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, MessageSquare, Activity } from 'lucide-react';

interface DashboardOverviewProps {
  onNewNote: () => void;
  agentStatus: 'idle' | 'working' | 'thinking' | 'error';
  setAgentStatus: (status: 'idle' | 'working' | 'thinking' | 'error') => void;
}

export function DashboardOverview({ onNewNote, agentStatus, setAgentStatus }: DashboardOverviewProps) {
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [tasksInProgress, setTasksInProgress] = useState<number>(0);
  const [unreadNotes, setUnreadNotes] = useState<number>(0);
  const [noteInput, setNoteInput] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent activity (last 5)
      const activityResponse = await fetch('/api/log?limit=5');
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData.logs);
      }
      
      // Fetch kanban cards to count in-progress tasks
      const kanbanResponse = await fetch('/api/kanban?status=in_progress');
      if (kanbanResponse.ok) {
        const kanbanData = await kanbanResponse.json();
        setTasksInProgress(kanbanData.length);
      }
      
      // Fetch notes to count unread
      const notesResponse = await fetch('/api/notes');
      if (notesResponse.ok) {
        const notesData = await notesResponse.json();
        const unread = notesData.filter((note: Note) => !note.seen).length;
        setUnreadNotes(unread);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: noteInput }),
      });

      if (response.ok) {
        setNoteInput('');
        onNewNote();
        fetchDashboardData(); // Refresh counts
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-800 p-6 rounded-lg">
                <div className="h-6 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of Jet&apos;s current status and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-400">Tasks in Progress</p>
              <p className="text-2xl font-bold text-white">{tasksInProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-400">Unread Notes</p>
              <p className="text-2xl font-bold text-white">{unreadNotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-400">Recent Activity</p>
              <p className="text-2xl font-bold text-white">{recentActivity.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.action_type}</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Note Input */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Send a note to Jet</h3>
          <form onSubmit={handleSubmitNote} className="space-y-4">
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Type your note here..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <button
              type="submit"
              disabled={!noteInput.trim()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Send Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}