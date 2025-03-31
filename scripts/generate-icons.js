import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [96, 192, 512];
const inputFile = path.join(process.cwd(), 'public', 'favicon.svg');
const outputDir = path.join(process.cwd(), 'public');

async function generateIcons() {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate icons for each size
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputFile)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`Generated ${size}x${size} icon`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 