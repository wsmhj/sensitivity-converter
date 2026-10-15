import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveSiteConfig } from '../src/lib/site-config';

test('local and preview builds remain usable but are not indexable', () => {
  assert.deepEqual(resolveSiteConfig({}), {
    origin: 'http://localhost:3000',
    deployment: 'local',
    indexable: false,
  });
  assert.equal(
    resolveSiteConfig({
      VERCEL_ENV: 'preview',
      NEXT_PUBLIC_SITE_URL: 'https://preview.example.com/',
    }).indexable,
    false,
  );
});

test('production rejects missing, malformed and placeholder origins, without requiring email', () => {
  for (const origin of [
    undefined,
    'http://localhost:3000',
    'https://example.com',
    'https://site.invalid',
    'http://turnmatch.com',
    'https://turnmatch.com/path',
    'https://user:pass@turnmatch.com',
    'https://turnmatch.com?x=1',
  ]) {
    assert.throws(() =>
      resolveSiteConfig({ TURNMATCH_DEPLOYMENT: 'production', NEXT_PUBLIC_SITE_URL: origin }),
    );
  }
  assert.throws(() =>
    resolveSiteConfig({ VERCEL_ENV: 'production', TURNMATCH_DEPLOYMENT: 'local' }),
  );
  assert.deepEqual(
    resolveSiteConfig({
      TURNMATCH_DEPLOYMENT: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://turnmatch.com/',
    }),
    { origin: 'https://turnmatch.com', deployment: 'production', indexable: true },
  );
});
