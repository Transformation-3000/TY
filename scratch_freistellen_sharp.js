const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const rawFiles = [
  {
    src: "C:\\Users\\mieh\\.gemini\\antigravity\\brain\\f82c60ad-9167-4fbf-8618-d25fa4fcbfd1\\hero_icon_performance_3d_1785163822769.png",
    dest: "c:\\Users\\mieh\\True Years GmbH\\TY - Dokumente\\RAG True Years\\04 IT (DH)\\Prototyp Antigravity\\TY Prototyp\\public\\images\\hero_icon_performance_3d.png"
  },
  {
    src: "C:\\Users\\mieh\\.gemini\\antigravity\\brain\\f82c60ad-9167-4fbf-8618-d25fa4fcbfd1\\hero_icon_defense_3d_1785163837760.png",
    dest: "c:\\Users\\mieh\\True Years GmbH\\TY - Dokumente\\RAG True Years\\04 IT (DH)\\Prototyp Antigravity\\TY Prototyp\\public\\images\\hero_icon_defense_3d.png"
  },
  {
    src: "C:\\Users\\mieh\\.gemini\\antigravity\\brain\\f82c60ad-9167-4fbf-8618-d25fa4fcbfd1\\hero_icon_resilience_3d_1785163846708.png",
    dest: "c:\\Users\\mieh\\True Years GmbH\\TY - Dokumente\\RAG True Years\\04 IT (DH)\\Prototyp Antigravity\\TY Prototyp\\public\\images\\hero_icon_resilience_3d.png"
  }
];

async function freistellen() {
  for (const { src, dest } of rawFiles) {
    if (!fs.existsSync(src)) continue;
    
    const { data, info } = await sharp(src)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // If background pixel (near white)
      if (r > 220 && g > 220 && b > 220) {
        data[i + 3] = 0; // Make 100% transparent
      } else if (r > 180 && g > 180 && b > 180) {
        const maxVal = Math.max(r, g, b);
        const alpha = Math.floor((255 - maxVal) * 3.4);
        data[i + 3] = Math.max(0, Math.min(255, alpha));
      }
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(dest);
    
    console.log('Freigestellt with sharp:', dest);
  }
}

freistellen().catch(console.error);
