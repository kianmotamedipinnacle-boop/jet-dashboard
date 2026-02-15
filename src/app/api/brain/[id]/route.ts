import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// PUT - Update brain card
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();
    const { title, content, tags, category } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const updatedCard = db.updateBrainCard(idNum, {
      title,
      content,
      tags,
      category,
      updated_date: Date.now()
    });

    if (!updatedCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error updating brain card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

// DELETE - Delete brain card
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const deleted = db.deleteBrainCard(idNum);

    if (!deleted) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting brain card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}