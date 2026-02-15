import { NextRequest, NextResponse } from 'next/server';
import { db, BrainCard } from '@/lib/database';
import { validatePassword } from '@/lib/auth';

// PUT - Update brain card
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, content, tags, category, password } = body;
    const id = parseInt(params.id);

    // Validate password for API access
    if (password && !validatePassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const now = Date.now();
    const stmt = db.prepare(`
      UPDATE brain_cards 
      SET title = COALESCE(?, title),
          content = COALESCE(?, content),
          tags = COALESCE(?, tags),
          category = COALESCE(?, category),
          updated_date = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(title, content, tags, category, now, id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Fetch updated card
    const getStmt = db.prepare('SELECT * FROM brain_cards WHERE id = ?');
    const updatedCard = getStmt.get(id) as BrainCard;

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error updating brain card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

// DELETE - Delete brain card
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const password = url.searchParams.get('password');
    const id = parseInt(params.id);

    // Validate password for API access
    if (password && !validatePassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const stmt = db.prepare('DELETE FROM brain_cards WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting brain card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}