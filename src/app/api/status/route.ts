import { NextRequest, NextResponse } from 'next/server';
import { db, Status } from '@/lib/database';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM status ORDER BY updated_at DESC LIMIT 1');
    let status = stmt.get() as Status | undefined;
    
    // If no status exists, create a default one
    if (!status) {
      const now = Date.now();
      const insertStmt = db.prepare('INSERT INTO status (status, last_sync, updated_at) VALUES (?, ?, ?)');
      const result = insertStmt.run('Idle', now, now);
      
      status = {
        id: result.lastInsertRowid as number,
        status: 'Idle',
        last_sync: now,
        updated_at: now
      };
    }
    
    return NextResponse.json(status);
  } catch (error) {
    console.error('Status fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { status: newStatus } = await request.json();
    
    if (!['Idle', 'Thinking', 'Working', 'Sleeping'].includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO status (id, status, last_sync, updated_at) 
      VALUES (1, ?, ?, ?)
    `);
    
    stmt.run(newStatus, now, now);
    
    const updatedStatus = {
      id: 1,
      status: newStatus as Status['status'],
      last_sync: now,
      updated_at: now
    };
    
    return NextResponse.json(updatedStatus);
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}