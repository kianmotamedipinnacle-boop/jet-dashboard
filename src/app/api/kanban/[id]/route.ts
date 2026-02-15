import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// PUT - Update kanban card
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, description, tags, status, priority, auto_pickup } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const updatedCard = db.updateKanbanCard(id, {
      title,
      description,
      tags,
      status,
      priority,
      auto_pickup,
      updated_date: Date.now()
    });

    if (!updatedCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error updating kanban card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

// DELETE - Delete kanban card
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const deleted = db.deleteKanbanCard(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting kanban card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}