// Site legal kit checks (templates/legal/sitios/ of the workspace). Run from web/: `npm test`
// (it builds first). The analytics case builds a scratch copy of the site with a fictitious
// Cloudflare token in the system temp directory, so the real config is never touched.
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { COOKIE_POLICY, LAW_NAME, PRIVACY_AUTHORITY, PRIVACY_NOTICE, TERMS, CONTACT_FORM_ID } from './legal.ts';

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = join(here, '..', '..');
const distRoot = join(webRoot, 'dist');

const htmlFiles = (root) => {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) out.push(p);
    }
  };
  walk(root);
  return out;
};
// Pages with a layout (redirect stubs have no footer).
const layoutPages = (root) => htmlFiles(root).filter((f) => readFileSync(f, 'utf8').includes('<footer'));
const page = (root, route) => {
  const file = join(root, route, 'index.html');
  assert.ok(existsSync(file), `${relative(webRoot, file)} missing: run \`npm run build\` first`);
  return readFileSync(file, 'utf8');
};
const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
const footerOf = (html) => {
  const m = html.match(/<footer[\s\S]*?<\/footer>/);
  assert.ok(m, 'footer missing');
  return m[0];
};
const BEACON_HOST = 'static.cloudflareinsights.com';

describe('default build (no analytics token)', () => {
  test('the built site contains no TODO and never names the INAI', () => {
    const files = htmlFiles(distRoot);
    assert.ok(files.length > 5, 'dist is empty: run `npm run build` first');
    for (const f of files) {
      const html = readFileSync(f, 'utf8');
      assert.ok(!/TODO/.test(html), `TODO in ${relative(webRoot, f)}`);
      assert.ok(!/\bINAI\b/.test(html), `INAI in ${relative(webRoot, f)}`);
    }
  });

  test('the privacy notice cites the current law, the authority, ARCO, providers, version and date', () => {
    const t = text(page(distRoot, 'aviso-de-privacidad'));
    assert.ok(t.includes(LAW_NAME), 'law of DOF 20 March 2025 not named');
    assert.match(LAW_NAME, /20 de marzo de 2025/);
    assert.ok(!/\b2010\b/.test(t), 'mentions 2010');
    assert.ok(t.includes(PRIVACY_AUTHORITY), 'authority not named');
    assert.match(t, /20 días/);
    assert.match(t, /15 días/);
    assert.match(t, /identificación oficial/);
    assert.match(t, /Formspree/);
    assert.match(t, /GitHub/);
    assert.match(t, /remisiones/i);
    assert.ok(t.includes(`Versión ${PRIVACY_NOTICE.version}`), 'version not printed');
    assert.ok(t.includes(PRIVACY_NOTICE.updated), 'date not printed');
    assert.ok(!/Cloudflare/.test(t), 'names Cloudflare while no analytics is configured');
  });

  test('the contact form shows the simplified notice and sends the consent fields', () => {
    const html = page(distRoot, 'contacto');
    const form = html.match(/<form[^>]*id="contact-form"[\s\S]*?<\/form>/)?.[0];
    assert.ok(form, 'contact form missing');
    const t = text(form);
    assert.match(t, /es responsable de los datos personales que usted proporcione en este formulario/);
    assert.match(form, /href="\/aviso-de-privacidad"/);
    const box = form.match(/<input[^>]*name="consentimiento_privacidad"[^>]*>/)?.[0];
    assert.ok(box, 'consent checkbox missing');
    assert.match(box, /type="checkbox"/);
    assert.match(box, /\brequired\b/);
    assert.ok(!/\bchecked\b/.test(box), 'consent checkbox is pre-checked');
    assert.match(form, new RegExp(`<input[^>]*type="hidden"[^>]*name="aviso_version"[^>]*value="${PRIVACY_NOTICE.version.replace(/\./g, '\\.')}"`));
    assert.match(form, new RegExp(`<input[^>]*type="hidden"[^>]*name="formulario"[^>]*value="${CONTACT_FORM_ID}"`));
    assert.ok(form.indexOf('es responsable de los datos personales') < form.indexOf('type="submit"'), 'notice is not above the submit button');
  });

  test('no analytics beacon and no banner when no token is configured', () => {
    for (const f of htmlFiles(distRoot)) {
      const html = readFileSync(f, 'utf8');
      assert.ok(!html.includes(BEACON_HOST), `beacon in ${relative(webRoot, f)}`);
      assert.ok(!html.includes('id="py-consent"'), `banner in ${relative(webRoot, f)}`);
      assert.ok(!html.includes('data-consent-open'), `«Configurar cookies» in ${relative(webRoot, f)}`);
    }
  });

  test('every footer has the company data and the legal links', () => {
    const pages = layoutPages(distRoot);
    assert.ok(pages.length > 5);
    for (const f of pages) {
      const foot = footerOf(readFileSync(f, 'utf8'));
      const t = text(foot);
      for (const s of ['Pyramidev Technologies, S.A. de C.V.', 'PTE260206DH3', 'Juan Cousin 136', 'C.P. 01420', 'hola@pyramidev.com.mx', '+52 55 4535 1951']) {
        assert.ok(t.includes(s), `${s} missing in the footer of ${relative(webRoot, f)}`);
      }
      for (const href of ['/aviso-de-privacidad', '/politica-de-cookies', '/terminos']) {
        assert.ok(foot.includes(`href="${href}"`), `${href} missing in the footer of ${relative(webRoot, f)}`);
      }
    }
  });

  test('the cookie policy lists only the essential storage the site uses', () => {
    const t = text(page(distRoot, 'politica-de-cookies'));
    assert.match(t, /Política de cookies/);
    assert.match(t, /\btheme\b/);
    assert.ok(!/py-consent/.test(t), 'lists the banner storage while the banner is off');
    assert.ok(!/Cloudflare/.test(t), 'lists Cloudflare while no analytics is configured');
    assert.ok(t.includes(`Versión ${COOKIE_POLICY.version}`));
    assert.ok(t.includes(COOKIE_POLICY.updated));
  });

  test('the site terms are the kit terms, with version and date', () => {
    const t = text(page(distRoot, 'terminos'));
    assert.match(t, /Términos de uso del sitio/);
    assert.match(t, /no constituye una oferta ni una cotización/i);
    assert.match(t, /Estados Unidos Mexicanos/);
    assert.ok(t.includes('Al navegar por este sitio, usted acepta estos términos.'), 'misses the browsing acceptance sentence');
    assert.ok(t.includes(`Versión ${TERMS.version}`));
    assert.ok(t.includes(TERMS.updated));
  });
});

