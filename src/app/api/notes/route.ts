import { NextRequest, NextResponse } from 'next/server';
import { db, Note } from '@/lib/database';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM notes ORDER BY created_at DESC');
    const notes = stmt.all() as Note[];
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Notes fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    }
    
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO notes (content, seen, created_at)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(content, false, now);
    
    const newNote = {
      id: result.lastInsertRowid as number,
      content,
      seen: false,
      created_at: now,
      processed_at: null
    };
    
    return NextResponse.json(newNote);
  } catch (error) {
    console.error('Note creation error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}