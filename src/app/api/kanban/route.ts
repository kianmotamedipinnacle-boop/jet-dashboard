import { NextRequest, NextResponse } from 'next/server';
import { db, KanbanCard } from '@/lib/database';
import { validatePassword } from '@/lib/auth';

// GET - Fetch all kanban cards
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const autoPickup = url.searchParams.get('auto_pickup') === 'true';
    const status = url.searchParams.get('status');
    
    let cards = db.getAllKanbanCards();
    
    // Apply filters
    if (autoPickup) {
      cards = cards.filter(card => card.auto_pickup);
    }
    
    if (status) {
      cards = cards.filter(card => card.status === status);
    }
    
    // Sort by order field (order within columns is handled by frontend)
    cards.sort((a, b) => {
      // Sort by order if they exist, otherwise by created_date
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a.created_date - b.created_date;
    });
    
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching kanban cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

// POST - Create new kanban card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, tags, status, priority, auto_pickup, password } = body;

    // Validate password for API access
    if (password && !validatePassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const now = Date.now();
    const newCard = db.addKanbanCard({
      title,
      description: description || undefined,
      tags: tags || undefined,
      status: status || 'backlog',
      priority: priority || 'medium',
      auto_pickup: auto_pickup || false,
      order: 0, // Will be calculated in db.addKanbanCard
      created_date: now,
      updated_date: now
    });

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error('Error creating kanban card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}