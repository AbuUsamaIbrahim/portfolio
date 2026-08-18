/**
 * Generates Open Graph cards, one per page, at 1200x630.
 *
 * Why bother: every link to this site is shared somewhere with a preview — LinkedIn,
 * Slack, a message to a recruiter. Without an og:image those previews render as a bare
 * grey box, which is the first impression for most visitors who did not arrive by search.
 * The layout already declared `twitter:card: summary_large_image` and then supplied no
 * image, which is the worst of both: platforms reserve the large slot and leave it empty.
 *
 * SVG is composed here and rasterised with sharp, which Astro already depends on. Text is
 * rendered as paths would be ideal, but sharp's SVG renderer (librsvg) resolves fonts from
 * the system — so this uses a generic family stack and keeps the type large enough that
 * substitution stays legible rather than broken.
 */
import sharp from 'sharp';
import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'public/og';
const W = 1200, H = 630;

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Naive wrap by character count — adequate because the type size is fixed. */
function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) { lines.push(line.trim()); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function card({ eyebrow, title, subtitle, accent }) {
  const lines = wrap(title, 30);
  const titleSvg = lines
    .map((l, i) => `<text x="80" y="${268 + i * 78}" class="t">${escape(l)}</text>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0e14"/>
      <stop offset="100%" stop-color="#11161f"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <style>
      .t  { fill:#e8edf5; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
            font-size:64px; font-weight:700; letter-spacing:-1.5px; }
      .e  { fill:${accent}; font-family:'SF Mono',Menlo,monospace;
            font-size:22px; letter-spacing:2.5px; }
      .s  { fill:#9aa7ba; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
            font-size:27px; }
      .n  { fill:#e8edf5; font-family:'SF Mono',Menlo,monospace; font-size:24px; }
      .d  { fill:#6b7a90; font-family:'SF Mono',Menlo,monospace; font-size:22px; }
    </style>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${W}" height="6" fill="url(#rule)"/>

  <text x="80" y="150" class="e">${escape(eyebrow.toUpperCase())}</text>
  ${titleSvg}
  <text x="80" y="${300 + lines.length * 78}" class="s">${escape(subtitle)}</text>

  <circle cx="88" cy="558" r="6" fill="${accent}"/>
  <text x="108" y="566" class="n">mahadi hasan</text>
  <text x="300" y="566" class="d">Lead Software Engineer</text>
</svg>`;
}

async function render(name, spec) {
  const png = await sharp(Buffer.from(card(spec))).png().toBuffer();
  await writeFile(path.join(OUT, `${name}.png`), png);
  console.log(`  ${OUT}/${name}.png  ${(png.length / 1024).toFixed(0)}kb`);
}

await mkdir(OUT, { recursive: true });

await render('default', {
  eyebrow: 'Portfolio',
  title: 'Event-driven systems that have to be right every time',
  subtitle: 'Java · Spring Boot · Kafka · Kubernetes · 8 years',
  accent: '#38bdf8',
});

// One per case study, from its own frontmatter, so a shared link previews itself.
const dir = 'src/content/case-studies';
for (const file of (await readdir(dir)).filter((f) => f.endsWith('.mdx'))) {
  const raw = await readFile(path.join(dir, file), 'utf8');
  const fm = raw.slice(0, raw.indexOf('\n---', 4));
  const get = (k) => (fm.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, 'm')) || [])[1] || '';
  await render(file.replace(/\.mdx$/, ''), {
    eyebrow: get('org') || 'Case study',
    title: get('title'),
    subtitle: get('subtitle'),
    accent: get('accent') || '#38bdf8',
  });
}
