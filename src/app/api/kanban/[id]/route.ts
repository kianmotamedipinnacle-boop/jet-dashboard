import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// PUT - Update kanban card
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();
    const { title, description, tags, status, priority, auto_pickup, order } = body;

    // Build update object with only provided fields
    const updates: any = { updated_date: Date.now() };
    
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (tags !== undefined) updates.tags = tags;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (auto_pickup !== undefined) updates.auto_pickup = auto_pickup;
    if (order !== undefined) updates.order = order;

    const updatedCard = db.updateKanbanCard(idNum, updates);

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
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const deleted = db.deleteKanbanCard(idNum);

    if (!deleted) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting kanban card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}