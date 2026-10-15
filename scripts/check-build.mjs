import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
const production = process.argv[2] === 'production';
const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').origin;
for (const route of ['index', 'about', 'contact', 'privacy', 'terms']) {
  const html = await readFile(`.next/server/app/${route}.html`, 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(
    new URL(canonical).href,
    new URL(route === 'index' ? '/' : `/${route}`, origin).href,
  );
  assert.ok(
    html.includes(`name="robots" content="${production ? 'index, follow' : 'noindex, nofollow'}"`),
  );
}
const robots = await readFile('.next/server/app/robots.txt.body', 'utf8');
assert.ok(robots.includes(production ? 'Allow: /' : 'Disallow: /'));
if (production) assert.ok(robots.includes(`${origin}/sitemap.xml`));
console.log(`${production ? 'Release' : 'Local preview'} build metadata verified for ${origin}.`);
