import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RangeDiagnostics } from '../src/lib/range-diagnostics';

test('local diagnostics distinguish slow scheduling from expensive drawing and shooting', () => {
  const diagnostics = new RangeDiagnostics();
  assert.equal(diagnostics.snapshot().frames, 0);
  for (let i = 0; i < 99; i++) diagnostics.frame(16.67, 0.8);
  diagnostics.frame(180, 1.2);
  diagnostics.shot(0.4);
  const result = diagnostics.snapshot();
  assert.equal(result.frames, 100);
  assert.equal(result.frameP95, 16.67);
  assert.equal(result.frameMax, 180);
  assert.equal(result.framesOver50ms, 1);
  assert.equal(result.drawMax, 1.2);
  assert.equal(result.shots, 1);
  assert.equal(result.shotMax, 0.4);
});

test('diagnostic percentile window stays bounded while whole-round counts remain accurate', () => {
  const diagnostics = new RangeDiagnostics();
  for (let i = 0; i < 10000; i++) diagnostics.frame(i < 5000 ? 100 : 8, 1);
  const result = diagnostics.snapshot();
  assert.equal(result.frames, 10000);
  assert.equal(result.frameP95, 8);
  assert.equal(result.frameMax, 100);
  assert.equal(result.framesOver50ms, 5000);
});
