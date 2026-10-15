import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  activeStage,
  createRun,
  duration,
  shootRun,
  targets,
  tickRun,
  totalHits,
} from '../src/lib/range';
test('quick check runs all four 15-second stages without counting paused or countdown time', () => {
  const r = createRun('quick');
  assert.equal(duration('quick'), 60);
  for (const [elapsed, stage] of [
    [0, 'precision'],
    [15, 'tracking'],
    [30, 'switching'],
    [45, 'turns'],
    [60, 'turns'],
  ] as const)
    assert.equal(activeStage('quick', elapsed), stage);
  for (let i = 0; i < 600; i++) tickRun(r, 0.1, 0, 0);
  assert.ok(Math.abs(r.elapsed - 60) < 1e-7);
  for (const s of Object.values(r.stats)) assert.ok(Math.abs(s.time - 15) < 1e-7);
  assert.equal(totalHits(r), 0);
});
test('precision uses actual angular head size and separates misses from acquired targets', () => {
  const r = createRun('precision');
  tickRun(r, 0.5, 0, 0);
  const t = targets(r)[0];
  assert.equal(shootRun(r, t.yaw + t.radius * 2, t.pitch), false);
  assert.equal(shootRun(r, t.yaw, t.pitch), true);
  assert.equal(r.stats.precision.hits, 1);
  assert.equal(r.stats.precision.shots, 2);
  assert.ok(Math.abs(r.stats.precision.acquisitionMs - 500) < 1e-7);
  assert.equal(r.index, 1);
});
test('tracking scores time on target without clicks and follows a repeating motion', () => {
  const r = createRun('tracking');
  for (let i = 0; i < 100; i++) {
    const t = targets(r)[0];
    tickRun(r, 0.01, t.yaw, t.pitch);
  }
  assert.ok(Math.abs(r.stats.tracking.onTarget - 1) < 1e-9);
  assert.equal(r.stats.tracking.shots, 0);
  const off = createRun('tracking');
  tickRun(off, 1, Math.PI, 0);
  assert.equal(off.stats.tracking.onTarget, 0);
});
test('switching requires the lit target; turn sequence includes actual 90 and 180 degree rotations', () => {
  const r = createRun('switching');
  assert.equal(targets(r).length, 5);
  const wrong = targets(r).find((t) => !t.active)!;
  assert.equal(shootRun(r, wrong.yaw, wrong.pitch), false);
  const t = targets(r).find((t) => t.active)!;
  assert.equal(shootRun(r, t.yaw, t.pitch), true);
  assert.equal(
    targets(r).some((t) => t.active),
    false,
  );
  tickRun(r, 0.2, 0, 0);
  assert.notEqual(targets(r).find((t) => t.active)!.yaw, t.yaw);
  const turns = createRun('turns');
  let previous = 0;
  for (const expected of [90, 90, 180, 180]) {
    const next = targets(turns)[0];
    assert.ok(Math.abs((Math.abs(next.yaw - previous) * 180) / Math.PI - expected) < 1e-9);
    shootRun(turns, next.yaw, next.pitch);
    previous = next.yaw;
    tickRun(turns, 0.2, next.yaw, next.pitch);
  }
});
test('stage boundaries and overlong frames do not extend total scored time', () => {
  const r = createRun('quick');
  tickRun(r, 100, 0, 0);
  assert.ok(Math.abs(r.elapsed - 60) < 1e-7);
  assert.ok(Math.abs(Object.values(r.stats).reduce((n, s) => n + s.time, 0) - 60) < 1e-7);
  tickRun(r, 10, 0, 0);
  assert.ok(Math.abs(r.elapsed - 60) < 1e-7);
});

test('tracking integration is stable across a stalled frame', () => {
  const a = createRun('tracking'),
    b = createRun('tracking');
  tickRun(a, 10, 0, 0);
  for (let i = 0; i < 600; i++) tickRun(b, 1 / 60, 0, 0);
  assert.ok(Math.abs(a.stats.tracking.onTarget - b.stats.tracking.onTarget) < 0.02);
});

test('moving headshot removes the old target and spawns a different moving target', () => {
  const r = createRun('tracking');
  tickRun(r, 2, 0, 0);
  const t = targets(r)[0],
    time = r.stageTime,
    onTarget = r.stats.tracking.onTarget,
    visibleTime = r.stats.tracking.trackingTime;
  assert.equal(shootRun(r, t.yaw + Math.PI, t.pitch), false);
  assert.deepEqual(targets(r)[0], t);
  assert.equal(shootRun(r, t.yaw, t.pitch), true);
  assert.equal(r.stats.tracking.hits, 1);
  assert.equal(r.stats.tracking.shots, 2);
  assert.equal(r.index, 1);
  assert.equal(r.stageTime, time);
  assert.equal(targets(r).length, 0);
  assert.ok(r.flash > 0);
  assert.equal(shootRun(r, t.yaw, t.pitch), false);
  assert.equal(r.stats.tracking.hits, 1);
  assert.equal(r.stats.tracking.shots, 2);
  tickRun(r, 0.1, 0, 0);
  assert.equal(targets(r).length, 0);
  assert.equal(r.stats.tracking.onTarget, onTarget);
  assert.equal(r.stats.tracking.trackingTime, visibleTime);
  tickRun(r, 0.1, 0, 0);
  const replacement = targets(r)[0];
  assert.notEqual(replacement.id, t.id);
  assert.notDeepEqual(replacement.direction, t.direction);
  tickRun(r, 0.2, 0, 0);
  assert.notDeepEqual(targets(r)[0].direction, replacement.direction);
});
test('switching kill hides the eliminated silhouette during respawn and restores a fresh lineup', () => {
  const r = createRun('switching');
  const killed = targets(r).find((t) => t.active)!;
  shootRun(r, killed.yaw, killed.pitch);
  assert.equal(targets(r).length, 4);
  assert.ok(targets(r).every((t) => t.id !== killed.id && !t.active));
  tickRun(r, 0.2, 0, 0);
  assert.equal(targets(r).length, 5);
  assert.equal(targets(r).filter((t) => t.active).length, 1);
});
test('shot feedback clears across quick-check stage boundaries', () => {
  const r = createRun('quick');
  shootRun(r, 0, 0);
  assert.equal(r.shotFeedback, 'hit');
  tickRun(r, 15, 0, 0);
  assert.equal(r.stage, 'tracking');
  assert.equal(r.shotFeedback, null);
  assert.equal(r.feedbackTime, 0);
});

test('repeated kills preserve respawn gaps and acquisition time in every standalone drill', () => {
  for (const mode of ['precision', 'tracking', 'switching', 'turns'] as const) {
    const r = createRun(mode);
    for (let i = 0; i < 60; i++) {
      tickRun(r, 0.2, 0, 0);
      const target = targets(r).find((t) => t.active)!;
      assert.ok(target);
      assert.equal(shootRun(r, target.yaw, target.pitch), true);
      const acquired = r.stats[mode].acquisitionMs;
      tickRun(r, 0.1, 0, 0);
      assert.equal(r.stats[mode].acquisitionMs, acquired);
      assert.equal(shootRun(r, target.yaw, target.pitch), false);
    }
    assert.equal(r.stats[mode].hits, 60);
    assert.equal(r.stats[mode].shots, 60);
    assert.ok(r.stats[mode].acquisitionMs > 0);
    assert.ok(r.elapsed < 30);
  }
});
