import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

const realTasks = [
  // Agent Onboarding & Training (In Progress)
  {
    title: "Caitlin & Hella Agent Onboarding",
    description: "Complete onboarding process for 2 new agents starting Monday Feb 17. Includes contracting, training, and system setup.",
    status: "in_progress" as const,
    priority: "high" as const,
    labels: ["agents", "onboarding", "urgent"]
  },
  {
    title: "Complete Manager Slot Allocation System", 
    description: "Finish n8n workflow for 7-stage onboarding tracking (contracting → AI training → recorded sessions → RTS verification → HEAP contracts → CRM setup → 10 deals completed)",
    status: "in_progress" as const,
    priority: "high" as const,
    labels: ["automation", "n8n", "systems"]
  },
  {
    title: "HIPAA-Compliant CRM Development",
    description: "Build custom CRM with Claude Code for client management, deals tracking, and payroll integration. Must meet HIPAA compliance requirements.",
    status: "in_progress" as const,
    priority: "medium" as const,
    labels: ["development", "hipaa", "crm"]
  },
  
  // Systems & Automation (Backlog)
  {
    title: "Call Recording Solution Implementation",
    description: "Research and implement call recording for Medicare calls from Pakistani lead center. Evaluate Piezo, VOMO AI, Audio Hijack options.",
    status: "backlog" as const,
    priority: "high" as const,
    labels: ["compliance", "recording", "research"]
  },
  {
    title: "Automated Mailer System Setup",
    description: "Complete n8n + Thanks.io API integration for personalized postcards/magna cards with agent-specific branding from Airtable data.",
    status: "backlog" as const,
    priority: "medium" as const,
    labels: ["automation", "marketing", "thanks.io"]
  },
  {
    title: "Gmail OAuth2 Migration",
    description: "Switch from app passwords to read-only OAuth2 for both Gmail accounts (info@armomedicare.com, kianmotamedi.pinnacle@gmail.com)",
    status: "backlog" as const,
    priority: "low" as const,
    labels: ["security", "gmail", "oauth"]
  },
  {
    title: "jet@armomedicare.com Email Setup",
    description: "Create and configure jet@armomedicare.com email address in Google Workspace for Jet's business communications.",
    status: "backlog" as const,
    priority: "low" as const,
    labels: ["email", "workspace", "setup"]
  },
  
  // Business Development (Backlog/In Progress)
  {
    title: "Carrier Contract Negotiations", 
    description: "Finalize contracts with Humana, UHC, Aetna, Wellcare for agency. Critical blocker for agent sales.",
    status: "backlog" as const,
    priority: "high" as const,
    labels: ["business", "contracts", "carriers", "blocker"]
  },
  {
    title: "QuickBooks Payroll Setup",
    description: "Configure first payroll cycle for February agents. Includes tax registrations, banking integration, and compliance setup.",
    status: "in_progress" as const,
    priority: "high" as const,
    labels: ["payroll", "quickbooks", "finance"]
  },
  {
    title: "TX & FL State Registration Completion",
    description: "Ensure all state tax and regulatory registrations are complete for both Texas and Florida operations.",
    status: "backlog" as const,
    priority: "medium" as const,
    labels: ["compliance", "legal", "states"]
  },
  
  // Completed Items
  {
    title: "TDI E&O Bond Issue Resolution",
    description: "Successfully resolved E&O bond deficiency with Texas Department of Insurance for entity license approval.",
    status: "done" as const,
    priority: "high" as const,
    labels: ["compliance", "tdi", "resolved"]
  },
  {
    title: "ProtonMail Plus Account Setup",
    description: "Created and configured jet.armo@proton.me with Bridge access for secure business communications.",
    status: "done" as const,
    priority: "medium" as const,
    labels: ["email", "protonmail", "security"]
  },
  {
    title: "OpenClaw Personal Assistant Deployment",
    description: "Successfully deployed Jet AI assistant on Vultr VPS with Telegram integration and Mac Mini node connection.",
    status: "done" as const,
    priority: "high" as const,
    labels: ["ai", "automation", "infrastructure"]
  },
  {
    title: "2Captcha Integration Setup",
    description: "Configured 2Captcha API (a00b30e3f8a9ac001b73cfcaf1bca957) with $10 funding for automated CAPTCHA solving.",
    status: "done" as const,
    priority: "low" as const,
    labels: ["automation", "captcha", "api"]
  }
];

const brainCards = [
  {
    title: "Agent Onboarding SOP",
    content: "Complete standard operating procedure for Medicare agent onboarding including 23-topic training curriculum, compliance requirements, and performance tracking.",
    category: "documentation" as const,
    tags: ["sop", "training", "medicare"]
  },
  {
    title: "Lead Cost Analysis - February 2026",
    content: "$6-8K/agent/month baseline cost through Enroll Here platform. Pakistani sources less trusted but cheaper. Need to evaluate ROI vs quality trade-offs.",
    category: "analysis" as const,
    tags: ["leads", "costs", "roi"]
  },
  {
    title: "Cash Flow Bridge Strategy",
    content: "Agents need 10-12 months to become profitable due to commission proration. Ali & Mark hard money loans (~$50K/broker agent) required to bridge mid-year gap before AEP.",
    category: "strategy" as const,
    tags: ["finance", "investors", "cash-flow"]
  },
  {
    title: "Retention CRM Specifications",
    content: "Custom CRM must track client touchpoints, automate follow-ups, and integrate with Thanks.io for personalized mailers. Target 75-80% persistency vs industry 60-65%.",
    category: "specification" as const,
    tags: ["crm", "retention", "specifications"]
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
    for (const task of realTasks) {
      insertKanbanCard.run(
        task.title,
        task.description,
        task.status,
        task.priority,
        JSON.stringify(task.labels),
        now,
        now
      );
    }

    // Insert brain cards
    const insertBrainCard = db.prepare(`
      INSERT INTO brain_cards (title, content, category, tags, created_date, updated_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const card of brainCards) {
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
      `Populated dashboard with ${realTasks.length} real tasks and ${brainCards.length} brain cards from Kian's business`,
      now
    );

    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${realTasks.length} kanban cards and ${brainCards.length} brain cards` 
    });

  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}