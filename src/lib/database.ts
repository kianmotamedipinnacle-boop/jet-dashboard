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
  private data: DatabaseSchema | null = null;
  
  private getData(): DatabaseSchema {
    if (!this.data) {
      this.data = readDb();
    }
    return this.data;
  }

  private saveData(): void {
    if (this.data) {
      writeDb(this.data);
    }
  }

  // Kanban cards
  getAllKanbanCards(): KanbanCard[] {
    return this.getData().kanban_cards;
  }

  addKanbanCard(card: Omit<KanbanCard, 'id'>): KanbanCard {
    const data = this.getData();
    const newCard: KanbanCard = {
      ...card,
      id: Math.max(0, ...data.kanban_cards.map(c => c.id)) + 1
    };
    data.kanban_cards.push(newCard);
    this.saveData();
    return newCard;
  }

  updateKanbanCard(id: number, updates: Partial<KanbanCard>): KanbanCard | null {
    const data = this.getData();
    const index = data.kanban_cards.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    data.kanban_cards[index] = { ...data.kanban_cards[index], ...updates };
    this.saveData();
    return data.kanban_cards[index];
  }

  deleteKanbanCard(id: number): boolean {
    const data = this.getData();
    const index = data.kanban_cards.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    data.kanban_cards.splice(index, 1);
    this.saveData();
    return true;
  }

  // Brain cards
  getAllBrainCards(): BrainCard[] {
    return this.getData().brain_cards;
  }

  addBrainCard(card: Omit<BrainCard, 'id'>): BrainCard {
    const data = this.getData();
    const newCard: BrainCard = {
      ...card,
      id: Math.max(0, ...data.brain_cards.map(c => c.id)) + 1
    };
    data.brain_cards.push(newCard);
    this.saveData();
    return newCard;
  }

  updateBrainCard(id: number, updates: Partial<BrainCard>): BrainCard | null {
    const data = this.getData();
    const index = data.brain_cards.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    data.brain_cards[index] = { ...data.brain_cards[index], ...updates };
    this.saveData();
    return data.brain_cards[index];
  }

  deleteBrainCard(id: number): boolean {
    const data = this.getData();
    const index = data.brain_cards.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    data.brain_cards.splice(index, 1);
    this.saveData();
    return true;
  }

  // Activity log
  addActivityLog(log: Omit<ActivityLog, 'id'>): ActivityLog {
    const data = this.getData();
    const newLog: ActivityLog = {
      ...log,
      id: Math.max(0, ...data.activity_log.map(l => l.id)) + 1
    };
    data.activity_log.push(newLog);
    this.saveData();
    return newLog;
  }

  getRecentActivityLogs(limit: number = 50): ActivityLog[] {
    return this.getData().activity_log
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Status
  getStatus(): Status | null {
    return this.getData().status[0] || null;
  }

  updateStatus(updates: Partial<Status>): Status | null {
    const data = this.getData();
    if (data.status.length === 0) {
      const newStatus: Status = {
        id: 1,
        status: 'Idle',
        last_sync: Date.now(),
        updated_at: Date.now(),
        ...updates
      };
      data.status.push(newStatus);
    } else {
      data.status[0] = { ...data.status[0], ...updates };
    }
    this.saveData();
    return data.status[0];
  }

  // Notes
  getAllNotes(): Note[] {
    return this.getData().notes.sort((a, b) => b.created_at - a.created_at);
  }

  addNote(note: Omit<Note, 'id'>): Note {
    const data = this.getData();
    const newNote: Note = {
      ...note,
      id: Math.max(0, ...data.notes.map(n => n.id)) + 1
    };
    data.notes.push(newNote);
    this.saveData();
    return newNote;
  }

  updateNote(id: number, updates: Partial<Note>): Note | null {
    const data = this.getData();
    const index = data.notes.findIndex(n => n.id === id);
    if (index === -1) return null;
    
    data.notes[index] = { ...data.notes[index], ...updates };
    this.saveData();
    return data.notes[index];
  }

  deleteNote(id: number): boolean {
    const data = this.getData();
    const index = data.notes.findIndex(n => n.id === id);
    if (index === -1) return false;
    
    data.notes.splice(index, 1);
    this.saveData();
    return true;
  }

  // Docs
  getAllDocs(): Doc[] {
    return this.getData().docs.sort((a, b) => b.created_at - a.created_at);
  }

  addDoc(doc: Omit<Doc, 'id'>): Doc {
    const data = this.getData();
    const newDoc: Doc = {
      ...doc,
      id: Math.max(0, ...data.docs.map(d => d.id)) + 1
    };
    data.docs.push(newDoc);
    this.saveData();
    return newDoc;
  }

  updateDoc(id: number, updates: Partial<Doc>): Doc | null {
    const data = this.getData();
    const index = data.docs.findIndex(d => d.id === id);
    if (index === -1) return null;
    
    data.docs[index] = { ...data.docs[index], ...updates };
    this.saveData();
    return data.docs[index];
  }

  deleteDoc(id: number): boolean {
    const data = this.getData();
    const index = data.docs.findIndex(d => d.id === id);
    if (index === -1) return false;
    
    data.docs.splice(index, 1);
    this.saveData();
    return true;
  }
}

// Create singleton instance
let dbInstance: SimpleDB | null = null;

export const getDB = (): SimpleDB => {
  if (!dbInstance) {
    dbInstance = new SimpleDB();
  }
  return dbInstance;
};

// Export db for backward compatibility
export const db = getDB();

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