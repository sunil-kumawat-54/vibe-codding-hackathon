import fs from 'fs';
import path from 'path';

const sourceDir = 'C:\\Users\\Asus\\.gemini\\antigravity-ide\\brain\\81fe6171-b2f4-4eb9-acbb-1e53c9eec6e0';
const destDir = 'c:\\Users\\Asus\\OneDrive\Desktop\\vibeathon\\frontend\\public\\images';

// Ensure destination folder exists
fs.mkdirSync(destDir, { recursive: true });

const files = [
  { src: 'risotto_plate_1785093348817.png', dest: 'risotto_plate.png' },
  { src: 'tiramisu_dessert_1785093362813.png', dest: 'tiramisu.png' },
  { src: 'wine_bottle_1785093375019.png', dest: 'wine.png' },
  { src: 'chef_portrait_1785093389651.png', dest: 'chef.png' },
  { src: 'fiorentina_steak_1785093549010.png', dest: 'fiorentina.png' },
  { src: 'lobster_ravioli_1785093563141.png', dest: 'ravioli.png' },
  { src: 'caprese_salad_1785093577713.png', dest: 'caprese.png' },
  { src: 'beef_carpaccio_1785093590977.png', dest: 'carpaccio.png' },
  { src: 'chocolate_cake_1785093604032.png', dest: 'chocolate_cake.png' },
  { src: 'white_wine_1785093616378.png', dest: 'gavi_wine.png' }
];

files.forEach(f => {
  const srcPath = path.join(sourceDir, f.src);
  const destPath = path.join(destDir, f.dest);
  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Successfully copied ${f.src} -> ${f.dest}`);
    } else {
      console.error(`Error: Source file does not exist: ${srcPath}`);
    }
  } catch (err) {
    console.error(`Error copying ${f.src}:`, err.message);
  }
});
