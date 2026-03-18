import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const samples = [
  { file: 'lisa-jung.mp3', voice: 'nova', text: 'Hallo, ich bin Lisa – dein persönlicher Coach. Ich freue mich, dich auf deinem Weg zu begleiten.' },
  { file: 'lisa-alt.mp3', voice: 'shimmer', text: 'Hallo, ich bin Lisa – dein persönlicher Coach. Ich freue mich, dich auf deinem Weg zu begleiten.' },
  { file: 'tom-jung.mp3', voice: 'echo', text: 'Hallo, ich bin Tom – dein persönlicher Coach. Ich freue mich, dich auf deinem Weg zu begleiten.' },
  { file: 'tom-alt.mp3', voice: 'onyx', text: 'Hallo, ich bin Tom – dein persönlicher Coach. Ich freue mich, dich auf deinem Weg zu begleiten.' },
];

const outDir = path.resolve(__dirname, '..', 'public', 'audio');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  for (const s of samples) {
    console.log(`Generating ${s.file} (voice: ${s.voice})...`);
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: s.voice,
      input: s.text,
      speed: 1.0,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const outPath = path.join(outDir, s.file);
    fs.writeFileSync(outPath, buffer);
    console.log(`  -> saved ${outPath} (${buffer.length} bytes)`);
  }
  console.log('Done!');
})();
