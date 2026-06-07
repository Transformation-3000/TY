const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/mieh/.gemini/antigravity/brain/ae829d89-6835-459e-9fd7-c38fbcd6d053/.system_generated/logs/transcript.jsonl';
if (fs.existsSync(logPath)) {
  console.log('Log file found. Searching for domains...');
  const fileContent = fs.readFileSync(logPath, 'utf-8');
  const lines = fileContent.split('\n');
  lines.forEach((line) => {
    if (line.includes('.de') || line.includes('.com') || line.includes('.app')) {
      if (!line.includes('github.com') && !line.includes('dicebear.com') && !line.includes('schema.org') && !line.includes('w3.org') && !line.includes('liveavatar.com')) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.content) {
            console.log(`Content: ${parsed.content}`);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  });
} else {
  console.log('No log file found');
}
