// Home FAQ checks. Run from web/: `npm run build && node --test 'src/**/*.test.mjs'`.
// 1. Every fact an answer declares (figures, named options, legal entity) equals its source:
//    a key of templates/data/terms.json or a cited repository file (alignment rule), and it
//    appears in the answer. Every number in an answer is a declared fact. Skipped where
//    terms.json is absent (the public site repository).
// 2. The FAQPage JSON-LD in dist/index.html matches the FAQ rendered on the page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAQ, RISK_REDUCER, TERMS_FILE, faqPageJsonLd } from './faq.ts';

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = join(here, '..', '..');
const repoRoot = join(webRoot, '..');
const termsPath = join(repoRoot, TERMS_FILE);
const hasTerms = existsSync(termsPath);

const walk = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const has = (haystack, needle) => haystack.toLocaleLowerCase('es-MX').includes(String(needle).toLocaleLowerCase('es-MX'));

const allTexts = () => [...FAQ.map((item) => ({ where: item.question, text: item.answer, facts: item.facts })), { where: 'RISK_REDUCER', ...RISK_REDUCER }];

test('the FAQ has 6 to 8 items with distinct questions and short answers', () => {
  assert.ok(FAQ.length >= 6 && FAQ.length <= 8, `FAQ has ${FAQ.length} items`);
  assert.equal(new Set(FAQ.map((i) => i.question)).size, FAQ.length);
  for (const item of FAQ) {
    const sentences = item.answer.split(/(?<=[.:?])\s+(?=[A-ZÁÉÍÓÚÑ¿])/).length;
    assert.ok(sentences <= 3, `${item.question}: ${sentences} sentences`);
  }
});

test('the copy uses the tú register, never usted', () => {
  for (const { where, text } of allTexts()) assert.ok(!/\busted\b|\bsu aprobación\b/i.test(text), `usted register in ${where}`);
});

test('every declared fact equals its source and appears in the answer', { skip: !hasTerms && 'terms.json not present' }, () => {
  const terms = JSON.parse(readFileSync(termsPath, 'utf8'));
  for (const { where, text, facts } of allTexts()) {
    assert.ok(facts.length > 0, `no facts declared for ${where}`);
    for (const fact of facts) {
      const label = `${where} → ${fact.source}${fact.key ? `#${fact.key}` : ''} = ${JSON.stringify(fact.value)}`;
      assert.ok(!/TODO/.test(String(fact.value)), `TODO fact in ${label}`);
      if (fact.source === TERMS_FILE) {
        assert.ok(fact.key, `missing terms.json key in ${label}`);
        const source = walk(terms, fact.key);
        assert.ok(source !== undefined, `unknown terms.json key in ${label}`);
        if (typeof fact.value === 'number') assert.equal(source, fact.value, `value differs from terms.json in ${label}`);
        else assert.ok(typeof source === 'string' && has(source, fact.value), `value not in terms.json in ${label}`);
      } else {
        assert.equal(fact.key, undefined, `key given for a file source in ${label}`);
        const file = join(repoRoot, fact.source);
        assert.ok(existsSync(file), `source file missing in ${label}`);
        assert.ok(has(readFileSync(file, 'utf8'), fact.value), `value not in source file in ${label}`);
      }
      assert.ok(has(text, fact.shown ?? fact.value), `fact not shown in the answer: ${label}`);
    }
    const shownNumbers = facts.flatMap((f) => String(f.shown ?? f.value).match(/\d+/g) ?? []);
    for (const n of text.match(/\d+/g) ?? []) assert.ok(shownNumbers.includes(n), `number ${n} in ${where} is not a declared fact`);
  }
});

const decode = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/g, "'")
    .replace(/&amp;/g, '&');
const stripTags = (s) => decode(s.replace(/<[^>]*>/g, '')).replace(/[ \t\r\n]+/g, ' ').trim();

test('the FAQPage JSON-LD of the built home matches the rendered FAQ', () => {
  const htmlPath = join(webRoot, 'dist', 'index.html');
  assert.ok(existsSync(htmlPath), 'dist/index.html missing: run `npm run build` first');
  const html = readFileSync(htmlPath, 'utf8');

  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const faqPages = ld.filter((d) => d['@type'] === 'FAQPage');
  assert.equal(faqPages.length, 1, 'exactly one FAQPage JSON-LD block');
  const fromLd = faqPages[0].mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }));

  const questions = [...html.matchAll(/<[^>]+data-faq-question[^>]*>([\s\S]*?)<\/(?:span|h3|summary)>/g)].map((m) => stripTags(m[1]));
  const answers = [...html.matchAll(/<[^>]+data-faq-answer[^>]*>([\s\S]*?)<\/(?:p|div)>/g)].map((m) => stripTags(m[1]));
  const rendered = questions.map((question, i) => ({ question, answer: answers[i] }));

  const expected = FAQ.map((item) => ({ question: item.question, answer: item.answer }));
  assert.deepEqual(rendered, expected, 'rendered FAQ differs from the FAQ data');
  assert.deepEqual(fromLd, expected, 'JSON-LD differs from the FAQ data');
  assert.deepEqual(faqPageJsonLd().mainEntity.length, FAQ.length);

  const faqAt = html.indexOf('id="preguntas-frecuentes"');
  const ctaAt = html.indexOf('Cuéntanos qué necesitas resolver');
  assert.ok(faqAt > 0 && ctaAt > faqAt, 'the FAQ section comes before the final CTA band');

  const reducer = html.match(/<p[^>]+data-risk-reducer[^>]*>([\s\S]*?)<\/p>/);
  assert.ok(reducer, 'risk-reducer line missing');
  assert.equal(stripTags(reducer[1]), RISK_REDUCER.text);
});
