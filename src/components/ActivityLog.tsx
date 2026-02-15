'use client';

import { useState, useEffect } from 'react';
import { ActivityLog as ActivityLogType } from '@/lib/database';
import { formatDistanceToNow } from 'date-fns';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/log?page=${page}&limit=${pagination.limit}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      fetchLogs(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      fetchLogs(pagination.page + 1);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      absolute: date.toLocaleString()
    };
  };

  const getActionTypeColor = (actionType: string) => {
    const colors: { [key: string]: string } = {
      'task': 'bg-blue-900 text-blue-300',
      'email': 'bg-green-900 text-green-300',
      'build': 'bg-purple-900 text-purple-300',
      'research': 'bg-yellow-900 text-yellow-300',
      'system': 'bg-gray-900 text-gray-300',
      'error': 'bg-red-900 text-red-300'
    };
    
    return colors[actionType.toLowerCase()] || 'bg-gray-900 text-gray-300';
  };

  useEffect(() => {
    fetchLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && logs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Activity Log</h1>
          <p className="text-gray-400">Chronological log of all activities</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg border border-gray-700 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="h-3 bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Activity Log</h1>
        <p className="text-gray-400">Chronological log of all activities</p>
      </div>

      {logs.length > 0 ? (
        <>
          <div className="space-y-4">
            {logs.map((log) => {
              const timeFormat = formatTimestamp(log.timestamp);
              return (
                <div key={log.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionTypeColor(log.action_type)}`}>
                          {log.action_type}
                        </span>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          <span title={timeFormat.absolute}>{timeFormat.relative}</span>
                        </div>
                      </div>
                      <p className="text-white">{log.description}</p>
                      {log.metadata && (
                        <details className="mt-2">
                          <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                            View metadata
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-900 rounded text-xs text-gray-300 overflow-x-auto">
                            {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <span>•</span>
                <span>
                  {pagination.total} total entries
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={pagination.page === 1}
                  className="flex items-center px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={pagination.page === pagination.totalPages}
                  className="flex items-center px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No activity logs found</p>
        </div>
      )}
    </div>
  );
}