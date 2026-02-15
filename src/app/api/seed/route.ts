import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

const jetTasks = [
  // Current Active Tasks (In Progress)
  {
    title: "Redesign Animated Avatar",
    description: "User feedback: current jet avatar looks 'mean and angry' and doesn't look like a plane. Research better Thomas-style front-facing design that's friendly and clearly jet-shaped.",
    status: "in_progress" as const,
    priority: "medium" as const,
    labels: ["ui", "design", "avatar", "user-feedback"]
  },
  {
    title: "Cost Optimization Monitoring",
    description: "Monitor smart model routing effectiveness. Track daily savings from Haiku/Sonnet/Opus routing and batch email processing. Generate weekly cost reports.",
    status: "in_progress" as const,
    priority: "high" as const,
    labels: ["cost-optimization", "monitoring", "efficiency"]
  },
  {
    title: "Automated Email Processing",
    description: "Process daily email batches from info@armomedicare.com and kianmotamedi.pinnacle@gmail.com. Categorize and generate action items for Kian.",
    status: "in_progress" as const,
    priority: "high" as const,
    labels: ["automation", "email", "daily-tasks"]
  },
  {
    title: "Tax Receipt Processing",
    description: "Ongoing processing of business receipts and commission emails for Kian's tax organization. Target: 20-30 receipts per heartbeat.",
    status: "in_progress" as const,
    priority: "medium" as const,
    labels: ["finance", "tax-prep", "organization"]
  },
  
  // Upcoming Tasks (Backlog)
  {
    title: "Deploy Dashboard to Railway",
    description: "Once GitHub repo is created, push jet-dashboard code and deploy to Railway for permanent hosting. Configure production environment.",
    status: "backlog" as const,
    priority: "high" as const,
    labels: ["deployment", "railway", "github", "infrastructure"]
  },
  {
    title: "ProtonMail Bridge Integration",
    description: "Complete ProtonMail Bridge setup on Mac Mini to enable IMAP/SMTP access to jet.armo@proton.me for automated email workflows.",
    status: "backlog" as const,
    priority: "medium" as const,
    labels: ["email", "protonmail", "mac-mini", "integration"]
  },
  {
    title: "Enhanced Voice Capabilities",
    description: "Research and implement better Hormozi-style voice on ElevenLabs for more engaging TTS responses when appropriate.",
    status: "backlog" as const,
    priority: "low" as const,
    labels: ["tts", "voice", "elevenlabs", "enhancement"]
  },
  {
    title: "Workflow Optimization Analysis",
    description: "Analyze Kian's workflows and proactively suggest improvements, features, and optimizations. Continuous process improvement.",
    status: "backlog" as const,
    priority: "medium" as const,
    labels: ["optimization", "analysis", "proactive", "workflow"]
  },
  {
    title: "Memory System Enhancement",
    description: "Improve memory recall and organization. Better integration between daily logs, MEMORY.md, and contextual information retrieval.",
    status: "backlog" as const,
    priority: "low" as const,
    labels: ["memory", "organization", "context", "improvement"]
  },
  
  // Recently Completed (Done)
  {
    title: "Custom Animated Avatar Implementation",
    description: "Created custom SVG-based jet avatar with Thomas-style front-facing design, dynamic expressions, and Google Gemini-inspired animations.",
    status: "done" as const,
    priority: "high" as const,
    labels: ["avatar", "svg", "animation", "completed"]
  },
  {
    title: "Smart Model Routing System",
    description: "Implemented intelligent model routing (Haiku/Sonnet/Opus) with cost optimization. Created SMART_ROUTING.md and cost-optimizer.py.",
    status: "done" as const,
    priority: "high" as const,
    labels: ["cost-optimization", "routing", "efficiency", "completed"]
  },
  {
    title: "Batch Email Processing System",
    description: "Built email-batch-processor.py to handle 20-30 emails in single context, saving ~$0.50 per batch vs individual processing.",
    status: "done" as const,
    priority: "high" as const,
    labels: ["email", "batch-processing", "cost-savings", "completed"]
  },
  {
    title: "Dashboard Infrastructure Setup",
    description: "Built complete Next.js dashboard with kanban, brain notes, activity log, and real-time status tracking. Klaus-style design implemented.",
    status: "done" as const,
    priority: "high" as const,
    labels: ["dashboard", "nextjs", "infrastructure", "completed"]
  },
  {
    title: "Mac Mini Node Configuration",
    description: "Successfully configured Mac Mini as autonomous node with full permissions, VS Code setup, and screen recording capabilities.",
    status: "done" as const,
    priority: "medium" as const,
    labels: ["mac-mini", "node", "automation", "completed"]
  }
];

