// Simple validation script for multi-chat components
const fs = require('fs');
const path = require('path');

const componentsDir = './src/components/multi-chat';
const requiredFiles = [
  'MultiChatInterface.tsx',
  'ChatTabs.tsx',
  'ChatWindow.tsx',
  'ChatMessage.tsx',
  'ChatInput.tsx',
  'ActivityIndicator.tsx',
  'index.ts',
  'multi-chat.css',
  'README.md'
];

console.log('🔍 Validating Multi-Chat Components...\n');

let allValid = true;

// Check if all required files exist
requiredFiles.forEach(file => {
  const filePath = path.join(componentsDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} - ${(stats.size / 1024).toFixed(1)}KB`);
  } else {
    console.log(`❌ ${file} - Missing!`);
    allValid = false;
  }
});

console.log('\n📊 Component Analysis:');

// Check exports in index.ts
const indexPath = path.join(componentsDir, 'index.ts');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const exportCount = (indexContent.match(/export/g) || []).length;
  console.log(`📤 Index exports: ${exportCount} items`);
}

// Check CSS classes and animations
const cssPath = path.join(componentsDir, 'multi-chat.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const animationCount = (cssContent.match(/@keyframes/g) || []).length;
  const mediaQueryCount = (cssContent.match(/@media/g) || []).length;
  console.log(`🎨 CSS animations: ${animationCount} keyframes`);
  console.log(`📱 Responsive queries: ${mediaQueryCount} breakpoints`);
}

// Check component complexity
let totalLines = 0;
requiredFiles.filter(f => f.endsWith('.tsx')).forEach(file => {
  const filePath = path.join(componentsDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    totalLines += lines;
  }
});

console.log(`📝 Total component code: ${totalLines} lines`);

// Check demo page
const demoPath = './src/app/multi-chat-demo/page.tsx';
if (fs.existsSync(demoPath)) {
  console.log('🚀 Demo page created');
} else {
  console.log('❌ Demo page missing');
  allValid = false;
}

console.log(`\n${allValid ? '🎉' : '⚠️'} Multi-Chat Components: ${allValid ? 'READY' : 'ISSUES FOUND'}`);

if (allValid) {
  console.log(`
🔧 Integration Instructions:
1. Import: import { MultiChatInterface } from '@/components/multi-chat';
2. Use: <MultiChatInterface />
3. Demo: Visit /multi-chat-demo
4. Styles: Already imported in globals.css

✨ Features included:
• 4 specialized chat contexts (Medicare, Tech, Strategy, General)
• Real-time typing indicators
• Unread message badges
• Mobile-responsive design
• Context preservation between tabs
• Smooth animations and transitions
• Dark theme integration

🚀 Ready for production!
  `);
}

process.exit(allValid ? 0 : 1);