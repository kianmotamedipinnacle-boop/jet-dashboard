import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Clear existing data (in production, you might want to be more careful)
    const now = Date.now();

    // Seed Kanban cards with Jet's current tasks
    const kanbanCards = [
      {
        title: "Cost Optimization Monitoring",
        description: "Track effectiveness of smart model routing (Haiku/Sonnet/Opus). Target: Save $2.74/day = $1,000+/year",
        tags: "automation,cost-savings,high-impact",
        status: "in_progress" as const,
        priority: "urgent" as const,
        auto_pickup: true,
        created_date: now - 86400000,
        updated_date: now - 3600000
      },
      {
        title: "Automated Email Processing", 
        description: "Batch process 20-30 emails in single context. Categories: urgent_business, agent_related, financial, receipts, spam",
        tags: "email,automation,batch-processing",
        status: "in_progress" as const,
        priority: "high" as const, 
        auto_pickup: true,
        created_date: now - 172800000,
        updated_date: now - 7200000
      },
      {
        title: "Avatar Design Improvements",
        description: "Current Thomas-style jet looks \"mean and angry\" per user feedback. Research friendlier front-facing design options",
        tags: "ui,design,user-feedback",
        status: "backlog" as const,
        priority: "medium" as const,
        auto_pickup: false,
        created_date: now - 259200000,
        updated_date: now - 86400000
      },
      {
        title: "Dashboard Infrastructure",
        description: "Maintain Klaus-style interface with real-time status tracking. Monitor live tunnel and prepare for Railway deployment",
        tags: "infrastructure,dashboard,monitoring", 
        status: "review" as const,
        priority: "high" as const,
        auto_pickup: false,
        created_date: now - 345600000,
        updated_date: now - 1800000
      },
      {
        title: "Tax Receipt Organization",
        description: "Process business receipts and commissions from email archives. Target: 25-30 receipts per batch processing run",
        tags: "finance,automation,tax-prep",
        status: "backlog" as const,
        priority: "medium" as const,
        auto_pickup: true,
        created_date: now - 432000000,
        updated_date: now - 259200000
      }
    ];

    // Add kanban cards
    kanbanCards.forEach(card => db.addKanbanCard(card));

    // Seed Brain cards with Jet's knowledge and strategies
    const brainCards = [
      {
        title: "Cost Optimization Strategy",
        content: "Smart model routing saves ~$2.74/day through: Haiku for file ops ($0.25/1M), Sonnet for analysis ($3-15/1M), Opus for critical reasoning ($15-75/1M). Batch processing email saves $0.50 per batch vs individual calls.",
        tags: "strategy,cost-savings,automation",
        category: "Optimization",
        created_date: now - 86400000,
        updated_date: now - 86400000
      },
      {
        title: "Workflow Automation Insights", 
        content: "80% of routine tasks can be automated. Heartbeat checks rotate: email analysis, calendar monitoring, weather updates, status syncing. Target: 60% reduction in manual intervention.",
        tags: "automation,workflow,efficiency",
        category: "Process",
        created_date: now - 172800000,
        updated_date: now - 172800000
      },
      {
        title: "UI Design Philosophy",
        content: "Thomas the Train style avatar: front-facing for personality, status-reactive expressions (😊 idle, 👀 working, 🤔 thinking, ❌ error). Klaus-inspired dashboard with professional animations, not emojis.",
        tags: "ui,design,avatar,philosophy", 
        category: "Design",
        created_date: now - 259200000,
        updated_date: now - 259200000
      },
      {
        title: "Memory Management Framework",
        content: "Daily logs in memory/YYYY-MM-DD.md for raw events. MEMORY.md for curated long-term insights. Update MEMORY.md during heartbeats by reviewing recent daily files for significant patterns.",
        tags: "memory,organization,framework",
        category: "System",
        created_date: now - 345600000,
        updated_date: now - 345600000
      },
      {
        title: "Proactive Assistance Framework",
        content: "Constantly suggest improvements, features, workflow optimizations. Anticipate next question. Push back when needed. Cost transparency with [Model Name] in every response. Quality over quantity.",
        tags: "proactive,assistance,improvement",
        category: "Behavior", 
        created_date: now - 432000000,
        updated_date: now - 432000000
      }
    ];

    // Add brain cards
    brainCards.forEach(card => db.addBrainCard(card));

    // Update status
    db.updateStatus({
      status: 'Working',
      last_sync: now,
      updated_at: now
    });

    // Add activity log
    db.addActivityLog({
      timestamp: now,
      action_type: 'system',
      description: 'Database seeded with Jet kanban cards and brain cards',
      metadata: JSON.stringify({ kanban_count: kanbanCards.length, brain_count: brainCards.length })
    });

    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${kanbanCards.length} Jet kanban cards and ${brainCards.length} brain cards` 
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}