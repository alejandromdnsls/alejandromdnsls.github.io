// Delivery checks of the built site. Run from web/: `npm test` (it builds first).
// 1. public/llms.txt exists and links every page of the sitemap, and never a draft case.
// 2. Stylesheets are inlined (build.inlineStylesheets): no render-blocking /_astro/*.css request.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = join(here, '..', '..');
const distRoot = join(webRoot, 'dist');
const SITE = 'https://www.pyramidev.com.mx';

const llmsPath = join(webRoot, 'public', 'llms.txt');
const llms = () => readFileSync(llmsPath, 'utf8');
// Paths linked from llms.txt, normalized without the trailing slash (the home stays "/").
const linkedPaths = () =>
  new Set([...llms().matchAll(/\]\((https:\/\/www\.pyramidev\.com\.mx[^)#\s]*)/g)].map((m) => new URL(m[1]).pathname.replace(/(.)\/$/, '$1')));

const sitemapPaths = () => {
  const files = readdirSync(distRoot).filter((f) => /^sitemap-\d+\.xml$/.test(f));
  assert.ok(files.length > 0, 'sitemap missing: run `npm run build` first');
  return files.flatMap((f) => [...readFileSync(join(distRoot, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/(.)\/$/, '$1')));
};

test('llms.txt exists and starts with the site name and a summary', () => {
  assert.ok(existsSync(llmsPath), 'public/llms.txt missing');
  assert.match(llms(), /^# Pyramidev\n\n> .+/);
  assert.ok(existsSync(join(distRoot, 'llms.txt')), 'llms.txt is not copied to dist/');
});

test('llms.txt links every page of the sitemap', () => {
  const linked = linkedPaths();
  for (const path of sitemapPaths()) assert.ok(linked.has(path), `llms.txt does not link ${SITE}${path}`);
});

test('llms.txt links only built pages and never a draft case', () => {
  const built = new Set(sitemapPaths());
  for (const path of linkedPaths()) assert.ok(built.has(path), `llms.txt links ${path}, which is not a built page`);
  const drafts = readdirSync(join(webRoot, 'src', 'content', 'cases'))
    .filter((f) => /^draft:\s*true\s*$/m.test(readFileSync(join(webRoot, 'src', 'content', 'cases', f), 'utf8')))
    .map((f) => f.replace(/\.md$/, ''));
  assert.ok(drafts.length > 0, 'expected at least one draft case to check');
  for (const slug of drafts) assert.ok(!llms().includes(`/casos/${slug}`), `llms.txt links the draft case ${slug}`);
});

test('stylesheets are inlined in every built page', () => {
  for (const route of ['index.html', 'servicios/index.html', 'casos/index.html', 'casos/ticketax/index.html']) {
    const html = readFileSync(join(distRoot, route), 'utf8');
    assert.ok(!/<link[^>]+rel="stylesheet"[^>]+href="\/_astro\//.test(html), `${route} still links a /_astro stylesheet`);
    assert.match(html, /<style>/, `${route} has no inline <style>`);
  }
});
