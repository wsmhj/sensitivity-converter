'use client';
import { memo, type RefObject } from 'react';
import { SCENARIOS, duration, type RangeRun } from '@/lib/range';

// React owns this shell; the game owns its four text values. Keep gameplay
// counters out of the modal's React state so a kill cannot rerender the form.
export const RangeHud = memo(function RangeHud({
  displayRef,
}: {
  displayRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={displayRef} className="aim-hud" aria-label="Practice statistics">
      <span>60s</span>
      <span>Precision shots</span>
      <span>0 kills</span>
      <span hidden>0% on target</span>
    </div>
  );
});

export function updateRangeHud(element: HTMLDivElement | null, run: RangeRun) {
  if (!element) return;
  const stat = run.stats[run.stage];
  const values = [
    `${Math.max(0, Math.ceil(duration(run.mode) - run.elapsed - 1e-8))}s`,
    SCENARIOS[run.stage].name,
    `${stat.hits} kills`,
    `${stat.trackingTime ? Math.round((stat.onTarget / stat.trackingTime) * 100) : 0}% on target`,
  ];
  for (let i = 0; i < values.length; i++) {
    const child = element.children[i];
    if (child.textContent !== values[i]) child.textContent = values[i];
  }
  const tracking = element.children[3] as HTMLElement;
  if (tracking.hidden !== (run.stage !== 'tracking')) tracking.hidden = run.stage !== 'tracking';
}
