import { NextRequest, NextResponse } from 'next/server';
import { db, KanbanCard } from '@/lib/database';
import { validatePassword } from '@/lib/auth';

// PUT - Update kanban card
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { title, description, tags, status, priority, auto_pickup, password } = body;
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    // Validate password for API access
    if (password && !validatePassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const now = Date.now();
    const stmt = db.prepare(`
      UPDATE kanban_cards 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          tags = COALESCE(?, tags),
          status = COALESCE(?, status),
          priority = COALESCE(?, priority),
          auto_pickup = COALESCE(?, auto_pickup),
          updated_date = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(title, description, tags, status, priority, auto_pickup !== undefined ? (auto_pickup ? 1 : 0) : null, now, id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Fetch updated card
    const getStmt = db.prepare('SELECT * FROM kanban_cards WHERE id = ?');
    const updatedCard = getStmt.get(id) as KanbanCard;

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error updating kanban card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

// DELETE - Delete kanban card
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const url = new URL(request.url);
    const password = url.searchParams.get('password');
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    // Validate password for API access
    if (password && !validatePassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const stmt = db.prepare('DELETE FROM kanban_cards WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting kanban card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}