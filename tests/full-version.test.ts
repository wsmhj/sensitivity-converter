import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fovAngles, measuredYaw } from '../src/lib/measurements';
import { DEFAULTS, encodeSettings } from '../src/lib/conversion';
import { parseBackup } from '../src/lib/profiles';
import { POST } from '../src/app/api/export/route';
const near = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-9);
test('FOV conventions agree through perspective projection', () => {
  const a = fovAngles(90, 1920, 1080, 'h43')!;
  near(a.horizontal, 106.26020470831196);
  near(a.vertical, 73.73979529168804);
  near(fovAngles(a.vertical, 1920, 1080, 'vertical')!.horizontal, a.horizontal);
  near(fovAngles(a.diagonal, 1920, 1080, 'diagonal')!.vertical, a.vertical);
  assert.equal(fovAngles(180, 1920, 1080, 'vertical'), null);
  assert.equal(fovAngles(90, 0, 1080, 'horizontal'), null);
});
test('measurement independently reconstructs yaw in both units', () => {
  near(measuredYaw(1, 800, (360 * 2.54) / (0.022 * 800), 'cm')!, 0.022);
  near(measuredYaw(1, 800, 360 / (0.022 * 800), 'in')!, 0.022);
  assert.equal(measuredYaw(0, 800, 40, 'cm'), null);
  assert.equal(measuredYaw(1, 800, NaN, 'cm'), null);
});
test('FOV helper rejects extreme viewport ratios and underflowed angles', () => {
  assert.equal(fovAngles(90, 100000, 1e-300, 'horizontal'), null);
  assert.equal(fovAngles(1e-323, 1920, 1080, 'vertical'), null);
});
test('backup parser rejects invalid profiles, duplicates and unknown schema', () => {
  const p = { id: 'test', name: 'My profile', settings: DEFAULTS };
  assert.equal(parseBackup(JSON.stringify({ version: 1, profiles: [p] }))?.length, 1);
  for (const value of [
    { version: 2, profiles: [p] },
    { version: 1, profiles: [p, p] },
    { version: 1, profiles: [{ ...p, settings: { ...DEFAULTS, input: '0' } }] },
  ])
    assert.equal(parseBackup(JSON.stringify(value)), null);
  assert.equal(parseBackup('broken'), null);
});
function request(kind: string, payload: string, origin = 'http://localhost:3000') {
  return new Request('http://localhost:3000/api/export', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ kind, payload }),
  });
}
test('attachment report is recomputed from validated inputs', async () => {
  const r = await POST(request('report', encodeSettings({ ...DEFAULTS, dpiTo: '1600' })));
  assert.equal(r.status, 200);
  assert.ok(r.headers.get('content-disposition')?.includes('.txt'));
  assert.equal(r.headers.get('cache-control'), 'no-store');
  near(Number((await r.text()).match(/Target sensitivity \(full precision\): (.+)/)![1]), 11 / 70);
});
test('CSV and profile backups have actual formats and reject bad input', async () => {
  const csv = await POST(request('csv', encodeSettings(DEFAULTS)));
  assert.equal(csv.status, 200);
  assert.ok((await csv.text()).startsWith('Game,Sensitivity,Target DPI'));
  const backup = await POST(
    request(
      'profiles',
      JSON.stringify({ version: 1, profiles: [{ id: 'a', name: 'QA', settings: DEFAULTS }] }),
    ),
  );
  assert.equal((await backup.json()).profiles[0].name, 'QA');
  assert.equal((await POST(request('report', 'broken'))).status, 400);
  assert.equal(
    (await POST(request('report', encodeSettings(DEFAULTS), 'https://unrelated.example'))).status,
    403,
  );
});
test('export checks browser Host rather than internal request host', async () => {
  const r = new Request('http://localhost:3001/api/export', {
    method: 'POST',
    headers: { origin: 'http://127.0.0.1:3001', host: '127.0.0.1:3001' },
    body: new URLSearchParams({ kind: 'report', payload: encodeSettings(DEFAULTS) }),
  });
  assert.equal((await POST(r)).status, 200);
});
test('comparison export never emits infinity for an individually overflowing row', async () => {
  const s = {
    ...DEFAULTS,
    input: '100000',
    to: 'custom',
    customTo: true,
    yawTo: '360',
    dpiTo: '1e-300',
  };
  assert.equal((await POST(request('csv', encodeSettings(s)))).status, 400);
});
