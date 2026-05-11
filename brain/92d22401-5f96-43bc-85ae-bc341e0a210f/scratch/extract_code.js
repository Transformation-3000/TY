
const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\mieh\\.gemini\\antigravity\\brain\\27289056-45c7-45b2-bc94-f5ec666e8a35\\.system_generated\\logs\\overview.txt';
const content = fs.readFileSync(logPath, 'utf8');

const lines = content.split('\n');
let lastCode = '';

for (const line of lines) {
    if (!line.includes('EntwicklungPage')) continue;
    try {
        const entry = JSON.parse(line);
        const findInObj = (obj) => {
            if (!obj || typeof obj !== 'object') return;
            
            if (obj.name === 'write_to_file' || obj.name === 'replace_file_content' || obj.name === 'multi_replace_file_content') {
                const args = obj.args;
                const target = args.TargetFile || args.targetFile || args.TargetContent || "";
                if (target.includes('EntwicklungPage.tsx')) {
                    const code = args.CodeContent || args.ReplacementContent || "";
                    if (code.length > 500) {
                        lastCode = code;
                    }
                    if (args.ReplacementChunks) {
                         for(const chunk of args.ReplacementChunks) {
                             if (chunk.ReplacementContent && chunk.ReplacementContent.length > 500) {
                                 lastCode = chunk.ReplacementContent;
                             }
                         }
                    }
                }
            }

            for (const key in obj) {
                findInObj(obj[key]);
            }
        };
        findInObj(entry);
    } catch (e) {}
}

if (lastCode) {
    fs.writeFileSync('C:\\Users\\mieh\\Desktop\\TY Prototyp\\brain\\92d22401-5f96-43bc-85ae-bc341e0a210f\\scratch\\extracted_entwicklung.tsx', lastCode);
    console.log('Successfully extracted code to scratch directory.');
} else {
    console.log('No code found for EntwicklungPage.tsx in logs.');
}
