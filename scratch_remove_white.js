const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

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

rawFiles.forEach(({ src, dest }) => {
  if (!fs.existsSync(src)) return;
  
  const buffer = fs.readFileSync(src);
  const png = PNG.sync.read(buffer);
  
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      let idx = (png.width * y + x) << 2;
      let r = png.data[idx];
      let g = png.data[idx + 1];
      let b = png.data[idx + 2];
      
      // If pixel is white or light background
      if (r > 225 && g > 225 && b > 225) {
        png.data[idx + 3] = 0; // Fully transparent
      } else if (r > 190 && g > 190 && b > 190) {
        let maxVal = Math.max(r, g, b);
        let alpha = Math.floor((255 - maxVal) * 3.9);
        png.data[idx + 3] = Math.max(0, Math.min(255, alpha));
      }
    }
  }
  
  const outputBuffer = PNG.sync.write(png);
  fs.writeFileSync(dest, outputBuffer);
  console.log('Freigestellt successfully:', dest);
});
