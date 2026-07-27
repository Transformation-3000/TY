const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install pngjs temporarily if needed
try {
  require.resolve('pngjs');
} catch (e) {
  execSync('npm install --no-save pngjs', { stdio: 'inherit' });
}

const PNG = require('pngjs').PNG;

const files = [
  path.join(__dirname, '../../public/images/hero_icon_performance_3d.png'),
  path.join(__dirname, '../../public/images/hero_icon_defense_3d.png'),
  path.join(__dirname, '../../public/images/hero_icon_resilience_3d.png')
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  fs.createReadStream(file)
    .pipe(new PNG({ filterType: 4 }))
    .on('parsed', function() {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          let idx = (this.width * y + x) << 2;
          let r = this.data[idx];
          let g = this.data[idx + 1];
          let b = this.data[idx + 2];
          
          let brightness = (r * 0.299 + g * 0.587 + b * 0.114);
          if (brightness < 40) {
            this.data[idx + 3] = 0; // Make transparent
          } else if (brightness < 80) {
            let alpha = Math.min(255, Math.floor((brightness - 30) * 5));
            this.data[idx + 3] = alpha;
          }
        }
      }
      this.pack().pipe(fs.createWriteStream(file)).on('finish', () => {
        console.log('Processed transparent PNG:', file);
      });
    });
});
