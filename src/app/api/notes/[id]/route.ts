import { NextRequest, NextResponse } from 'next/server';
import { db, Note } from '@/lib/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const { seen } = await request.json();
    
    if (typeof seen !== 'boolean') {
      return NextResponse.json({ error: 'Invalid seen value' }, { status: 400 });
    }
    
    const now = Date.now();
    const stmt = db.prepare(`
      UPDATE notes 
      SET seen = ?, processed_at = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(seen, seen ? now : null, id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    const updatedStmt = db.prepare('SELECT * FROM notes WHERE id = ?');
    const updatedNote = updatedStmt.get(id) as Note;
    
    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Note update error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Note deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}