import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  storeProfiles,
  profilePersistenceMessage,
  PROFILE_STORAGE_KEY,
} from '../src/lib/profile-storage';
import { DEFAULTS } from '../src/lib/conversion';
import { readProfiles } from '../src/lib/profiles';

test('profile persistence survives reload and reports quota/access failure honestly', () => {
  const values = new Map<string, string>();
  const profiles = [{ id: 'one', name: 'My setup', settings: DEFAULTS }];
  assert.equal(
    storeProfiles(profiles, () => ({
      setItem: (key, value) => {
        values.set(key, value);
      },
    })),
    true,
  );
  assert.deepEqual(readProfiles(JSON.parse(values.get(PROFILE_STORAGE_KEY)!)), profiles);
  for (const getStorage of [
    () => {
      throw new Error('Access denied');
    },
    () => ({
      setItem: () => {
        throw new Error('Quota exceeded');
      },
    }),
  ]) {
    const saved = storeProfiles(profiles, getStorage);
    assert.equal(saved, false);
    for (const success of ['Renamed.', 'Imported.', 'Deleted.', 'Updated.', 'Restored.']) {
      assert.match(profilePersistenceMessage(saved, success), /only to this visit/);
      assert.ok(!profilePersistenceMessage(saved, success).includes(success));
    }
  }
});
