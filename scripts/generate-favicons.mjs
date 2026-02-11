#!/usr/bin/env node
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

async function generateFavicons() {
  const svgBuffer = readFileSync(join(publicDir, 'favicon.svg'));
  
  // Generate PNG sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-64x64.png', size: 64 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'favicon-128x128.png', size: 128 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'favicon-256x256.png', size: 256 },
    { name: 'favicon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];
  
  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, name));
    console.log(`Created ${name}`);
  }
  
  // Generate ICO file (16x16 and 32x32 combined)
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  
  // Simple ICO format
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type: 1 = ICO
  icoHeader.writeUInt16LE(2, 4); // Number of images
  
  const icoDir1 = Buffer.alloc(16);
  icoDir1.writeUInt8(16, 0);  // Width
  icoDir1.writeUInt8(16, 1);  // Height
  icoDir1.writeUInt8(0, 2);   // Color palette
  icoDir1.writeUInt8(0, 3);   // Reserved
  icoDir1.writeUInt16LE(1, 4);  // Color planes
  icoDir1.writeUInt16LE(32, 6); // Bits per pixel
  icoDir1.writeUInt32LE(png16.length, 8); // Size
  icoDir1.writeUInt32LE(22 + 32, 12); // Offset (header + 2 dir entries)
  
  const icoDir2 = Buffer.alloc(16);
  icoDir2.writeUInt8(32, 0);  // Width
  icoDir2.writeUInt8(32, 1);  // Height
  icoDir2.writeUInt8(0, 2);   // Color palette
  icoDir2.writeUInt8(0, 3);   // Reserved
  icoDir2.writeUInt16LE(1, 4);  // Color planes
  icoDir2.writeUInt16LE(32, 6); // Bits per pixel
  icoDir2.writeUInt32LE(png32.length, 8); // Size
  icoDir2.writeUInt32LE(22 + 32 + png16.length, 12); // Offset
  
  const ico = Buffer.concat([icoHeader, icoDir1, icoDir2, png16, png32]);
  writeFileSync(join(publicDir, 'favicon.ico'), ico);
  console.log('Created favicon.ico');
  
  // apple-touch-icon.png is already generated in the sizes loop above
  console.log('All favicons generated successfully!');
}

generateFavicons().catch(console.error);
