import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    const logs = db.getRecentActivityLogs(limit);
    
    return NextResponse.json({
      logs,
      pagination: {
        page: 1,
        limit,
        total: logs.length,
        totalPages: 1
      }
    });
  } catch (error) {
    console.error('Activity log fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity log' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action_type, description, metadata } = await request.json();
    
    if (!action_type || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newLog = db.addActivityLog({
      timestamp: Date.now(),
      action_type,
      description,
      metadata: metadata ? JSON.stringify(metadata) : undefined
    });
    
    return NextResponse.json(newLog);
  } catch (error) {
    console.error('Activity log creation error:', error);
    return NextResponse.json({ error: 'Failed to create activity log' }, { status: 500 });
  }
}