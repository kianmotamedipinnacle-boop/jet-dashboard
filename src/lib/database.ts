import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/jet-dashboard.db' 
  : path.join(process.cwd(), 'jet-dashboard.db');

const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS kanban_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT,
    status TEXT NOT NULL DEFAULT 'backlog',
    created_date INTEGER NOT NULL,
    updated_date INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS brain_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    tags TEXT,
    category TEXT,
    created_date INTEGER NOT NULL,
    updated_date INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_kanban_status ON kanban_cards(status);
  CREATE INDEX IF NOT EXISTS idx_brain_category ON brain_cards(category);
  CREATE INDEX IF NOT EXISTS idx_brain_tags ON brain_cards(tags);
`);

export { db };

export interface KanbanCard {
  id: number;
  title: string;
  description?: string;
  tags?: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  created_date: number;
  updated_date: number;
}

export interface BrainCard {
  id: number;
  title: string;
  content?: string;
  tags?: string;
  category?: string;
  created_date: number;
  updated_date: number;
}