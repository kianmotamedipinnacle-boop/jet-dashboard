import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const { seen } = await request.json();
    
    if (typeof seen !== 'boolean') {
      return NextResponse.json({ error: 'Invalid seen value' }, { status: 400 });
    }
    
    const updatedNote = db.updateNote(idNum, {
      seen,
      processed_at: seen ? Date.now() : undefined
    });
    
    if (!updatedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Note update error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const deleted = db.deleteNote(idNum);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Note deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}