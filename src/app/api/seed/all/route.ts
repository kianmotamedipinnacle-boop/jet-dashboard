import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    let seedResults = {
      documents: 0,
      kanbanCards: 0,
      brainCards: 0,
      activityLogs: 0,
      status: false
    };

    // 1. Import Documents
    const keyDocs = [
      {
        title: 'AGENTS.md - AI Assistant Guidelines',
        content: fs.existsSync('/root/.openclaw/workspace/AGENTS.md') 
          ? fs.readFileSync('/root/.openclaw/workspace/AGENTS.md', 'utf-8')
          : 'File not found',
        category: 'Core Config'
      },
      {
        title: 'SOUL.md - Jet\'s Personality',
        content: fs.existsSync('/root/.openclaw/workspace/SOUL.md')
          ? fs.readFileSync('/root/.openclaw/workspace/SOUL.md', 'utf-8')
          : 'File not found',
        category: 'Core Config'
      },
      {
        title: 'USER.md - About Kian',
        content: fs.existsSync('/root/.openclaw/workspace/USER.md')
          ? fs.readFileSync('/root/.openclaw/workspace/USER.md', 'utf-8')
          : 'File not found',
        category: 'Core Config'
      },
      {
        title: 'MEMORY.md - Long-term Memory',
        content: fs.existsSync('/root/.openclaw/workspace/MEMORY.md')
          ? fs.readFileSync('/root/.openclaw/workspace/MEMORY.md', 'utf-8')
          : 'File not found',
        category: 'Core Config'
      },
      {
        title: 'TOOLS.md - Setup Notes',
        content: fs.existsSync('/root/.openclaw/workspace/TOOLS.md')
          ? fs.readFileSync('/root/.openclaw/workspace/TOOLS.md', 'utf-8')
          : 'File not found',
        category: 'Core Config'
      },
      {
        title: 'Medicare Business Overview',
        content: `# ARMO Medicare Business Overview

## Company Details
- **Entity**: ARMO Medicare LLC / Armo Creative LLC
- **FL License**: L134455
- **Model**: W-2 hourly agents ($18.50/hr) + commission bonuses

## Agent Compensation
- Base: $18.50/hour
- Bonus Tiers:
  - 27+ enrollments: $500
  - 45+ enrollments: $1,200
  - 70+ enrollments: $2,500

## Launch Timeline
- First agents: February 17, 2026 (Caitlin & Hella)
- AEP 2026: October 15 - December 7
- Exit strategy: $50-100M valuation`,
        category: 'Business'
      },
      {
        title: 'System Architecture',
        content: `# Jet AI Infrastructure

## Core Systems
- **VPS**: Ubuntu 24.04 on Vultr
- **Mac Mini**: Apple ecosystem access
- **Dashboard**: Next.js on Railway

## Cost Optimization
- Claude Max: $200/month unlimited
- Smart routing: Opus → Sonnet → Haiku
- Annual savings: $3,300+`,
        category: 'Technical'
      }
    ];

    // Import documents
    for (const doc of keyDocs) {
      if (doc.content !== 'File not found') {
        db.addDoc({
          title: doc.title,
          content: doc.content,
          category: doc.category,
          created_at: Date.now(),
          updated_at: Date.now()
        });
        seedResults.documents++;
      }
    }

    // Import recent memory files
    const memoryDir = '/root/.openclaw/workspace/memory';
    if (fs.existsSync(memoryDir)) {
      const memoryFiles = fs.readdirSync(memoryDir)
        .filter(f => f.endsWith('.md'))
        .sort()
        .slice(-5); // Last 5 memory files
        
      for (const file of memoryFiles) {
        try {
          const content = fs.readFileSync(path.join(memoryDir, file), 'utf-8');
          db.addDoc({
            title: `Memory: ${file}`,
            content,
            category: 'Memory',
            created_at: Date.now(),
            updated_at: Date.now()
          });
          seedResults.documents++;
        } catch (error) {
          console.error(`Failed to import ${file}:`, error);
        }
      }
    }

    // 2. Add Kanban Cards
    const kanbanCards = [
      {
        title: 'Multi-Chat Dynamic Tabs',
        description: 'Implemented VSCode-style dynamic tabs for chat interface',
        tags: 'feature,ui',
        status: 'done' as const,
        priority: 'high' as const,
        auto_pickup: false
      },
      {
        title: 'Email Batch Processing',
        description: 'Process 20-30 emails in single context to save costs',
        tags: 'automation,optimization',
        status: 'in_progress' as const,
        priority: 'medium' as const,
        auto_pickup: true
      },
      {
        title: 'Medicare Agent Onboarding',
        description: 'Prepare materials for Caitlin & Hella starting Feb 17',
        tags: 'business,urgent',
        status: 'in_progress' as const,
        priority: 'urgent' as const,
        auto_pickup: false
      },
      {
        title: 'Alex Hormozi AI Integration',
        description: 'Set up $6K Acquisition.com AI for retention strategy',
        tags: 'integration,strategy',
        status: 'backlog' as const,
        priority: 'medium' as const,
        auto_pickup: false
      }
    ];

    for (const card of kanbanCards) {
      db.addKanbanCard({
        ...card,
        order: 0,
        created_date: Date.now(),
        updated_date: Date.now()
      });
      seedResults.kanbanCards++;
    }

    // 3. Add Brain Cards
    const brainCards = [
      {
        title: 'Cost Optimization Achieved',
        content: `- Claude Max: $2,000+ annual savings
- Batch processing: $0.50 per batch saved
- Smart routing: 40x cost difference between models
- Total: $3,300+ annual savings`,
        category: 'Achievements',
        tags: 'optimization,cost'
      },
      {
        title: 'Rate Limit Discovery',
        content: 'Claude Max limit: 200,000 tokens/minute. Max 2 Opus agents simultaneously to prevent crashes.',
        category: 'Lessons',
        tags: 'limits,important'
      },
      {
        title: 'Medicare Launch Strategy',
        content: `First cohort: Feb 17 (2 agents)
Self-fund months 1-5
Draw investor capital mid-year
Target: 75-80% persistency`,
        category: 'Strategy',
        tags: 'business,medicare'
      }
    ];

    for (const card of brainCards) {
      db.addBrainCard({
        ...card,
        created_date: Date.now(),
        updated_date: Date.now()
      });
      seedResults.brainCards++;
    }

    // 4. Add Activity Logs
    const activities = [
      'Implemented dynamic multi-chat tabs like VSCode',
      'Fixed rate limit crash - max 2 Opus agents',
      'Connected Mac Mini node successfully',
      'Set up ProtonMail browser automation',
      'Deployed dashboard to Railway',
      'Created Medicare business documentation',
      'Configured cost optimization routing'
    ];

    for (const activity of activities) {
      db.addActivityLog({
        timestamp: Date.now() - Math.floor(Math.random() * 86400000), // Random time in last 24h
        action_type: 'task_completed',
        description: activity,
        metadata: JSON.stringify({ agent: 'Jet' })
      });
      seedResults.activityLogs++;
    }

    // 5. Update Status
    db.updateStatus({
      status: 'Idle',
      last_sync: Date.now(),
      updated_at: Date.now()
    });
    seedResults.status = true;

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      results: seedResults
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error },
      { status: 500 }
    );
  }
}