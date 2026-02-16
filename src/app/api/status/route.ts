import { NextResponse } from 'next/server';
import { getDB } from '@/lib/database';

export interface StatusUpdate {
  status: 'idle' | 'working' | 'thinking' | 'error' | 'listening' | 'speaking';
  message?: string;
  progress?: number;
  details?: {
    task?: string;
    subtask?: string;
    startTime?: string;
    estimatedCompletion?: string;
  };
}

// In-memory status storage (in production, use Redis or similar)
let currentStatus: StatusUpdate = {
  status: 'idle',
  message: 'Ready for tasks',
  progress: 0
};

// Track status history
let statusHistory: (StatusUpdate & { timestamp: Date })[] = [];

export async function GET() {
  return NextResponse.json({
    current: currentStatus,
    history: statusHistory.slice(-10) // Last 10 status updates
  });
}

export async function PUT(request: Request) {
  try {
    const update: StatusUpdate = await request.json();
    
    // Validate status
    const validStatuses = ['idle', 'working', 'thinking', 'error', 'listening', 'speaking'];
    if (!validStatuses.includes(update.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update current status
    currentStatus = {
      ...update,
      message: update.message || getDefaultMessage(update.status),
      progress: update.progress ?? 0
    };

    // Add to history
    statusHistory.push({
      ...currentStatus,
      timestamp: new Date()
    });

    // Keep history size manageable
    if (statusHistory.length > 100) {
      statusHistory = statusHistory.slice(-50);
    }

    // Log to activity database if working or error
    if (update.status === 'working' || update.status === 'error') {
      try {
        const db = getDB();
        db.addActivityLog({
          timestamp: Date.now(),
          action_type: update.status === 'error' ? 'error' : 'action',
          description: update.message || `Status changed to ${update.status}`,
          metadata: JSON.stringify({
            status: update.status,
            details: update.details,
            progress: update.progress
          })
        });
      } catch (dbError) {
        console.error('Failed to log status to database:', dbError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      status: currentStatus 
    });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

function getDefaultMessage(status: string): string {
  const messages: Record<string, string> = {
    idle: 'Ready for tasks',
    working: 'Processing...',
    thinking: 'Analyzing...',
    error: 'Error occurred',
    listening: 'Listening...',
    speaking: 'Responding...'
  };
  return messages[status] || 'Unknown status';
}