import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROFILE_EVIDENCE } from '../src/lib/profile-evidence';
import { GAMES } from '../src/lib/conversion';

test('every selectable profile exposes its assumptions without inventing game verification', () => {
  assert.equal(Object.keys(PROFILE_EVIDENCE).length, GAMES.length);
  for (const game of GAMES) {
    const evidence = PROFILE_EVIDENCE[game.id];
    assert.equal(evidence.source, game.source);
    assert.ok(evidence.scope && evidence.inputRule);
    assert.equal(evidence.testedGameVersion, null);
    assert.equal(evidence.lastInGameTest, null);
  }
});
