import fs from 'fs';
import path from 'path';

const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/jet-dashboard.json' 
  : path.join(process.cwd(), 'jet-dashboard.json');

// Database structure
interface DatabaseSchema {
  kanban_cards: KanbanCard[];
  brain_cards: BrainCard[];
  activity_log: ActivityLog[];
  docs: Doc[];
  notes: Note[];
  status: Status[];
}

// Initialize empty database
const initDb = (): DatabaseSchema => ({
  kanban_cards: [],
  brain_cards: [],
  activity_log: [],
  docs: [],
  notes: [],
  status: [{
    id: 1,
    status: 'Idle',
    last_sync: Date.now(),
    updated_at: Date.now()
  }]
});

// Read database
const readDb = (): DatabaseSchema => {
  try {
    if (!fs.existsSync(dbPath)) {
      const newDb = initDb();
      fs.writeFileSync(dbPath, JSON.stringify(newDb, null, 2));
      return newDb;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data) as DatabaseSchema;
  } catch (error) {
    console.error('Database read error:', error);
    return initDb();
  }
};

// Write database
const writeDb = (data: DatabaseSchema): void => {
  try {
    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Database write error:', error);
  }
};

// Simple database operations
class SimpleDB {
  private data: DatabaseSchema;

  constructor() {
    this.data = readDb();
  }

  // Kanban cards
  getAllKanbanCards(): KanbanCard[] {
    return this.data.kanban_cards;
  }

  addKanbanCard(card: Omit<KanbanCard, 'id'>): KanbanCard {
    const newCard: KanbanCard = {
      ...card,
      id: Math.max(0, ...this.data.kanban_cards.map(c => c.id)) + 1
    };
    this.data.kanban_cards.push(newCard);
    writeDb(this.data);
    return newCard;
  }

  updateKanbanCard(id: number, updates: Partial<KanbanCard>): KanbanCard | null {
    const index = this.data.kanban_cards.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.data.kanban_cards[index] = { ...this.data.kanban_cards[index], ...updates };
    writeDb(this.data);
    return this.data.kanban_cards[index];
  }

  deleteKanbanCard(id: number): boolean {
    const index = this.data.kanban_cards.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.data.kanban_cards.splice(index, 1);
    writeDb(this.data);
    return true;
  }

  // Brain cards
  getAllBrainCards(): BrainCard[] {
    return this.data.brain_cards;
  }

  addBrainCard(card: Omit<BrainCard, 'id'>): BrainCard {
    const newCard: BrainCard = {
      ...card,
      id: Math.max(0, ...this.data.brain_cards.map(c => c.id)) + 1
    };
    this.data.brain_cards.push(newCard);
    writeDb(this.data);
    return newCard;
  }

  updateBrainCard(id: number, updates: Partial<BrainCard>): BrainCard | null {
    const index = this.data.brain_cards.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.data.brain_cards[index] = { ...this.data.brain_cards[index], ...updates };
    writeDb(this.data);
    return this.data.brain_cards[index];
  }

  // Activity log
  addActivityLog(log: Omit<ActivityLog, 'id'>): ActivityLog {
    const newLog: ActivityLog = {
      ...log,
      id: Math.max(0, ...this.data.activity_log.map(l => l.id)) + 1
    };
    this.data.activity_log.push(newLog);
    writeDb(this.data);
    return newLog;
  }

  getRecentActivityLogs(limit: number = 50): ActivityLog[] {
    return this.data.activity_log
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Status
  getStatus(): Status | null {
    return this.data.status[0] || null;
  }

  updateStatus(updates: Partial<Status>): Status | null {
    if (this.data.status.length === 0) {
      const newStatus: Status = {
        id: 1,
        status: 'Idle',
        last_sync: Date.now(),
        updated_at: Date.now(),
        ...updates
      };
      this.data.status.push(newStatus);
    } else {
      this.data.status[0] = { ...this.data.status[0], ...updates };
    }
    writeDb(this.data);
    return this.data.status[0];
  }
}

export const db = new SimpleDB();

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