import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildReport, matchingRounds, skillReport, type Score } from '../src/lib/range-report';
import { createRun, tickRun } from '../src/lib/range';
function score(id: string, key = 'same'): Score {
  return {
    id,
    setupKey: key,
    hits: 0,
    shots: 0,
    mean: 0,
    scale: 1,
    fov: 103,
    label: 'Test setup',
    raw: false,
    mode: 'quick',
    stats: createRun('quick').stats,
  };
}
test('no shots and short tracking samples never receive a skill verdict', () => {
  const s = score('new');
  s.stats.precision.time = 15;
  s.stats.tracking.time = 15;
  s.stats.tracking.trackingTime = 3;
  const r = buildReport(s, []);
  assert.equal(r.skills[0].status, 'limited');
  assert.equal(r.skills[0].metric, null);
  assert.equal(r.skills[1].status, 'limited');
  assert.equal(r.strengths.length, 0);
  assert.ok(r.next?.goal.includes('5 deliberate shots'));
});
test('accuracy strengths and measured miss concerns are kept distinct', () => {
  const a = score('a').stats.precision;
  Object.assign(a, {
    time: 15,
    shots: 10,
    hits: 9,
    misses: 1,
    missDegrees: 2,
    acquisitionMs: 4500,
  });
  const strong = skillReport('precision', a);
  assert.equal(strong.status, 'strong');
  assert.equal(strong.metric, 90);
  assert.ok(strong.good[0].includes('90%'));
  const weak = skillReport('precision', { ...a, hits: 3, misses: 7, missDegrees: 14 });
  assert.equal(weak.status, 'developing');
  assert.ok(weak.focus[0].includes('7 shots missed'));
  assert.ok(!weak.focus.join(' ').includes('sensitivity is too'));
});
test('tracking excludes respawn time and does not mistake kills for sustained tracking', () => {
  const s = score('a').stats.tracking;
  Object.assign(s, {
    time: 15,
    trackingTime: 10,
    onTarget: 2,
    hits: 6,
    shots: 6,
    errorDegrees: 30,
  });
  const r = skillReport('tracking', s);
  assert.equal(r.metric, 20);
  assert.equal(r.status, 'developing');
  assert.ok(r.good.some((t) => t.includes('6 moving targets')));
  assert.ok(r.focus[0].includes('80%'));
});
test('comparisons exclude the current round and changed setup or scenario', () => {
  const current = score('current'),
    old = score('old'),
    different = score('other', 'different');
  assert.deepEqual(matchingRounds(current, [old, current, different]), [old]);
  const changedMode = score('mode', 'mode-specific');
  changedMode.mode = 'precision';
  assert.equal(buildReport(current, [current, changedMode, different]).matchingCount, 0);
});
test('faster but less accurate is explicitly described as a tradeoff', () => {
  const prior = score('old').stats.switching,
    current = score('new').stats.switching;
  Object.assign(prior, { time: 30, hits: 8, shots: 10, acquisitionMs: 4000 });
  Object.assign(current, { time: 30, hits: 9, shots: 15, acquisitionMs: 2700 });
  const r = skillReport('switching', current, prior);
  assert.ok(r.comparison.some((t) => t.includes('20.0 percentage points')));
  assert.ok(
    r.comparison.some((t) => t.includes('200ms faster') && t.includes('not a clear improvement')),
  );
});
test('short samples are not compared and no reaction-time or percentile score is invented', () => {
  const prior = score('old').stats.turns,
    current = score('new').stats.turns;
  Object.assign(prior, { time: 15, hits: 2, shots: 4, acquisitionMs: 3000 });
  Object.assign(current, { time: 15, hits: 3, shots: 4, acquisitionMs: 3000 });
  const r = skillReport('turns', current, prior);
  assert.equal(r.comparison.length, 0);
  assert.equal(r.status, 'limited');
  assert.ok(r.focus.some((t) => t.includes('not measured automatically')));
});

test('exactly eight seconds accumulated by the engine qualifies despite floating point rounding', () => {
  const run = createRun('tracking');
  tickRun(run, 8, 0, 0);
  assert.notEqual(skillReport('tracking', run.stats.tracking).status, 'limited');
});

test('each saved turn observation changes advice without changing measured results', () => {
  const s = score('observation');
  Object.assign(s.stats.turns, { time: 15, shots: 10, hits: 8, acquisitionMs: 4000 });
  s.stats.precision.time = 15;
  const baseline = buildReport(s, []);
  assert.equal(baseline.next?.scenario, 'precision');
  for (const observation of ['comfortable', 'lift', 'past', 'short'] as const) {
    const r = buildReport({ ...s, observation }, []);
    assert.ok(r.turnAdvice?.summary);
    assert.ok(r.turnAdvice?.goal);
    assert.equal(r.next?.scenario, 'turns');
    assert.deepEqual(r.skills, baseline.skills);
  }
  assert.equal(buildReport({ ...s, observation: '' }, []).next?.scenario, 'precision');
});

test('turn observations cannot affect reports without a played turn stage', () => {
  const s = score('moving');
  s.mode = 'tracking';
  s.stats.tracking.time = 30;
  const r = buildReport({ ...s, observation: 'past' }, []);
  assert.equal(r.turnAdvice, null);
  assert.equal(r.next?.scenario, 'tracking');
});
