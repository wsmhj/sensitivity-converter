import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderRange } from '../src/lib/range-renderer';
import { createRun, tickRun } from '../src/lib/range';
function recorder() {
  const calls: unknown[] = [];
  const state: Record<string, unknown> = {};
  const ctx = new Proxy(state, {
    get(target, key) {
      if (
        typeof key === 'string' &&
        [
          'beginPath',
          'moveTo',
          'lineTo',
          'closePath',
          'fillRect',
          'fill',
          'stroke',
          'fillText',
        ].includes(key)
      )
        return (...args: unknown[]) => {
          const styles =
            key === 'fill' || key === 'fillRect'
              ? [target.fillStyle]
              : key === 'stroke'
                ? [target.strokeStyle, target.lineWidth]
                : key === 'fillText'
                  ? [target.fillStyle, target.font, target.textAlign]
                  : [];
          calls.push([key, ...args, ...styles]);
        };
      return target[key as string];
    },
    set(target, key, value) {
      target[key as string] = value;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, calls };
}
test('cached static projection preserves drawing when a moving target changes', () => {
  const run = createRun('tracking'),
    cached = recorder();
  renderRange(cached.ctx, 1000, 420, 0, 0, 103, run, '#fff');
  cached.calls.length = 0;
  tickRun(run, 0.5, 0, 0);
  renderRange(cached.ctx, 1000, 420, 0, 0, 103, run, '#fff');
  const fresh = recorder();
  renderRange(fresh.ctx, 1000, 420, 0, 0, 103, run, '#fff');
  assert.deepEqual(cached.calls, fresh.calls);
});
test('projection cache invalidates for camera, FOV and viewport changes', () => {
  const run = createRun('switching'),
    cached = recorder();
  renderRange(cached.ctx, 1000, 420, 0, 0, 103, run, '#fff');
  for (const [w, h, yaw, pitch, fov] of [
    [1000, 420, 0.8, 0.1, 103],
    [1000, 420, 0.8, 0.1, 90],
    [320, 300, 0.8, 0.1, 90],
  ]) {
    cached.calls.length = 0;
    renderRange(cached.ctx, w, h, yaw, pitch, fov, run, '#fff');
    const fresh = recorder();
    renderRange(fresh.ctx, w, h, yaw, pitch, fov, run, '#fff');
    assert.deepEqual(cached.calls, fresh.calls);
  }
});

test('reused projection buffers do not retain clipped points or labels across rapid turns', () => {
  const run = createRun('switching'),
    cached = recorder();
  for (const [yaw, pitch] of [
    [0, 0],
    [1.5, 0.7],
    [Math.PI, -0.8],
    [-1.5, 1.2],
    [0, 0],
    [0.1, -1.2],
    [Math.PI, 0],
    [0, 0],
  ]) {
    cached.calls.length = 0;
    renderRange(cached.ctx, 1056, 420, yaw, pitch, 103, run, '#fff');
    const fresh = recorder();
    renderRange(fresh.ctx, 1056, 420, yaw, pitch, 103, run, '#fff');
    assert.deepEqual(cached.calls, fresh.calls);
  }
});
