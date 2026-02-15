import { NextRequest, NextResponse } from 'next/server';
import { db, Doc } from '@/lib/database';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM docs ORDER BY updated_at DESC');
    const docs = stmt.all() as Doc[];
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Docs fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch docs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, category } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO docs (title, content, category, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(title, content, category || null, now, now);
    
    const newDoc = {
      id: result.lastInsertRowid as number,
      title,
      content,
      category: category || null,
      created_at: now,
      updated_at: now
    };
    
    return NextResponse.json(newDoc);
  } catch (error) {
    console.error('Doc creation error:', error);
    return NextResponse.json({ error: 'Failed to create doc' }, { status: 500 });
  }
}