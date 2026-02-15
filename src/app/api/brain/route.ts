import { NextRequest, NextResponse } from 'next/server';
import { db, BrainCard } from '@/lib/database';
import { validatePassword } from '@/lib/auth';

// GET - Fetch brain cards with optional search and category filter
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const category = url.searchParams.get('category');

    let query = 'SELECT * FROM brain_cards';
    const params: any[] = [];

    if (search || category) {
      const conditions: string[] = [];
      
      if (search) {
        conditions.push('(title LIKE ? OR content LIKE ? OR tags LIKE ?)');
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      
      if (category) {
        conditions.push('category = ?');
        params.push(category);
      }
      
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ' ORDER BY created_date DESC';

    const stmt = db.prepare(query);
    const cards = stmt.all(...params) as BrainCard[];
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching brain cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

// POST - Create new brain card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, tags, category, password } = body;

    // Validate password for API access
    if (password && !validatePassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO brain_cards (title, content, tags, category, created_date, updated_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(title, content || null, tags || null, category || null, now, now);
    
    const newCard: BrainCard = {
      id: result.lastInsertRowid as number,
      title,
      content,
      tags,
      category,
      created_date: now,
      updated_date: now
    };

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error('Error creating brain card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}