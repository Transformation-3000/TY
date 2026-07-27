const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

const files = [
  path.join(__dirname, 'public/images/hero_icon_performance_3d.png'),
  path.join(__dirname, 'public/images/hero_icon_defense_3d.png'),
  path.join(__dirname, 'public/images/hero_icon_resilience_3d.png')
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  const data = fs.readFileSync(file);
  const png = PNG.sync.read(data);
  
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      let idx = (png.width * y + x) << 2;
      let r = png.data[idx];
      let g = png.data[idx + 1];
      let b = png.data[idx + 2];
      
      // Calculate perceptual brightness
      let brightness = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
      
      // Cut off dark background cleanly
      if (brightness < 60) {
        png.data[idx + 3] = 0; // Fully transparent background
      } else if (brightness < 100) {
        // Smooth edge antialiasing
        let alpha = Math.min(255, Math.floor((brightness - 60) * 6.375));
        png.data[idx + 3] = alpha;
      }
    }
  }
  
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(file, buffer);
  console.log('Freigestellt PNG:', file);
});
