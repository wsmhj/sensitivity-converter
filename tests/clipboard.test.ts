import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ClipboardQueue } from '../src/lib/clipboard';
test('a newer copy runs after an older write, so the final clipboard is current', async () => {
  const queue = new ClipboardQueue();
  let version = 1,
    clipboard = '',
    release!: () => void;
  const first = queue.write(
    'old',
    async (text) => {
      await new Promise<void>((resolve) => {
        release = resolve;
      });
      clipboard = text;
    },
    () => version === 1,
  );
  await Promise.resolve();
  await Promise.resolve();
  version = 2;
  const second = queue.write(
    'new',
    async (text) => {
      clipboard = text;
    },
    () => version === 2,
  );
  release();
  assert.equal(await first, false);
  assert.equal(await second, true);
  assert.equal(clipboard, 'new');
});
test('a failed write does not break later copies and cancelled work is skipped', async () => {
  const queue = new ClipboardQueue();
  await assert.rejects(
    queue.write(
      'bad',
      async () => {
        throw Error('denied');
      },
      () => true,
    ),
  );
  let called = false;
  assert.equal(
    await queue.write(
      'cancelled',
      async () => {
        called = true;
      },
      () => false,
    ),
    false,
  );
  assert.equal(called, false);
  assert.equal(
    await queue.write(
      'good',
      async () => {
        called = true;
      },
      () => true,
    ),
    true,
  );
  assert.equal(called, true);
});
