import { test } from 'node:test';
import assert from 'node:assert/strict';
import { featureEvent, aimEvent } from '../src/lib/analytics';

test('analytics payload excludes unapproved fields and only uses business outcomes', () => {
  const events: unknown[] = [];
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      WebAnalytics: {
        track: (name: string, properties: unknown) => events.push({ name, properties }),
      },
    },
  });
  try {
    const details = {
      error_code: 'invalid_backup',
      result_count: 2,
      input: 'private input',
      profile_name: 'private name',
      email: 'private@example.invalid',
    };
    featureEvent('profile_import', 'error', details);
    assert.deepEqual(events, [
      {
        name: 'feature_error',
        properties: { feature_id: 'profile_import', error_code: 'invalid_backup', result_count: 2 },
      },
    ]);
  } finally {
    Reflect.deleteProperty(globalThis, 'window');
  }
});
test('blocked analytics and server rendering never break the converter', () => {
  assert.doesNotThrow(() => featureEvent('conversion', 'success', { result_count: 1 }));
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      WebAnalytics: {
        track: () => {
          throw Error('blocked');
        },
      },
    },
  });
  try {
    assert.doesNotThrow(() => featureEvent('conversion', 'success', { result_count: 1 }));
  } finally {
    Reflect.deleteProperty(globalThis, 'window');
  }
});

test('practice lifecycle is separate from completion and sends only categorical context', () => {
  const events: unknown[] = [];
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      WebAnalytics: {
        track: (name: string, properties: unknown) => events.push({ name, properties }),
      },
    },
  });
  try {
    for (const action of [
      'started',
      'paused',
      'resumed',
      'abandoned',
      'closed',
      'reset',
      'trial_applied',
    ] as const)
      aimEvent(action, 'tracking');
    assert.deepEqual(
      events.map((e) => (e as { name: string }).name),
      [
        'aim_started',
        'aim_paused',
        'aim_resumed',
        'aim_abandoned',
        'aim_closed',
        'aim_reset',
        'aim_trial_applied',
      ],
    );
    assert.ok(
      events.every(
        (e) =>
          JSON.stringify((e as { properties: unknown }).properties) ===
          '{"feature_id":"aim_tracking"}',
      ),
    );
  } finally {
    Reflect.deleteProperty(globalThis, 'window');
  }
  assert.doesNotThrow(() => aimEvent('started', 'quick'));
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      WebAnalytics: {
        track: () => {
          throw Error('blocked');
        },
      },
    },
  });
  try {
    assert.doesNotThrow(() => aimEvent('paused', 'quick'));
  } finally {
    Reflect.deleteProperty(globalThis, 'window');
  }
});
