import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const notes = db.getAllNotes();
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
    
    const newNote = db.addNote({
      content,
      seen: false,
      created_at: Date.now(),
      processed_at: undefined
    });
    
    return NextResponse.json(newNote);
  } catch (error) {
    console.error('Note creation error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}