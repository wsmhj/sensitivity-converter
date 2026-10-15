import assert from 'node:assert/strict';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
import { writeFile, mkdir } from 'node:fs/promises';
const origin = process.argv[2] || 'http://127.0.0.1:3000';
const canonicalOrigin = new URL(
  process.argv[3] || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
).origin;
const paths = ['/', '/about', '/contact', '/privacy', '/terms'];
const pages = new Map(),
  checks = [];
for (const path of paths) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200);
  const html = await response.text();
  pages.set(path, html);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.ok(html.includes('name="description"'));
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical, `Missing canonical on ${path}`);
  assert.equal(new URL(canonical).href, new URL(path, canonicalOrigin).href);
  checks.push({
    path,
    status: response.status,
    title: html.match(/<title>(.*?)<\/title>/)?.[1],
    h1: 1,
  });
}
const assets = new Set();
let internalLinks = 0;
for (const [path, html] of pages) {
  for (const match of html.matchAll(/href="([^"<>]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const u = new URL(href, origin + path);
    if (
      u.pathname.startsWith('/_next/') ||
      u.pathname === '/icon.svg' ||
      u.pathname === '/feedback-widget.js'
    ) {
      assets.add(u.pathname + u.search);
      continue;
    }
    if (u.pathname === '/opengraph-image') continue;
    const target = pages.get(u.pathname);
    assert.ok(target, `Missing route: ${href}`);
    if (u.hash) assert.ok(target.includes(`id="${u.hash.slice(1)}"`), `Missing anchor: ${href}`);
    internalLinks++;
  }
  for (const match of html.matchAll(/(?:src|href)="(\/_next\/[^"<>]+)"/g))
    assets.add(match[1].replaceAll('&amp;', '&'));
}
for (const asset of assets) {
  const response = await fetch(origin + asset);
  assert.equal(response.status, 200, asset);
}
const home = pages.get('/');
const data = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(data[0]['@type'], 'WebApplication');
assert.equal(data[1].mainEntity.length, 11);
for (const item of data[1].mainEntity) {
  assert.ok(home.includes(item.name), 'FAQ schema question must be rendered');
  assert.ok(item.acceptedAnswer.text.length > 0);
}
for (const path of ['/robots.txt', '/sitemap.xml', '/opengraph-image']) {
  const r = await fetch(origin + path);
  assert.equal(r.status, 200);
  checks.push({ path, status: r.status, contentType: r.headers.get('content-type') });
}
assert.equal((await fetch(origin + '/missing-page')).status, 404);
assert.equal((await fetch(origin + '/qa-check/reliability')).status, 404);
assert.equal((await fetch(origin + '/qa-check/clipboard')).status, 404);
await mkdir('docs/qa', { recursive: true });
const result = {
  checkedAt: new Date().toISOString(),
  origin,
  pages: checks,
  internalLinks,
  assets: assets.size,
  schema: 'WebApplication + 11 FAQ entries',
  missingRoute: 404,
};
await writeFile('docs/qa/http-seo-checks.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
