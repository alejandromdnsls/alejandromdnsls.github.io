// Home hero rules (S7, S9): the hero shows Pyramidev's own «software factory» illustration (an
// original isometric SVG), never a product or case image; projects appear only in the cases
// section. Run from web/: `npm test` (it builds first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(here, '..', '..', 'dist', 'index.html');
const page = () => {
  assert.ok(existsSync(htmlPath), 'dist/index.html missing: run `npm run build` first');
  return readFileSync(htmlPath, 'utf8');
};
const hero = () => {
  const html = page();
  const start = html.indexOf('<section id="inicio"');
  assert.ok(start >= 0, 'hero section (#inicio) missing');
  return html.slice(start, html.indexOf('</section>', start));
};
const factorySvg = () => {
  const svg = hero().match(/<svg\b[^>]*data-software-factory[^>]*>[\s\S]*?<\/svg>/);
  assert.ok(svg, 'software factory SVG missing from the hero');
  return svg[0];
};

test('the home hero has no product or case image', () => {
  const section = hero();
  assert.ok(!/<picture\b/.test(section), 'the hero contains a <picture>');
  // The only image allowed is the decorative isotipo watermark (brand asset, empty alt).
  for (const img of section.match(/<img\b[^>]*>/g) ?? []) {
    assert.ok(!/assets\/cases|livilinq|ticketax|smac|cobaempak|web-inicio|app-pagos|app-reservaciones|sitio-inicio/i.test(img), `case image in the hero: ${img}`);
    assert.match(img, /isotipo/, `unexpected image in the hero: ${img}`);
  }
  assert.ok(!/frame-browser|frame-phone/.test(section), 'the hero still renders a product frame');
});

test('the hero contains the accessible software factory illustration', () => {
  const svg = factorySvg();
  assert.match(svg, /role="img"/);
  assert.match(svg, /<title\b[^>]*>[^<]+<\/title>/);
  assert.match(svg, /<desc\b[^>]*>[^<]{40,}<\/desc>/);
  assert.ok(!/data-process-svg/.test(hero()), 'the old staircase illustration is still in the hero');
});

test('the illustration uses brand tokens only and stays under 60 KB', () => {
  const svg = factorySvg();
  const markup = svg.replace(/href="#[\w-]+"/g, '').replace(/aria-labelledby="[^"]*"/g, '');
  assert.ok(!/#[0-9a-f]{3,8}\b/i.test(markup), 'hardcoded hex color in the SVG markup');
  assert.ok(!/\b(fill|stroke)="(?!none)[^"]+"/.test(markup), 'inline fill/stroke color in the SVG markup');
  assert.ok(Buffer.byteLength(svg) < 60 * 1024, `SVG markup is ${Buffer.byteLength(svg)} bytes (limit 60 KB)`);
});

test('the illustration animations are removed under reduced motion', () => {
  const css = [...page().matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  assert.match(css, /\.sf-travel[^{]*\{[^}]*animation:/, 'animation rule for the illustration missing');
  const reduced = [...css.matchAll(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{((?:[^{}]*\{[^}]*\})*)\s*\}/g)].map((m) => m[1]).join('\n');
  assert.match(reduced, /\.sf-anim[^{]*\{[^}]*animation:\s*none/, 'no reduced-motion rule stops the illustration animations');
  assert.ok(!/transition:\s*all/.test(css), 'transition: all in the built CSS');
});
