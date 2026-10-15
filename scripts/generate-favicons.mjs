import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Helper to generate a multi-resolution Windows ICO file containing PNG streams
function createIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO format
  header.writeUInt16LE(count, 4); // Number of images

  let currentOffset = 6 + (16 * count);
  const dirEntries = [];

  for (const { width, height, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(data.length, 8); // Image size in bytes
    entry.writeUInt32LE(currentOffset, 12); // Offset to image data
    dirEntries.push(entry);
    currentOffset += data.length;
  }

  return Buffer.concat([header, ...dirEntries, ...images.map(img => img.data)]);
}

async function run() {
  const input = 'public/signal-logo.png';
  const meta = await sharp(input).metadata();

  // 1. Mask out bottom text "Signal" with exact background color #071c37
  const maskSvg = Buffer.from(`
    <svg width="${meta.width}" height="${meta.height}">
      <rect x="0" y="652" width="${meta.width}" height="${meta.height - 652}" fill="#071c37" />
    </svg>
  `);

  const cleanedImage = await sharp(input)
    .composite([{ input: maskSvg, blend: 'over' }])
    .png()
    .toBuffer();

  const cx = 832;
  const cy = 392;
  const cropSize = 600;
  const left = Math.round(cx - cropSize / 2);
  const top = Math.round(cy - cropSize / 2);

  // Modern Squircle mask with smooth continuous curvature
  const squircleSvg = Buffer.from(`
    <svg width="512" height="512">
      <rect x="0" y="0" width="512" height="512" rx="96" ry="96" fill="white" />
    </svg>
  `);

  // Master 512x512
  const master512 = await sharp(cleanedImage)
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize(512, 512, { kernel: 'lanczos3' })
    .composite([{ input: squircleSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 192x192
  const icon192 = await sharp(master512)
    .resize(192, 192, { kernel: 'lanczos3' })
    .png()
    .toBuffer();

  // 180x180 (Apple touch icon)
  const icon180 = await sharp(master512)
    .resize(180, 180, { kernel: 'lanczos3' })
    .png()
    .toBuffer();

  // 48x48
  const icon48 = await sharp(master512)
    .resize(48, 48, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5, m1: 0.5, m2: 0.5 })
    .png()
    .toBuffer();

  // 32x32
  const icon32 = await sharp(master512)
    .resize(32, 32, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6, m1: 0.7, m2: 0.7 })
    .png()
    .toBuffer();

  // 16x16
  const icon16 = await sharp(master512)
    .resize(16, 16, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.8, m1: 1.0, m2: 1.0 })
    .png()
    .toBuffer();

  // Generate multi-resolution ICO (16, 32, 48)
  const icoBuffer = createIco([
    { width: 16, height: 16, data: icon16 },
    { width: 32, height: 32, data: icon32 },
    { width: 48, height: 48, data: icon48 },
  ]);

  // Write to src/app/ (Next.js App Router metadata conventions)
  fs.writeFileSync('src/app/favicon.ico', icoBuffer);
  fs.writeFileSync('src/app/icon.png', master512);
  fs.writeFileSync('src/app/apple-icon.png', icon180);

  // Write to public/ (Direct web access fallback)
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  fs.writeFileSync('public/icon.png', master512);
  fs.writeFileSync('public/apple-icon.png', icon180);
  fs.writeFileSync('public/icon-192.png', icon192);
  fs.writeFileSync('public/icon-512.png', master512);
  fs.writeFileSync('public/favicon-32x32.png', icon32);
  fs.writeFileSync('public/favicon-16x16.png', icon16);

  console.log('All favicon files generated successfully:');
  console.log('- src/app/favicon.ico (multi-resolution ICO)');
  console.log('- src/app/icon.png (512x512)');
  console.log('- src/app/apple-icon.png (180x180)');
  console.log('- public/favicon.ico');
  console.log('- public/icon.png');
  console.log('- public/apple-icon.png');
  console.log('- public/icon-192.png');
  console.log('- public/icon-512.png');
  console.log('- public/favicon-32x32.png');
  console.log('- public/favicon-16x16.png');
}

run().catch(console.error);
