import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const docs = db.getAllDocs();
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Docs fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch docs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, category } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const now = Date.now();
    const newDoc = db.addDoc({
      title,
      content,
      category: category || undefined,
      created_at: now,
      updated_at: now
    });
    
    return NextResponse.json(newDoc);
  } catch (error) {
    console.error('Doc creation error:', error);
    return NextResponse.json({ error: 'Failed to create doc' }, { status: 500 });
  }
}