import { NextRequest, NextResponse } from 'next/server';
import { db, Doc } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const stmt = db.prepare('SELECT * FROM docs WHERE id = ?');
    const doc = stmt.get(id) as Doc | undefined;
    
    if (!doc) {
      return NextResponse.json({ error: 'Doc not found' }, { status: 404 });
    }
    
    return NextResponse.json(doc);
  } catch (error) {
    console.error('Doc fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch doc' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const { title, content, category } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const now = Date.now();
    const stmt = db.prepare(`
      UPDATE docs 
      SET title = ?, content = ?, category = ?, updated_at = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(title, content, category || null, now, id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Doc not found' }, { status: 404 });
    }
    
    const updatedStmt = db.prepare('SELECT * FROM docs WHERE id = ?');
    const updatedDoc = updatedStmt.get(id) as Doc;
    
    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error('Doc update error:', error);
    return NextResponse.json({ error: 'Failed to update doc' }, { status: 500 });
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
    
    const stmt = db.prepare('DELETE FROM docs WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Doc not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Doc deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete doc' }, { status: 500 });
  }
}