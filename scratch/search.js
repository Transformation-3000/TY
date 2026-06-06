const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/mieh/True Years GmbH/TY - Dokumente/RAG True Years/05 IT/Prototyp Antigravity/TY Prototyp/components/layout/WelcomeSection.tsx';
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('gear') || line.toLowerCase().includes('setting') || line.toLowerCase().includes('einstellung')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
