import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const docs = db.getAllDocs();
    const doc = docs.find(d => d.id === idNum);
    
    if (!doc) {
      return NextResponse.json({ error: 'Doc not found' }, { status: 404 });
    }
    
    return NextResponse.json(doc);
  } catch (error) {
    console.error('Doc fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch doc' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const { title, content, category } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const updatedDoc = db.updateDoc(idNum, {
      title,
      content,
      category: category || undefined,
      updated_at: Date.now()
    });
    
    if (!updatedDoc) {
      return NextResponse.json({ error: 'Doc not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error('Doc update error:', error);
    return NextResponse.json({ error: 'Failed to update doc' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const deleted = db.deleteDoc(idNum);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Doc not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Doc deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete doc' }, { status: 500 });
  }
}