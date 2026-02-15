import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET - Fetch all brain cards
export async function GET() {
  try {
    const cards = db.getAllBrainCards();
    // Sort by creation date (newest first)
    cards.sort((a, b) => b.created_date - a.created_date);
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching brain cards:', error);
    return NextResponse.json({ error: 'Failed to fetch brain cards' }, { status: 500 });
  }
}

// POST - Create new brain card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, tags, category } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const now = Date.now();
    const newCard = db.addBrainCard({
      title,
      content: content || undefined,
      tags: tags || undefined,
      category: category || undefined,
      created_date: now,
      updated_date: now
    });

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error('Error creating brain card:', error);
    return NextResponse.json({ error: 'Failed to create brain card' }, { status: 500 });
  }
}