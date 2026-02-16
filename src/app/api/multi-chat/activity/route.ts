import { NextRequest, NextResponse } from 'next/server';

// Activity tracking (in-memory for now)
const activityStore = new Map<string, {
  unread: number;
  lastActivity: string;
  lastMessage?: string;
}>();

export async function GET(request: NextRequest) {
  try {
    const activity: Record<string, any> = {};
    
    // Get activity for all sessions
    const sessions = ['medicare', 'tech', 'strategy', 'general'];
    
    sessions.forEach(sessionId => {
      activity[sessionId] = activityStore.get(sessionId) || {
        unread: 0,
        lastActivity: new Date().toISOString(),
      };
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, action } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      );
    }

    const currentActivity = activityStore.get(sessionId) || {
      unread: 0,
      lastActivity: new Date().toISOString(),
    };

    if (action === 'markRead') {
      currentActivity.unread = 0;
    } else if (action === 'increment') {
      currentActivity.unread += 1;
    }

    currentActivity.lastActivity = new Date().toISOString();
    activityStore.set(sessionId, currentActivity);

    return NextResponse.json({ success: true, activity: currentActivity });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}