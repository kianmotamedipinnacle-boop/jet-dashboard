const fs = require('fs');
const path = require('path');
const { Database } = require('../src/lib/database');

// Initialize database
const db = new Database();

// Directories to scan for documents
const SCAN_DIRS = [
  '/root/.openclaw/workspace',
  '/root/.openclaw/workspace/memory',
  '/usr/lib/node_modules/openclaw/docs',
  '/usr/lib/node_modules/openclaw/skills'
];

// File extensions to include
const INCLUDE_EXTENSIONS = ['.md', '.txt', '.json'];

// Files to exclude
const EXCLUDE_FILES = ['node_modules', '.next', '.git', 'dist', 'build'];

function shouldIncludeFile(filePath) {
  // Check if path contains excluded directories
  for (const exclude of EXCLUDE_FILES) {
    if (filePath.includes(exclude)) return false;
  }
  
  // Check extension
  const ext = path.extname(filePath);
  return INCLUDE_EXTENSIONS.includes(ext);
}

function scanDirectory(dirPath, baseName = '') {
  const files = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !EXCLUDE_FILES.includes(item)) {
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
    console.error(`Error scanning ${dirPath}:`, error.message);
  }
  
  return files;
}

function importDocuments() {
  console.log('Starting document import...');
  
  let totalImported = 0;
  
  for (const dir of SCAN_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`Skipping non-existent directory: ${dir}`);
      continue;
    }
    
    console.log(`\nScanning ${dir}...`);
    const files = scanDirectory(dir);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file.path, 'utf-8');
        const title = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
        
        // Determine category based on path
        let category = file.category;
        if (file.path.includes('memory')) category = 'Memory';
        else if (file.path.includes('docs')) category = 'Documentation';
        else if (file.path.includes('skills')) category = 'Skills';
        else if (file.path.includes('workspace')) category = 'Workspace';
        
        // Add to database
        db.addDoc({
          title,
          content,
          category,
          path: file.path,
          created_at: Date.now(),
          updated_at: Date.now()
        });
        
        console.log(`✓ Imported: ${title} (${category})`);
        totalImported++;
        
      } catch (error) {
        console.error(`✗ Failed to import ${file.name}:`, error.message);
      }
    }
  }
  
  // Import special documents
  const specialDocs = [
    {
      title: 'Medicare Business Overview',
      content: `# ARMO Medicare Business Overview

## Company Details
- **Entity**: ARMO Medicare LLC / Armo Creative LLC
- **FL License**: L134455
- **EIN**: 99-4388903
- **Model**: W-2 hourly agents ($18.50/hr) + commission bonuses

## Agent Compensation
- Base: $18.50/hour
- Bonus Tiers:
  - 27+ enrollments: $500
  - 45+ enrollments: $1,200
  - 70+ enrollments: $2,500
  - $75 per policy after 70

## Launch Status
- First cohort: February 17, 2026 (Caitlin & Hella)
- AEP Focus: October 15 - December 7
- Target: $50-100M exit strategy`,
      category: 'Business'
    },
    {
      title: 'System Architecture',
      content: `# Jet AI Assistant Architecture

## Infrastructure
- **VPS**: Ubuntu 24.04 LTS on Vultr
- **Node**: Mac Mini (M-series) for Apple ecosystem
- **Gateway**: OpenClaw on port 18789
- **Dashboard**: Next.js on Railway

## Cost Optimization
- Claude Max: $200/month unlimited (saves $2,000+/year)
- Smart routing: Opus → Sonnet → Haiku
- Batch processing: $0.50 saved per batch
- Total savings: $3,000+ annually

## Integrations
- ProtonMail: jet.armo@proton.me
- Gmail OAuth: 2 accounts
- 2Captcha: API configured
- ElevenLabs: TTS active
- xAI/Grok: API ready`,
      category: 'Technical'
    }
  ];
  
  for (const doc of specialDocs) {
    db.addDoc({
      ...doc,
      created_at: Date.now(),
      updated_at: Date.now()
    });
    console.log(`✓ Added special doc: ${doc.title}`);
    totalImported++;
  }
  
  console.log(`\n✅ Import complete! Total documents: ${totalImported}`);
}

// Run import
importDocuments();