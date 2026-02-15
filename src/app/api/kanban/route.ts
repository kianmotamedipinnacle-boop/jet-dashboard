import { NextRequest, NextResponse } from 'next/server';
import { db, KanbanCard } from '@/lib/database';
import { validatePassword } from '@/lib/auth';

// GET - Fetch all kanban cards
export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM kanban_cards ORDER BY created_date DESC');
    const cards = stmt.all() as KanbanCard[];
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
    const { title, description, tags, status, password } = body;

    // Validate password for API access
    if (password && !validatePassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO kanban_cards (title, description, tags, status, created_date, updated_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(title, description || null, tags || null, status || 'backlog', now, now);
    
    const newCard: KanbanCard = {
      id: result.lastInsertRowid as number,
      title,
      description,
      tags,
      status: status || 'backlog',
      created_date: now,
      updated_date: now
    };

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error('Error creating kanban card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}