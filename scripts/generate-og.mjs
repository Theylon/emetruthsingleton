/**
 * Generates public/og-image.png — a 1200×630 Open Graph card for EmeTruth.
 * Run once: node scripts/generate-og.mjs
 */

import sharp from 'sharp';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(__dirname, '../public/og-image.png');

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#141c24"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <linearGradient id="gold-bar" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#e9c176"/>
      <stop offset="100%" stop-color="rgba(233,193,118,0)"/>
    </linearGradient>
    <radialGradient id="orb-tl" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(120 120) scale(320)">
      <stop offset="0%" stop-color="#e9c176" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#e9c176" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb-br" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(1080 510) scale(260)">
      <stop offset="0%" stop-color="#e9c176" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#e9c176" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Subtle grid -->
  <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
    ${Array.from({length: 17}, (_, i) => `<line x1="${i * 72}" y1="0" x2="${i * 72}" y2="${H}"/>`).join('\n    ')}
    ${Array.from({length: 9}, (_, i) => `<line x1="0" y1="${i * 72}" x2="${W}" y2="${i * 72}"/>`).join('\n    ')}
  </g>

  <!-- Orbs -->
  <rect width="${W}" height="${H}" fill="url(#orb-tl)"/>
  <rect width="${W}" height="${H}" fill="url(#orb-br)"/>

  <!-- Gold accent bar top -->
  <rect x="72" y="72" width="320" height="2" fill="url(#gold-bar)" rx="1"/>

  <!-- Brand mark placeholder (circle with E) -->
  <circle cx="96" cy="130" r="22" fill="none" stroke="#e9c176" stroke-width="1.5"/>
  <text x="96" y="137" font-family="Georgia, serif" font-size="20" font-weight="bold"
    fill="#e9c176" text-anchor="middle">E</text>

  <!-- Brand name -->
  <text x="132" y="140" font-family="Arial, Helvetica, sans-serif" font-size="15"
    font-weight="bold" fill="rgba(255,255,255,0.5)" letter-spacing="6">EMETRUTH</text>

  <!-- Main headline -->
  <text x="72" y="310" font-family="Arial Black, Arial, sans-serif" font-size="88"
    font-weight="900" fill="#ffffff" letter-spacing="-4">LIQUIDITY</text>
  <text x="72" y="406" font-family="Arial Black, Arial, sans-serif" font-size="88"
    font-weight="900" fill="#e9c176" letter-spacing="-4">LAYER.</text>

  <!-- Descriptor -->
  <text x="72" y="480" font-family="Arial, Helvetica, sans-serif" font-size="22"
    fill="rgba(255,255,255,0.55)" letter-spacing="1">For prediction markets.</text>

  <!-- Proof pill -->
  <rect x="72" y="520" width="240" height="44" rx="22"
    fill="rgba(233,193,118,0.12)" stroke="rgba(233,193,118,0.28)" stroke-width="1"/>
  <text x="192" y="548" font-family="Arial, Helvetica, sans-serif" font-size="13"
    font-weight="bold" fill="#e9c176" text-anchor="middle" letter-spacing="2">$19M THROUGH THE ENGINE</text>

  <!-- Right side — URL -->
  <text x="1128" y="560" font-family="Arial, Helvetica, sans-serif" font-size="15"
    fill="rgba(255,255,255,0.3)" text-anchor="end" letter-spacing="2">emetruth.com</text>

  <!-- Bottom gold line -->
  <rect x="0" y="${H - 3}" width="${W}" height="3" fill="#e9c176" opacity="0.7"/>
</svg>
`.trim();

await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`OG image written to ${outPath}`);
