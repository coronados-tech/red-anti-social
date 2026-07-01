import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const iconSvg = path.join(root, 'public', 'icon.svg');
const faviconIco = path.join(root, 'public', 'favicon.ico');

const sizes = [16, 32, 48, 256];
const pngs = await Promise.all(
  sizes.map((size) => sharp(iconSvg).resize(size, size).png().toBuffer()),
);

const ico = await pngToIco(pngs);
fs.writeFileSync(faviconIco, ico);

console.log(`Generated ${faviconIco} (${ico.length} bytes, sizes: ${sizes.join(', ')})`);
