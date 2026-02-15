import { NextRequest, NextResponse } from 'next/server';
import { db, KanbanCard } from '@/lib/database';
import { validatePassword } from '@/lib/auth';

// GET - Fetch all kanban cards
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const autoPickup = url.searchParams.get('auto_pickup') === 'true';
    const status = url.searchParams.get('status');
    
    let query = 'SELECT * FROM kanban_cards';
    let params: any[] = [];
    
    const conditions: string[] = [];
    
    if (autoPickup) {
      conditions.push('auto_pickup = ?');
      params.push(1);
    }
    
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY priority DESC, created_date DESC';
    
    const stmt = db.prepare(query);
    const cards = stmt.all(...params) as KanbanCard[];
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching kanban cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

// POST - Create new kanban card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, tags, status, priority, auto_pickup, password } = body;

    // Validate password for API access
    if (password && !validatePassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO kanban_cards (title, description, tags, status, priority, auto_pickup, created_date, updated_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      title, 
      description || null, 
      tags || null, 
      status || 'backlog',
      priority || 'medium',
      auto_pickup ? 1 : 0,
      now, 
      now
    );
    
    const newCard: KanbanCard = {
      id: result.lastInsertRowid as number,
      title,
      description,
      tags,
      status: status || 'backlog',
      priority: priority || 'medium',
      auto_pickup: auto_pickup || false,
      created_date: now,
      updated_date: now
    };

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error('Error creating kanban card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}