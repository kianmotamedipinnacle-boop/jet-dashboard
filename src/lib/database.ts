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
    priority TEXT DEFAULT 'medium',
    auto_pickup BOOLEAN DEFAULT 0,
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

  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    action_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata TEXT
  );

  CREATE TABLE IF NOT EXISTS docs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    seen BOOLEAN NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    processed_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL DEFAULT 'Idle',
    last_sync INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_kanban_status ON kanban_cards(status);
  CREATE INDEX IF NOT EXISTS idx_kanban_priority ON kanban_cards(priority);
  CREATE INDEX IF NOT EXISTS idx_kanban_auto_pickup ON kanban_cards(auto_pickup);
  CREATE INDEX IF NOT EXISTS idx_brain_category ON brain_cards(category);
  CREATE INDEX IF NOT EXISTS idx_brain_tags ON brain_cards(tags);
  CREATE INDEX IF NOT EXISTS idx_activity_timestamp ON activity_log(timestamp);
  CREATE INDEX IF NOT EXISTS idx_docs_category ON docs(category);
  CREATE INDEX IF NOT EXISTS idx_notes_seen ON notes(seen);
`);

// Migration function to add new columns to existing tables
const runMigrations = () => {
  try {
    // Check if priority column exists in kanban_cards
    const columns = db.prepare("PRAGMA table_info(kanban_cards)").all() as { name: string }[];
    const hasColumn = (name: string) => columns.some(col => col.name === name);
    
    if (!hasColumn('priority')) {
      db.exec('ALTER TABLE kanban_cards ADD COLUMN priority TEXT DEFAULT "medium"');
    }
    
    if (!hasColumn('auto_pickup')) {
      db.exec('ALTER TABLE kanban_cards ADD COLUMN auto_pickup BOOLEAN DEFAULT 0');
    }
  } catch (error) {
    // Migrations might fail if columns already exist, which is fine
    console.log('Migration note:', error);
  }
};

// Run migrations
runMigrations();

export { db };

export interface KanbanCard {
  id: number;
  title: string;
  description?: string;
  tags?: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  auto_pickup: boolean;
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

export interface ActivityLog {
  id: number;
  timestamp: number;
  action_type: string;
  description: string;
  metadata?: string;
}

export interface Doc {
  id: number;
  title: string;
  content: string;
  category?: string;
  created_at: number;
  updated_at: number;
}

export interface Note {
  id: number;
  content: string;
  seen: boolean;
  created_at: number;
  processed_at?: number;
}

export interface Status {
  id: number;
  status: 'Idle' | 'Thinking' | 'Working' | 'Sleeping';
  last_sync: number;
  updated_at: number;
}