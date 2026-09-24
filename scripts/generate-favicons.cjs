const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcPath = 'C:/Users/ADMIN/.gemini/antigravity/brain/6b999076-82fd-4b2c-9fe3-ba04315414a8/.user_uploaded/media_1790255368393.jpg';

async function makeFavicons() {
  // 1. 32x32 favicon
  await sharp(srcPath)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile('public/favicon-32x32.png');

  // 2. 64x64 icon for app/icon.png
  await sharp(srcPath)
    .resize(64, 64, { fit: 'cover' })
    .png()
    .toFile('src/app/icon.png');

  // 3. 180x180 apple touch icon
  await sharp(srcPath)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile('public/apple-touch-icon.png');

  // 4. 192x192 general icon
  await sharp(srcPath)
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile('public/icon.png');

  // 5. Copy to .ico
  fs.copyFileSync('public/favicon-32x32.png', 'public/favicon.ico');
  fs.copyFileSync('public/favicon-32x32.png', 'src/app/favicon.ico');

  // 6. SVG wrapper with crisp base64
  const pngBase64 = fs.readFileSync('public/icon.png').toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <image href="data:image/png;base64,${pngBase64}" width="192" height="192"/>
</svg>`;
  fs.writeFileSync('public/favicon.svg', svgContent);

  console.log('Successfully generated all favicon formats!');
}

makeFavicons().catch(console.error);
