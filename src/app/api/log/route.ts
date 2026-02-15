import { NextRequest, NextResponse } from 'next/server';
import { db, ActivityLog } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    
    const stmt = db.prepare(`
      SELECT * FROM activity_log 
      ORDER BY timestamp DESC 
      LIMIT ? OFFSET ?
    `);
    
    const logs = stmt.all(limit, offset) as ActivityLog[];
    
    const countStmt = db.prepare('SELECT COUNT(*) as total FROM activity_log');
    const { total } = countStmt.get() as { total: number };
    
    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
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
    
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO activity_log (timestamp, action_type, description, metadata)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(now, action_type, description, metadata ? JSON.stringify(metadata) : null);
    
    const newLog = {
      id: result.lastInsertRowid as number,
      timestamp: now,
      action_type,
      description,
      metadata: metadata ? JSON.stringify(metadata) : null
    };
    
    return NextResponse.json(newLog);
  } catch (error) {
    console.error('Activity log creation error:', error);
    return NextResponse.json({ error: 'Failed to create activity log' }, { status: 500 });
  }
}