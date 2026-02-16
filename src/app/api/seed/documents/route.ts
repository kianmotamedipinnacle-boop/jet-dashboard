import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import fs from 'fs';
import path from 'path';

// Directories to scan for documents
const SCAN_DIRS = [
  '/root/.openclaw/workspace',
  '/root/.openclaw/workspace/memory',
  '/usr/lib/node_modules/openclaw/docs',
  '/usr/lib/node_modules/openclaw/skills'
];

// File extensions to include
const INCLUDE_EXTENSIONS = ['.md', '.txt'];

// Directories to exclude
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build', '.openclaw'];

function shouldIncludeFile(filePath: string): boolean {
  // Check if path contains excluded directories
  for (const exclude of EXCLUDE_DIRS) {
    if (filePath.includes(exclude)) return false;
  }
  
  // Check extension
  const ext = path.extname(filePath);
  return INCLUDE_EXTENSIONS.includes(ext);
}

function scanDirectory(dirPath: string, baseName = ''): Array<{path: string, name: string, category: string}> {
  const files: Array<{path: string, name: string, category: string}> = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      
      // Skip if doesn't exist (broken symlinks, etc)
      if (!fs.existsSync(fullPath)) continue;
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !EXCLUDE_DIRS.includes(item)) {
        // Recursively scan subdirectories
        files.push(...scanDirectory(fullPath, path.join(baseName, item)));
      } else if (stat.isFile() && shouldIncludeFile(fullPath)) {
        files.push({
          path: fullPath,
          name: item,
          category: baseName || path.basename(dirPath)
        });
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dirPath}:`, error);
  }
  
  return files;
}

export async function POST() {
  try {
    let totalImported = 0;
    const importedDocs: any[] = [];
    
    // First, add some key workspace documents manually
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
        title: 'TOOLS.md - Local Setup Notes',
        content: fs.existsSync('/root/.openclaw/workspace/TOOLS.md')
          ? fs.readFileSync('/root/.openclaw/workspace/TOOLS.md', 'utf-8')
          : 'File not found',
        category: 'Core Config'
      }
    ];
    
    // Import key docs
    for (const doc of keyDocs) {
      if (doc.content !== 'File not found') {
        const newDoc = db.addDoc({
          title: doc.title,
          content: doc.content,
          category: doc.category,
          created_at: Date.now(),
          updated_at: Date.now()
        });
        importedDocs.push(newDoc);
        totalImported++;
      }
    }
    
    // Scan memory files
    const memoryDir = '/root/.openclaw/workspace/memory';
    if (fs.existsSync(memoryDir)) {
      const memoryFiles = fs.readdirSync(memoryDir)
        .filter(f => f.endsWith('.md'))
        .sort()
        .slice(-10); // Last 10 memory files
        
      for (const file of memoryFiles) {
        try {
          const content = fs.readFileSync(path.join(memoryDir, file), 'utf-8');
          const newDoc = db.addDoc({
            title: `Memory: ${file}`,
            content,
            category: 'Memory',
            created_at: Date.now(),
            updated_at: Date.now()
          });
          importedDocs.push(newDoc);
          totalImported++;
        } catch (error) {
          console.error(`Failed to import ${file}:`, error);
        }
      }
    }
    
    // Import key business/technical docs
    const businessDocs = [
      {
        title: 'Medicare Business Overview',
        content: `# ARMO Medicare Business Overview

## Company Details
- **Entity**: ARMO Medicare LLC / Armo Creative LLC
- **FL License**: L134455
- **EIN**: 99-4388903
- **Banking**: Bluevine (*6807)
- **Model**: W-2 hourly agents + commission bonuses

## Agent Compensation Structure
- Base: $18.50/hour W-2
- Bonus Tiers (based on policies going effective):
  - 27+ enrollments: $500
  - 45+ enrollments: $1,200  
  - 70+ enrollments: $2,500
  - $75 per policy after 70
- Realistic earnings: $3K-$6.9K/month

## Launch Timeline
- First agents: February 17, 2026 (Caitlin & Hella)
- AEP 2026: October 15 - December 7 (critical revenue window)
- Target: Self-fund months 1-5, draw investor capital mid-year
- Exit strategy: $50-100M valuation

## Competitive Advantage
- Custom retention CRM + automations
- Target persistency: 75-80% (vs 45-55% industry avg)
- Lean operations = highest margins in industry`,
        category: 'Business'
      },
      {
        title: 'System Architecture & Cost Optimization',
        content: `# Jet AI Assistant Infrastructure

## Core Infrastructure
- **VPS**: Ubuntu 24.04 LTS on Vultr (207.246.66.134)
- **Mac Mini Node**: M-series for Apple ecosystem integration
- **Gateway**: OpenClaw on port 18789
- **Dashboard**: Next.js deployed on Railway

## Cost Optimization Achieved
- **Claude Max**: $200/month unlimited (saves $2,000+/year vs API)
- **Smart Model Routing**:
  - Opus ($15/$75 per 1M): Strategic decisions only
  - Sonnet ($3/$15): Complex tasks
  - Haiku ($0.25/$1.25): Routine operations
  - GPT-4o-mini ($0.15/$0.60): High-volume tasks
- **Batch Processing**: $0.50 saved per email batch
- **Total Annual Savings**: $3,300+

## Key Integrations
- **Email**: Gmail OAuth (2 accounts) + ProtonMail browser
- **Communication**: Telegram + WhatsApp + webchat
- **Automation**: 2Captcha API for CAPTCHA solving
- **TTS**: ElevenLabs (Nova voice)
- **AI Models**: Claude Max, OpenAI, xAI/Grok

## Security
- Full autonomy on Mac Mini (security=full, ask=off)
- Rate limits: Max 2 Opus agents simultaneously  
- Token budget: 200,000 tokens/minute for Claude Max`,
        category: 'Technical'
      }
    ];
    
    for (const doc of businessDocs) {
      const newDoc = db.addDoc({
        ...doc,
        created_at: Date.now(),
        updated_at: Date.now()
      });
      importedDocs.push(newDoc);
      totalImported++;
    }
    
    // Import OpenClaw documentation (sample)
    const docsDir = '/usr/lib/node_modules/openclaw/docs';
    if (fs.existsSync(docsDir)) {
      const docFiles = ['README.md', 'getting-started.md', 'concepts/agents.md', 'tools/index.md']
        .filter(f => fs.existsSync(path.join(docsDir, f)));
        
      for (const file of docFiles) {
        try {
          const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');
          const title = file.replace(/\.md$/, '').replace(/\//g, ' - ');
          const newDoc = db.addDoc({
            title: `OpenClaw Docs: ${title}`,
            content,
            category: 'Documentation',
            created_at: Date.now(),
            updated_at: Date.now()
          });
          importedDocs.push(newDoc);
          totalImported++;
        } catch (error) {
          console.error(`Failed to import ${file}:`, error);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Imported ${totalImported} documents`,
      documents: importedDocs.map(d => ({
        id: d.id,
        title: d.title,
        category: d.category
      }))
    });
    
  } catch (error) {
    console.error('Document import error:', error);
    return NextResponse.json(
      { error: 'Failed to import documents', details: error },
      { status: 500 }
    );
  }
}