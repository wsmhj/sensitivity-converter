import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
import { DEFAULTS, encodeSettings, GAMES } from '../src/lib/conversion';
import { parseBackup } from '../src/lib/profiles';
async function main() {
  const origin = process.argv[2] || 'http://127.0.0.1:3000';
  const results = [];
  const fixtures = {
    report: encodeSettings({ ...DEFAULTS, dpiTo: '1600' }),
    csv: encodeSettings(DEFAULTS),
    profiles: JSON.stringify({
      version: 1,
      profiles: [{ id: 'qa-file', name: 'Downloaded profile', settings: DEFAULTS }],
    }),
  };
  await mkdir('docs/qa', { recursive: true });
  for (const kind of ['report', 'csv', 'profiles'] as const) {
    const response = await fetch(origin + '/api/export', {
      method: 'POST',
      headers: { origin, 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ kind, payload: fixtures[kind] }),
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const filename = response.headers.get('content-disposition')!.match(/filename="([^"]+)"/)![1];
    const text = await response.text();
    if (kind === 'report')
      assert.ok(
        Math.abs(Number(text.match(/Target sensitivity \(full precision\): (.+)/)![1]) - 11 / 70) <
          1e-12,
      );
    if (kind === 'csv') assert.equal(text.split('\r\n').length, GAMES.length);
    if (kind === 'profiles') assert.equal(parseBackup(text)?.[0].name, 'Downloaded profile');
    await writeFile('docs/qa/' + filename, text);
    results.push({ kind, status: 200, filename, bytes: Buffer.byteLength(text) });
  }
  const invalid = await fetch(origin + '/api/export', {
    method: 'POST',
    headers: { origin },
    body: new URLSearchParams({ kind: 'report', payload: 'bad' }),
  });
  assert.equal(invalid.status, 400);
  const foreign = await fetch(origin + '/api/export', {
    method: 'POST',
    headers: { origin: 'https://unrelated.example' },
    body: new URLSearchParams({ kind: 'report', payload: fixtures.report }),
  });
  assert.equal(foreign.status, 403);
  const fixture = await fetch(origin + '/qa-check/clipboard');
  assert.equal(fixture.status, 404, 'QA fixture must not be public in production');
  const output = {
    checkedAt: new Date().toISOString(),
    origin,
    attachments: results,
    invalidInput: invalid.status,
    foreignOrigin: foreign.status,
    productionQAFixture: fixture.status,
  };
  await writeFile('docs/qa/export-checks.json', JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
