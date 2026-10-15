import { GAMES, type Game } from './conversion';

export type ProfileEvidence = {
  id: string;
  source: string;
  scope: string;
  referenceRecordedAt: string | null;
  testedGameVersion: string | null;
  lastInGameTest: string | null;
  inputRule: string;
};

// Historical source inventory, not a claim of fresh in-game measurements.
// Add a version/date only alongside reproducible physical-turn evidence.
function reference(game: Game): ProfileEvidence {
  return {
    id: game.id,
    source: game.source,
    scope: game.note,
    referenceRecordedAt: game.id === 'custom' ? null : '2026-10-14',
    testedGameVersion: null,
    lastInGameTest: null,
    inputRule:
      game.id === 'r6'
        ? 'Integer 1–100 at multiplier 0.02.'
        : game.id === 'fortnite'
          ? 'Displayed percentage points: 4 means 4%.'
          : 'Check the range and precision retained by your game.',
  };
}

export const PROFILE_EVIDENCE: Readonly<Record<string, ProfileEvidence>> = Object.fromEntries(
  GAMES.map((game) => [game.id, reference(game)]),
);
