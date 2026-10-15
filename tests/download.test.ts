import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requestExport } from '../src/lib/download';

test('download handles server/network errors and unexpected HTML without leaving the tool', async () => {
  const signal = new AbortController().signal;
  for (const response of [
    new Response('error', { status: 500 }),
    new Response('<html>login</html>', { headers: { 'content-type': 'text/html' } }),
    new Response('', { headers: { 'content-type': 'text/plain' } }),
  ]) {
    await assert.rejects(requestExport('report', 'input', signal, async () => response));
  }
  await assert.rejects(
    requestExport('report', 'input', signal, async () => {
      throw new Error('offline');
    }),
    /offline/,
  );
});

test('download sends selected payload and validates a real attachment', async () => {
  const controller = new AbortController();
  const result = await requestExport(
    'csv',
    'current values',
    controller.signal,
    async (url, options) => {
      assert.equal(url, '/api/export');
      assert.equal(options?.method, 'POST');
      assert.equal(options?.signal, controller.signal);
      assert.equal((options?.body as URLSearchParams).get('payload'), 'current values');
      return new Response('Game,Sensitivity\r\nCS2,1', {
        headers: { 'content-type': 'text/csv; charset=utf-8' },
      });
    },
  );
  assert.equal(result.name, 'turnmatch-comparison.csv');
  assert.match(await result.blob.text(), /CS2,1/);
});