describe('build with an analytics token (scratch copy)', () => {
  const TOKEN = 'fictitious-test-token-0000';
  let scratch;
  let dist;

  before(() => {
    scratch = mkdtempSync(join(tmpdir(), 'pyramidev-web-legal-'));
    cpSync(webRoot, scratch, {
      recursive: true,
      filter: (src) => !/[\\/](node_modules|dist|\.astro)$/.test(src),
    });
    symlinkSync(join(webRoot, 'node_modules'), join(scratch, 'node_modules'), 'dir');
    const sitePath = join(scratch, 'src', 'data', 'site.ts');
    const site = readFileSync(sitePath, 'utf8');
    assert.ok(site.includes("cloudflareToken: ''"), 'site.ts no longer has an empty cloudflareToken');
    writeFileSync(sitePath, site.replace("cloudflareToken: ''", `cloudflareToken: '${TOKEN}'`));
    execFileSync(process.execPath, [join(webRoot, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build'], { cwd: scratch, stdio: 'pipe' });
    dist = join(scratch, 'dist');
  });
  after(() => {
    if (scratch) rmSync(scratch, { recursive: true, force: true });
  });

  test('the beacon is written inert, gated behind analytics consent', () => {
    for (const f of layoutPages(dist)) {
      const html = readFileSync(f, 'utf8');
      const scripts = [...html.matchAll(/<script\b[^>]*>/g)].map((m) => m[0]).filter((s) => s.includes(BEACON_HOST));
      assert.equal(scripts.length, 1, `expected one beacon tag in ${f}`);
      const tag = scripts[0];
      assert.match(tag, /type="text\/plain"/);
      assert.match(tag, /data-consent="analytics"/);
      assert.match(tag, new RegExp(`data-src="https://${BEACON_HOST.replace(/\./g, '\\.')}/beacon\\.min\\.js"`));
      assert.ok(!/\ssrc="/.test(tag), 'beacon has a live src');
      assert.ok(tag.includes(TOKEN), 'token missing in data-cf-beacon');
    }
  });

  test('the banner, its assets and «Configurar cookies» are on every page', () => {
    for (const f of layoutPages(dist)) {
      const html = readFileSync(f, 'utf8');
      assert.match(html, new RegExp(`id="py-consent"[^>]*data-policy-version="${COOKIE_POLICY.version.replace(/\./g, '\\.')}"`));
      assert.match(html, /<script[^>]*src="\/legal\/banner-consentimiento\.js"/);
      assert.match(html, /<link[^>]*href="\/legal\/banner-consentimiento\.css"/);
      const foot = footerOf(html);
      assert.match(foot, /<a[^>]*href="\/politica-de-cookies#configurar"[^>]*data-consent-open[^>]*>Configurar cookies<\/a>/);
    }
  });

  test('the cookie policy and the privacy notice name the analytics tool', () => {
    const cookies = text(page(dist, 'politica-de-cookies'));
    assert.match(cookies, /Cloudflare Web Analytics/);
    assert.match(cookies, /py-consent/);
    assert.match(text(page(dist, 'aviso-de-privacidad')), /Cloudflare/);
  });

  test('the analytics build still ships no TODO', () => {
    for (const f of htmlFiles(dist)) assert.ok(!/TODO/.test(readFileSync(f, 'utf8')), `TODO in ${f}`);
  });
});

describe('banner script (public/legal/banner-consentimiento.js)', () => {
  const sandbox = {};
  vm.runInNewContext(readFileSync(join(webRoot, 'public', 'legal', 'banner-consentimiento.js'), 'utf8'), sandbox);
  const core = sandbox.PyConsentCore;
  const v = COOKIE_POLICY.version;

  test('nothing optional is granted before a decision or for another policy version', () => {
    assert.equal(core.granted(null, 'analytics', v), false);
    assert.equal(core.granted(null, 'essential', v), true);
    const old = core.makeRecord({ choices: { analytics: true }, policyVersion: '0.0.1', source: 'banner', action: 'accept_all', consentId: 'x', now: new Date(0) });
    assert.equal(core.granted(old, 'analytics', v), false);
  });

  test('analytics is granted only after opt-in of the current version', () => {
    const yes = core.makeRecord({ choices: core.choicesFor('accept'), policyVersion: v, source: 'banner', action: 'accept_all', consentId: 'x', now: new Date(0) });
    const no = core.makeRecord({ choices: core.choicesFor('reject'), policyVersion: v, source: 'banner', action: 'reject_all', consentId: 'x', now: new Date(0) });
    assert.equal(core.granted(yes, 'analytics', v), true);
    assert.equal(core.granted(no, 'analytics', v), false);
  });
});
