import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entryEffect, scopedAdjustment, GAME_GUIDES } from '../src/lib/game-guides';
import { calculate, DEFAULTS, GAMES } from '../src/lib/conversion';
test('game-retained value changes distance inversely, including coarse rounding', () => {
  assert.deepEqual(entryEffect(2, 1, 40), { actualCm: 80, distanceError: 100 });
  assert.deepEqual(entryEffect(2, 4, 40), { actualCm: 20, distanceError: -50 });
  for (const n of [0, -1, NaN, Infinity]) assert.equal(entryEffect(1, n, 40), null);
});
test('measured scoped adjustment predicts a shorter distance with a larger setting', () => {
  assert.equal(scopedAdjustment(1, 80, 40), 2);
  assert.equal(scopedAdjustment(50, 40, 80), 25);
  for (const n of [0, -1, Infinity, NaN]) assert.equal(scopedAdjustment(1, n, 40), null);
  assert.equal(scopedAdjustment(1e12, 1e12, 1e-300), null);
});
test('R6 default reference and custom multiplier preserve the measured rotation', () => {
  const a = calculate({ ...DEFAULTS, to: 'r6' });
  assert.ok(a.ok);
  if (!a.ok) return;
  assert.ok(Math.abs(a.result.targetSens - 0.022 / ((0.0001 * 180) / Math.PI)) < 1e-12);
  const b = calculate({
    ...DEFAULTS,
    to: 'r6',
    customTo: true,
    yawTo: String((0.0001 * 180) / Math.PI / 10),
  });
  assert.ok(b.ok);
  if (!b.ok) return;
  assert.ok(Math.abs(b.result.targetSens / a.result.targetSens - 10) < 1e-12);
  assert.equal(b.result.targetCm, a.result.targetCm);
  for (const id of Object.keys(GAME_GUIDES)) assert.ok(GAMES.some((g) => g.id === id));
});
