import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// GET - Get current status
export async function GET() {
  try {
    const status = db.getStatus();
    return NextResponse.json(status || {
      id: 1,
      status: 'Idle',
      last_sync: Date.now(),
      updated_at: Date.now()
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

// PUT - Update status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['Idle', 'Thinking', 'Working', 'Sleeping'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedStatus = db.updateStatus({
      status,
      last_sync: Date.now(),
      updated_at: Date.now()
    });

    return NextResponse.json(updatedStatus);
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}