const jetBrainCards = [
  {
    title: "Cost Optimization Strategy",
    content: "Smart model routing implementation saves ~$2.74/day ($1000+/year). Haiku for simple tasks, Sonnet for analysis, Opus for critical decisions. Batch email processing adds $0.50/day savings. Monitor effectiveness and adjust routing rules.",
    category: "strategy" as const,
    tags: ["cost-optimization", "model-routing", "efficiency"]
  },
  {
    title: "Workflow Automation Patterns",
    content: "Key automation opportunities: batch email processing (20-30 emails/context), automated heartbeat tasks, smart file organization. Target: 80% routine task automation, 60% reduction in manual intervention.",
    category: "analysis" as const,
    tags: ["automation", "workflows", "efficiency"]
  },
  {
    title: "User Interface Design Philosophy",
    content: "Thomas the Train inspiration for avatar design: front-facing, expressive, friendly but professional. Avoid emojis - use custom SVG. Status-reactive animations (idle/working/thinking/error). User feedback: current avatar too 'mean and angry'.",
    category: "design" as const,
    tags: ["ui", "avatar", "user-feedback", "thomas-style"]
  },
  {
    title: "Memory & Context Management",
    content: "Daily memory files (memory/YYYY-MM-DD.md) for raw logs, MEMORY.md for curated long-term memory. Use memory_search before answering historical questions. Balance context size with cost optimization.",
    category: "documentation" as const,
    tags: ["memory", "context", "organization", "best-practices"]
  },
  {
    title: "Proactive Assistance Framework",
    content: "Core mandate: constantly suggest improvements, features, workflow optimizations. Look ahead, save time, make things better without being asked. Focus on business impact and efficiency gains.",
    category: "philosophy" as const,
    tags: ["proactive", "assistance", "optimization", "mindset"]
  }
];

export async function POST(request: NextRequest) {
  try {
    // Clear existing data
    db.prepare('DELETE FROM kanban_cards').run();
    db.prepare('DELETE FROM brain_cards').run();
    
    // Insert real kanban tasks
    const insertKanbanCard = db.prepare(`
      INSERT INTO kanban_cards (title, description, status, priority, tags, created_date, updated_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const now = Date.now();
    for (const task of jetTasks) {
      insertKanbanCard.run(
        task.title,
        task.description,
        task.status,
        task.priority,
        JSON.stringify(task.labels), // labels -> tags in database
        now,
        now
      );
    }

    // Insert brain cards
    const insertBrainCard = db.prepare(`
      INSERT INTO brain_cards (title, content, category, tags, created_date, updated_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const card of jetBrainCards) {
      insertBrainCard.run(
        card.title,
        card.content,
        card.category,
        JSON.stringify(card.tags),
        now,
        now
      );
    }

    // Log the seeding activity
    const insertLog = db.prepare(`
      INSERT INTO activity_log (action_type, description, timestamp)
      VALUES (?, ?, ?)
    `);

    insertLog.run(
      'seed_data',
      `Populated dashboard with ${jetTasks.length} Jet tasks and ${jetBrainCards.length} brain cards for AI assistant workflow`,
      now
    );

    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${jetTasks.length} Jet kanban cards and ${jetBrainCards.length} brain cards` 
    });

  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}