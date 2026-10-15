import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateRangeHud } from '../src/components/range-hud';
import { createRun, shootRun, tickRun } from '../src/lib/range';

test('HUD stays current through kills, stage transitions, completion and restart without redundant writes', () => {
  let writes = 0;
  const children = Array.from({ length: 4 }, () => {
    let value = '';
    return {
      hidden: false,
      get textContent() {
        return value;
      },
      set textContent(next: string) {
        writes++;
        value = next;
      },
    };
  });
  const element = { children } as unknown as HTMLDivElement;
  const run = createRun('quick');
  updateRangeHud(element, run);
  const initial = writes;
  updateRangeHud(element, run);
  assert.equal(writes, initial);
  shootRun(run, 0, 0);
  updateRangeHud(element, run);
  assert.equal(children[2].textContent, '1 kills');
  assert.equal(writes, initial + 1);
  tickRun(run, 15, 0, 0);
  updateRangeHud(element, run);
  assert.equal(children[1].textContent, 'Moving target');
  assert.equal(children[2].textContent, '0 kills');
  assert.equal(children[3].hidden, false);
  tickRun(run, 45, 0, 0);
  updateRangeHud(element, run);
  assert.equal(children[0].textContent, '0s');
  assert.equal(children[3].hidden, true);
  updateRangeHud(element, createRun('tracking'));
  assert.equal(children[0].textContent, '30s');
  assert.equal(children[1].textContent, 'Moving target');
  assert.equal(children[3].hidden, false);
});
