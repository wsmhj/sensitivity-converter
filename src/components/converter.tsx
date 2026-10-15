'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Score } from '@/lib/range-report';
const AimTrainer = dynamic(() => import('./aim-trainer'), {
  ssr: false,
  loading: () => <p role="status">Opening practice range…</p>,
});
import {
  calculate,
  DEFAULTS,
  decodeSettings,
  encodeSettings,
  format,
  game,
  GAMES,
  report,
  type Settings,
  type InputMode,
} from '@/lib/conversion';
import MeasurementTools from './measurement-tools';
import GamePicker from './game-picker';
import { SettingGuide, ScopedAssistant } from './setting-guide';
import ExportForm from './export-form';
import { ImportBackup, ProfileIcon } from './profile-controls';
import { parseBackup, readProfiles, type Profile } from '@/lib/profiles';
import {
  storeProfiles,
  profilePersistenceMessage,
  type ProfileStorage,
} from '@/lib/profile-storage';
import { ClipboardQueue } from '@/lib/clipboard';
import { decimal } from '@/lib/numeric';
import { featureEvent } from '@/lib/analytics';

const STORAGE = 'turnmatch-settings-v1',
  PROFILES = 'turnmatch-profiles-v1',
  FAVORITES = 'turnmatch-favorites-v1';

export default function Converter({
  clipboardWriter,
  profileStorage,
}: {
  clipboardWriter?: (text: string) => Promise<void>;
  profileStorage?: () => ProfileStorage;
} = {}) {
  const [s, setS] = useState<Settings>(DEFAULTS),
    [loaded, setLoaded] = useState(false),
    [lock, setLock] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]),
    [profiles, setProfiles] = useState<Profile[]>([]),
    [profileName, setProfileName] = useState('');
  const [message, setMessage] = useState(''),
    [feedback, setFeedback] = useState({ key: '', text: '' }),
    [manual, setManual] = useState(''),
    [tableQuery, setTableQuery] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [practice, setPractice] = useState(false),
    [practiceScores, setPracticeScores] = useState<Score[]>([]);
  const revision = useRef(0);
  const clipboardQueue = useRef(new ClipboardQueue());
  const conversionActivity = useRef(false);
  const [backupText, setBackupText] = useState(''),
    [reverseError, setReverseError] = useState(''),
    [profileMessage, setProfileMessage] = useState('');
  const [editing, setEditing] = useState(''),
    [editName, setEditName] = useState(''),
    [undoProfiles, setUndoProfiles] = useState<Profile[] | null>(null);
  const [draftEpoch, setDraftEpoch] = useState(0),
    [reverseDraft, setReverseDraft] = useState('');
  const outcome = useMemo(() => calculate(s), [s]);
  const r = outcome.ok ? outcome.result : null,
    errors = outcome.ok ? {} : outcome.errors;
  const from = game(s.from)!,
    to = game(s.to)!;

  useEffect(() => {
    function restoreHash() {
      const hash = location.hash;
      if (!hash.startsWith('#settings=')) return false;
      const decoded = decodeSettings(hash.slice(10));
      if (decoded) {
        setS(decoded);
        setMessage('Shared settings restored.');
      } else {
        setS({ ...DEFAULTS });
        setMessage('This settings link is invalid or unsupported. Default settings are shown.');
      }
      revision.current++;
      setFeedback({ key: '', text: '' });
      setManual('');
      setReverseDraft('');
      setReverseError('');
      setDraftEpoch((x) => x + 1);
      return true;
    }
    try {
      if (!restoreHash()) {
        const saved = localStorage.getItem(STORAGE),
          decoded = saved ? decodeSettings(saved) : null;
        if (decoded) setS(decoded);
      }
      const fav = JSON.parse(localStorage.getItem(FAVORITES) || '[]');
      if (Array.isArray(fav))
        setFavorites(fav.filter((id: unknown) => typeof id === 'string' && game(id)).slice(0, 30));
      const savedProfiles = JSON.parse(localStorage.getItem(PROFILES) || '[]');
      const validProfiles = readProfiles(savedProfiles);
      if (validProfiles) setProfiles(validProfiles);
    } catch {
      setMessage('Saved browser data could not be read. The converter still works.');
    }
    setLoaded(true);
    const changed = () => {
      restoreHash();
      setLock(false);
    };
    window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(STORAGE, encodeSettings(s));
      } catch {
        /* Storage is optional. */
      }
  }, [s, loaded]);
  useEffect(() => {
    if (!loaded || !conversionActivity.current) return;
    const timer = setTimeout(() => {
      conversionActivity.current = false;
      featureEvent(
        'conversion',
        outcome.ok ? 'success' : 'error',
        outcome.ok ? { result_count: 1 } : { error_code: 'invalid_input' },
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [outcome, loaded]);
  function update(patch: Partial<Settings>) {
    if (Object.keys(patch).some((k) => k !== 'precision')) conversionActivity.current = true;
    revision.current++;
    if (location.hash.startsWith('#settings='))
      history.replaceState(null, '', location.pathname + location.search);
    setReverseError('');
    setReverseDraft('');
    setProfileMessage('');
    setFeedback({ key: '', text: '' });
    setManual('');
    setMessage('');
    setS((previous) => ({ ...previous, ...patch }));
  }
  function favorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
    setFavorites(next);
    try {
      localStorage.setItem(FAVORITES, JSON.stringify(next));
    } catch {
      setMessage('Favorites work for this visit; browser storage is unavailable.');
    }
  }
  function choose(side: 'from' | 'to', id: string) {
    update(
      side === 'from'
        ? { from: id, yawFrom: String(game(id)!.yaw), customFrom: id === 'custom' }
        : { to: id, yawTo: String(game(id)!.yaw), customTo: id === 'custom' },
    );
  }
  function mode(mode: InputMode) {
    if (!r) {
      update({ mode });
      return;
    }
    update({
      mode,
      input: String(
        mode === 'sens' ? r.sourceSens : mode === 'cm' ? r.sourceCm : r.sourceCm / 2.54,
      ),
    });
  }
  function dpi(value: string) {
    if (lock && r && s.mode === 'sens' && decimal(value) > 0)
      update({ dpiFrom: value, input: String((r.sourceSens * r.dpiFrom) / decimal(value)) });
    else update({ dpiFrom: value });
  }
  function distance(cm: number) {
    if (!r) return;
    update({
      input: String(
        s.mode === 'cm' ? cm : s.mode === 'in' ? cm / 2.54 : 914.4 / (cm * r.yawFrom * r.dpiFrom),
      ),
    });
  }
  function swap() {
    if (!r) return;
    update({
      from: s.to,
      to: s.from,
      dpiFrom: s.dpiTo,
      dpiTo: s.dpiFrom,
      yawFrom: s.yawTo,
      yawTo: s.yawFrom,
      customFrom: s.customTo,
      customTo: s.customFrom,
      fovFrom: s.fovTo,
      fovTo: s.fovFrom,
      mode: 'sens',
      input: String(r.targetSens),
    });
  }
  function reverse(value: string) {
    if (!value.trim()) {
      setReverseError('');
      return true;
    }
    if (!r || !Number.isFinite(decimal(value)) || decimal(value) <= 0) {
      featureEvent('reverse_conversion', 'error', { error_code: 'invalid_input' });
      setReverseError('Enter a positive finite target sensitivity.');
      return false;
    }
    const sens = (decimal(value) * r.yawTo * r.dpiTo) / (r.yawFrom * r.dpiFrom * r.factor);
    const cm = 914.4 / (sens * r.yawFrom * r.dpiFrom);
    const patch = { input: String(s.mode === 'sens' ? sens : s.mode === 'cm' ? cm : cm / 2.54) };
    if (!calculate({ ...s, ...patch }).ok) {
      featureEvent('reverse_conversion', 'error', { error_code: 'numeric_range' });
      setReverseError('This target exceeds the calculation range. Use a less extreme value.');
      return false;
    }
    update(patch);
    featureEvent('reverse_conversion', 'success', { result_count: 1 });
    return true;
  }
  async function copy(key: string, text: string) {
    const version = ++revision.current;
    setMessage('');
    setManual('');
    setFeedback({ key, text: 'Copying…' });
    try {
      const copied = await clipboardQueue.current.write(
        text,
        clipboardWriter || ((value) => navigator.clipboard.writeText(value)),
        () => revision.current === version,
      );
      if (copied) {
        setFeedback({ key, text: 'Copied ✓' });
        featureEvent(key === 'share' ? 'share_settings' : 'copy_result', 'success');
      }
    } catch {
      if (revision.current === version) {
        featureEvent(key === 'share' ? 'share_settings' : 'copy_result', 'error', {
          error_code: 'clipboard_unavailable',
        });
        setFeedback({ key, text: 'Select and copy below' });
        setManual(text);
      }
    }
  }
  function copyButton(key: string, text: string, label: string, style = 'quiet') {
    return (
      <button
        data-analytics-id={
          key.startsWith('table-')
            ? 'copy_comparison'
            : key === 'exact'
              ? 'copy_exact'
              : `copy_${key.replaceAll('-', '_')}`
        }
        className={style}
        disabled={!r}
        onClick={() => copy(key, text)}
        aria-label={label}
      >
        {feedback.key === key ? feedback.text : 'Copy'}
        {feedback.key !== key && <span aria-hidden="true"> ↗</span>}
      </button>
    );
  }
  function profileStatus(text: string) {
    setProfileMessage(text);
    setMessage('');
  }
  function save() {
    if (!r) return;
    const name = profileName.trim();
    if (!name) {
      featureEvent('profile_save', 'error', { error_code: 'empty_name' });
      profileStatus('Give your profile a name before saving.');
      return;
    }
    if (profiles.length >= 20) {
      featureEvent('profile_save', 'error', { error_code: 'profile_limit' });
      profileStatus('You can save up to 20 profiles. Remove one before adding another.');
      return;
    }
    const saved = persistProfiles(
      [...profiles, { id: crypto.randomUUID(), name, settings: { ...s } }],
      `Saved “${name}” in this browser.`,
    );
    setProfileName('');
    featureEvent(
      'profile_save',
      saved ? 'success' : 'error',
      saved ? { result_count: 1 } : { error_code: 'storage_unavailable' },
    );
  }

  function persistProfiles(next: Profile[], success: string, remember = true) {
    if (remember) setUndoProfiles(profiles);
    setProfiles(next);
    const saved = storeProfiles(next, profileStorage || (() => localStorage));
    profileStatus(profilePersistenceMessage(saved, success));
    return saved;
  }
  function remove(id: string) {
    persistProfiles(
      profiles.filter((p) => p.id !== id),
      'Profile deleted. Use Undo profile change to restore it.',
    );
  }
  function rename(id: string) {
    if (!editName.trim()) {
      profileStatus('A profile name cannot be empty.');
      return;
    }
    persistProfiles(
      profiles.map((p) => (p.id === id ? { ...p, name: editName.trim() } : p)),
      'Profile renamed.',
    );
    setEditing('');
  }
  function importProfileText(text: string) {
    const imported = parseBackup(text);
    if (!imported) {
      featureEvent('profile_import', 'error', { error_code: 'invalid_backup' });
      profileStatus('Invalid backup: use a Turnmatch version 1 JSON file with valid profiles.');
      return;
    }
    if (profiles.length + imported.length > 20) {
      featureEvent('profile_import', 'error', { error_code: 'profile_limit' });
      profileStatus('Import would exceed 20 profiles. Delete some profiles first.');
      return;
    }
    const saved = persistProfiles(
      [...profiles, ...imported.map((p) => ({ ...p, id: crypto.randomUUID() }))],
      `Imported ${imported.length} profiles. Existing profiles kept.`,
    );
    setBackupText('');
    featureEvent(
      'profile_import',
      saved ? 'success' : 'error',
      saved ? { result_count: imported.length } : { error_code: 'storage_unavailable' },
    );
  }
  async function importProfiles(file: File) {
    if (file.size > 50000) {
      featureEvent('profile_import', 'error', { error_code: 'file_too_large' });
      profileStatus('Profile backup must be no larger than 50 KB.');
      return;
    }
    try {
      importProfileText(await file.text());
    } catch {
      featureEvent('profile_import', 'error', { error_code: 'file_unreadable' });
      profileStatus('The backup file could not be read.');
    }
  }
  function reset() {
    setDraftEpoch((x) => x + 1);
    update({ ...DEFAULTS });
    setLock(false);
    history.replaceState(null, '', location.pathname);
    setMessage('Example settings restored.');
  }
  function clear() {
    setConfirmClear(false);
    let cleared = true;
    for (const key of [STORAGE, PROFILES, FAVORITES])
      try {
        localStorage.removeItem(key);
      } catch {
        cleared = false;
      }
    setProfiles([]);
    setFavorites([]);
    setUndoProfiles(null);
    setEditing('');
    setBackupText('');
    setEditName('');
    reset();
    profileStatus(
      cleared
        ? 'Saved profiles and favorites cleared. The default example remains.'
        : 'Cleared for this visit only. Browser storage could not be cleared; use your browser site-data settings.',
    );
  }
  const rendered = GAMES.filter(
    (g) =>
      g.id !== 'custom' &&
      (g.name + ' ' + g.aliases).toLowerCase().includes(tableQuery.toLowerCase()),
  );
  const comparisonValid =
    !!r &&
    GAMES.filter((g) => g.id !== 'custom').every((g) => {
      const n = (r.sourceSens * r.yawFrom * r.dpiFrom) / (g.yaw * r.dpiTo);
      return Number.isFinite(n) && n > 0;
    });
  const fmt = (n: number, p = s.precision) => format(n, p);
  const inputLabel =
    s.mode === 'sens'
      ? 'In-game sensitivity'
      : s.mode === 'cm'
        ? 'Centimeters per 360°'
        : 'Inches per 360°';
  function field(
    key: keyof Settings,
    label: string,
    value: string,
    onChange: (value: string) => void,
    hint?: string,
  ) {
    return (
      <label className="numeric-field">
        <span className="field-label">{label}</span>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `error-${key}` : hint ? `hint-${key}` : undefined}
        />
        {hint && <small id={`hint-${key}`}>{hint}</small>}
        {errors[key] && (
          <span className="field-error" id={`error-${key}`}>
            {errors[key]}
          </span>
        )}
      </label>
    );
  }

  return (
    <>
      <section className="converter" id="converter" aria-label="Mouse sensitivity converter">
        <div className="tool-toolbar">
          <div className="segmented" aria-label="Source input format">
            {(
              [
                ['sens', 'Game sensitivity'],
                ['cm', 'cm/360'],
                ['in', 'in/360'],
              ] as const
            ).map(([m, label]) => (
              <button
                data-analytics-id={`input_mode_${m}`}
                key={m}
                aria-pressed={s.mode === m}
                onClick={() => mode(m)}
              >
                {label}
              </button>
            ))}
          </div>
          <button data-analytics-id="reset_converter" className="text-button" onClick={reset}>
            ↺ Reset
          </button>
        </div>
        <div className="conversion-grid">
          <div className="source-column">
            <div className="step-caption">
              <span>01</span> YOUR CURRENT SETUP
              {s.from === 'cs2' &&
                s.to === 'valorant' &&
                s.input === '1' &&
                s.dpiFrom === '800' &&
                s.dpiTo === '800' &&
                s.mode === 'sens' &&
                s.match === 'rotation' &&
                !s.customFrom &&
                !s.customTo && <small className="example-tag">EXAMPLE</small>}
            </div>
            <GamePicker
              side="Source"
              value={s.from}
              onSelect={(id) => choose('from', id)}
              favorites={favorites}
              onFavorite={favorite}
            />
            <div className="two-fields">
              {field('input', inputLabel, s.input, (value) => update({ input: value }))}
              {field('dpiFrom', 'Source DPI', s.dpiFrom, dpi)}
            </div>
            <p className="profile-note">{from.note}</p>
          </div>
          <button
            data-analytics-id="swap_games"
            className="swap"
            aria-label="Swap games, sensitivities and DPI"
            disabled={!r}
            onClick={swap}
          >
            ⇄
          </button>
          <div className="target-column">
            <div className="step-caption">
              <span>02</span> YOUR NEXT GAME
            </div>
            <GamePicker
              side="Target"
              value={s.to}
              onSelect={(id) => choose('to', id)}
              favorites={favorites}
              onFavorite={favorite}
            />
            <div className="target-dpi">
              {field(
                'dpiTo',
                'Target DPI',
                s.dpiTo,
                (value) => update({ dpiTo: value }),
                'Keep this the same if your mouse DPI is unchanged.',
              )}
            </div>
          </div>
          <div
            id="conversion-result"
            tabIndex={-1}
            className={`result-panel ${!r ? 'invalid' : ''}`}
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="result-heading">
              <span>{to.name} sensitivity</span>
              <span className="result-indicator">{r ? '● LIVE RESULT' : 'CHECK INPUTS'}</span>
            </div>
            <div className="result-number">
              <output data-testid="main-result">{r ? fmt(r.targetSens) : '—'}</output>
              {copyButton(
                'result',
                r ? fmt(r.targetSens) : '',
                'Copy target sensitivity',
                'result-copy',
              )}
            </div>
            <div className="result-bottom">
              <span>
                {r
                  ? s.match === 'rotation'
                    ? 'Same physical turn distance'
                    : 'Horizontal screen-distance match'
                  : 'Fix the highlighted fields to calculate.'}
              </span>
              <label>
                Decimals{' '}
                <select
                  aria-label="Result decimal places"
                  value={s.precision}
                  onChange={(e) => update({ precision: Number(e.target.value) })}
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        <p className="target-setting-note">
          <strong>Apply to {to.short} hipfire.</strong> {to.note} See the instructions below for the
          field and rounding.
        </p>
        <SettingGuide
          key={`${draftEpoch}-${s.to}-${s.customTo}-${s.yawTo}`}
          id={s.to}
          exact={r?.targetSens ?? null}
          cm={r?.targetCm ?? null}
          precision={s.precision}
          override={s.customTo}
        />
        <ScopedAssistant
          key={`${draftEpoch}-${s.to}-${r?.targetSens}-${r?.yawTo}-${r?.dpiTo}-${s.fovTo}`}
          targetCm={r?.targetCm ?? null}
        />
        {!outcome.ok && (
          <div className="error-summary" role="alert">
            <strong>Let’s fix your setup.</strong> {Object.values(errors).join(' ')}
          </div>
        )}
        <div className="metric-grid">
          {[
            { name: 'Target cm / 360°', value: r ? r.targetCm : 0, key: 'cm', unit: 'cm' },
            { name: 'Target in / 360°', value: r ? r.targetCm / 2.54 : 0, key: 'in', unit: 'in' },
            { name: 'Target eDPI', value: r ? r.targetEdpi : 0, key: 'edpi', unit: 'DPI × sens' },
          ].map((m) => (
            <div className="metric" key={m.key}>
              <span>{m.name}</span>
              <div>
                <strong>{r ? fmt(m.value, 3) : '—'}</strong>
                <small>{m.unit}</small>
                {copyButton(m.key, r ? fmt(m.value, 3) : '', `Copy ${m.name}`)}
              </div>
            </div>
          ))}
        </div>
        <div className="distance-control">
          <div>
            <div>
              <span className="field-label">Physical turn distance</span>
              <strong>
                {r ? `${fmt(r.sourceCm, 2)} cm` : '—'} <small>in your source game</small>
              </strong>
            </div>
            <button
              className={`lock ${lock ? 'selected' : ''}`}
              disabled={!r}
              aria-pressed={lock}
              onClick={() => setLock(!lock)}
            >
              {lock ? '▣ Locked' : '□ Lock'} while changing DPI
            </button>
          </div>
          <input
            aria-label="Adjust source turn distance in centimeters"
            type="range"
            min="5"
            max="100"
            step="0.1"
            value={r ? Math.max(5, Math.min(100, r.sourceCm)) : 50}
            disabled={!r}
            onChange={(e) => distance(Number(e.target.value))}
          />
          <div className="ruler-labels">
            <span>5 cm · faster turn</span>
            <span>100 cm · slower turn</span>
          </div>
          {r && (r.sourceCm < 5 || r.sourceCm > 100) && (
            <small>
              The numeric result is outside this slider’s 5–100 cm range. Your value has been
              preserved.
            </small>
          )}
        </div>
        <details className="advanced">
          <summary>
            <span>Advanced matching &amp; custom yaw</span>
            <span className="summary-note">FOV · coefficients · reverse input</span>
          </summary>
          <div className="advanced-body">
            <label className="select-field">
              <span className="field-label">Matching method</span>
              <select
                aria-label="Matching method"
                value={s.match}
                onChange={(e) => update({ match: e.target.value as Settings['match'] })}
              >
                <option value="rotation">360° distance — same physical turn</option>
                <option value="monitor">Horizontal monitor distance — visual match</option>
              </select>
            </label>
            {s.match === 'monitor' && (
              <>
                <p className="notice">
                  This preserves horizontal screen movement at one point, and changes cm/360. Enter
                  actual horizontal FOV, not a 4:3-based slider value. This is a geometric model,
                  not an automatic game-specific ADS setting.
                </p>
                <div className="three-fields">
                  {field('fovFrom', 'Source horizontal FOV (°)', s.fovFrom, (v) =>
                    update({ fovFrom: v }),
                  )}
                  {field('fovTo', 'Target horizontal FOV (°)', s.fovTo, (v) =>
                    update({ fovTo: v }),
                  )}
                  {field(
                    'matchPercent',
                    'Monitor distance (%)',
                    s.matchPercent,
                    (v) => update({ matchPercent: v }),
                    '0 = near crosshair; 100 = screen edge.',
                  )}
                </div>
              </>
            )}
            <MeasurementTools
              key={draftEpoch}
              applyFov={(side, value) =>
                update(
                  side === 'from'
                    ? { match: 'monitor', fovFrom: String(value) }
                    : { match: 'monitor', fovTo: String(value) },
                )
              }
              applyYaw={(side, value) =>
                update(
                  side === 'from'
                    ? { from: 'custom', customFrom: true, yawFrom: String(value) }
                    : { to: 'custom', customTo: true, yawTo: String(value) },
                )
              }
            />
            <div className="yaw-grid">
              {(['from', 'to'] as const).map((side) => {
                const isFrom = side === 'from',
                  g = isFrom ? from : to,
                  custom = isFrom ? s.customFrom : s.customTo,
                  yaw = isFrom ? s.yawFrom : s.yawTo;
                return (
                  <div key={side}>
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={custom || g.id === 'custom'}
                        disabled={g.id === 'custom'}
                        onChange={(e) =>
                          update(
                            isFrom
                              ? { customFrom: e.target.checked }
                              : { customTo: e.target.checked },
                          )
                        }
                      />
                      Override {isFrom ? 'source' : 'target'} yaw
                    </label>
                    {custom || g.id === 'custom' ? (
                      field(
                        isFrom ? 'yawFrom' : 'yawTo',
                        `${isFrom ? 'Source' : 'Target'} yaw (°/count at sens 1)`,
                        yaw,
                        (v) => update(isFrom ? { yawFrom: v } : { yawTo: v }),
                      )
                    ) : (
                      <p className="yaw-value">
                        {g.yaw.toPrecision(6)} <small>° / count</small>
                      </p>
                    )}
                    <a href={g.source} target="_blank" rel="noopener noreferrer">
                      Profile reference ↗
                    </a>
                  </div>
                );
              })}
            </div>
            <label className="numeric-field">
              <span className="field-label">
                Set a desired target sensitivity to reverse-calculate
              </span>
              <input
                type="text"
                inputMode="decimal"
                aria-label="Desired target sensitivity"
                placeholder="Enter a positive target sensitivity, then leave this field"
                key={`${s.from}-${s.to}-${s.mode}`}
                aria-invalid={!!reverseError}
                aria-describedby={reverseError ? 'reverse-error' : undefined}
                value={reverseDraft}
                onChange={(e) => {
                  setReverseDraft(e.target.value);
                  setReverseError('');
                }}
                onBlur={(e) => {
                  if (reverse(e.target.value)) setReverseDraft('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur();
                }}
                disabled={!r}
              />
              {reverseError && (
                <span id="reverse-error" className="field-error" role="alert">
                  {reverseError}
                </span>
              )}
            </label>
            <p className="micro">
              Profiles describe linear PC hipfire scales. FOV-dependent and nonlinear sliders
              require a measured custom yaw for the exact setup. eDPI compares values within the
              same game, not across games.
            </p>
          </div>
        </details>
        <details className="calculation">
          <summary>
            See your calculation <span className="summary-note">Full precision · every input</span>
          </summary>
          {r ? (
            <div className="calculation-body">
              <p>
                <strong>Source:</strong> {from.name}, sensitivity {String(r.sourceSens)},{' '}
                {r.dpiFrom} DPI, yaw {r.yawFrom}. <strong>Target:</strong> {to.name}, {r.dpiTo} DPI,
                yaw {r.yawTo}.
              </p>
              <div className="formula">
                Target sens = source sens × source yaw × source DPI ÷ (target yaw × target DPI) ×
                matching factor
              </div>
              <p className="substitution">
                {r.sourceSens} × {r.yawFrom} × {r.dpiFrom} ÷ ({r.yawTo} × {r.dpiTo}) × {r.factor} ={' '}
                <strong>{r.targetSens}</strong>
              </p>
              <p>
                Source cm/360 = 914.4 ÷ ({r.sourceSens} × {r.yawFrom} × {r.dpiFrom}) = {r.sourceCm}.
                Target cm/360 = {r.targetCm}. Inches = cm ÷ 2.54.
              </p>
              <p>
                Source eDPI: {r.sourceEdpi}. Target eDPI: {r.targetEdpi}. Source counts/360:{' '}
                {r.sourceCounts}. Target counts/360: {r.targetCounts}. Display rounding never
                changes the calculation.
              </p>
              {copyButton('exact', String(r.targetSens), 'Copy full precision target sensitivity')}
            </div>
          ) : (
            <p className="calculation-body">Enter valid values to see the actual calculation.</p>
          )}
        </details>
        <div className="practice-launch">
          <div>
            <strong>Test your setup</strong>
            <p>Try a 60-second FPS practice check, compare rounds, and refine your setup.</p>
          </div>
          <button
            type="button"
            className="action-primary"
            data-analytics-id="open_aim_test"
            disabled={!r}
            onClick={() => setPractice(true)}
          >
            ◎ Test this setup
          </button>
        </div>
        {practice && r && (
          <AimTrainer
            settings={s}
            result={r}
            previous={practiceScores}
            onUpdateScore={(updated) =>
              setPracticeScores((items) =>
                items.map((item) => (item.id === updated.id ? updated : item)),
              )
            }
            onApply={(scale) => reverse(String(r.targetSens * scale))}
            onComplete={(score) => setPracticeScores((items) => [...items, score].slice(-12))}
            onClose={() => {
              setPractice(false);
              requestAnimationFrame(() =>
                document
                  .querySelector<HTMLButtonElement>('[data-analytics-id="open_aim_test"]')
                  ?.focus({ preventScroll: true }),
              );
            }}
          />
        )}
        <div className="tool-actions">
          <button
            data-analytics-id="share_settings"
            className="action-primary"
            disabled={!r}
            onClick={() =>
              copy('share', `${location.origin}${location.pathname}#settings=${encodeSettings(s)}`)
            }
          >
            {feedback.key === 'share' ? feedback.text : '↗ Share settings'}
          </button>
          <ExportForm kind="report" payload={encodeSettings(s)} disabled={!r}>
            ↓ Download report
          </ExportForm>
          <button data-analytics-id="print_report" disabled={!r} onClick={() => window.print()}>
            Print report
          </button>
          <a href="#saved-profiles">Save a profile ↓</a>
        </div>
        <div className="converter-feedback">
          <div>
            <strong>Help improve this converter</strong>
            <p>Report a problem or suggest an improvement.</p>
          </div>
          <button
            type="button"
            data-analytics-id="open_feedback"
            data-feedback-open
            aria-haspopup="dialog"
            className="feedback-open-button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
              <path d="M8 10h8M8 14h5" />
            </svg>
            Give feedback<span aria-hidden="true">↗</span>
          </button>
        </div>
        <p className="local-note">
          Settings are saved in this browser. Share links include your setup. File exports send the
          selected values to this site to generate a download.{' '}
          <a href="/privacy">How your data is handled</a>
        </p>
        {(message || feedback.text) && (
          <p className="status" role="status">
            {message ||
              `${feedback.key === 'result' ? 'Target sensitivity' : feedback.key}: ${feedback.text}`}
          </p>
        )}
        {manual && (
          <label className="manual-copy">
            Copy manually
            <textarea readOnly value={manual} onFocus={(e) => e.target.select()} />
          </label>
        )}
        <div className="print-report">
          <h2>Turnmatch sensitivity report</h2>
          {r ? (
            <pre>{report(s, r)}</pre>
          ) : (
            <p>No valid result. Correct the inputs before printing.</p>
          )}
        </div>
      </section>
      <div className="mobile-result" aria-label="Quick sensitivity converter result">
        <button
          onClick={() => {
            const result = document.getElementById('conversion-result');
            result?.scrollIntoView({ block: 'center' });
            result?.focus({ preventScroll: true });
          }}
        >
          <span>{to.short} sensitivity</span>
          <strong>{r ? fmt(r.targetSens) : 'Check inputs'}</strong>
        </button>
        {copyButton(
          'mobile-result',
          r ? fmt(r.targetSens) : '',
          'Copy mobile target sensitivity',
          'result-copy',
        )}
      </div>
      <div className="quick-pairs">
        <span>POPULAR PAIRS</span>
        {[
          ['cs2', 'valorant', 'CS2 → VALORANT'],
          ['valorant', 'cs2', 'VALORANT → CS2'],
          ['apex', 'overwatch', 'Apex → Overwatch'],
          ['fortnite', 'valorant', 'Fortnite → VALORANT'],
        ].map(([a, b, label]) => (
          <button
            data-analytics-id={`quick_pair_${a}_${b}`}
            key={label}
            onClick={() => {
              update({
                ...DEFAULTS,
                from: a,
                to: b,
                input: a === 'valorant' ? '0.35' : a === 'fortnite' ? '4' : '1',
                yawFrom: String(game(a)!.yaw),
                yawTo: String(game(b)!.yaw),
              });
              setLock(false);
              document
                .getElementById('converter')
                ?.scrollIntoView({ block: 'start', behavior: 'instant' });
            }}
          >
            {label} ↗
          </button>
        ))}
      </div>
      <section className="utility-grid" aria-label="Compare and save settings">
        <div className="comparison" id="compare">
          <div className="section-kicker">ONE SETUP, EVERY GAME</div>
          <h2>Compare your game sensitivities</h2>
          <p>Reference hipfire values at your target DPI. This table always uses 360° matching.</p>
          <input
            type="search"
            aria-label="Filter comparison games"
            placeholder="Find a game…"
            value={tableQuery}
            onChange={(e) => setTableQuery(e.target.value)}
          />
          <ExportForm kind="csv" payload={encodeSettings(s)} disabled={!comparisonValid}>
            Download comparison CSV
          </ExportForm>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Sensitivity</th>
                  <th>
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rendered.map((g) => {
                  const value = r ? (r.sourceSens * r.yawFrom * r.dpiFrom) / (g.yaw * r.dpiTo) : 0;
                  return (
                    <tr key={g.id}>
                      <td>{g.name}</td>
                      <td className="mono">{r ? fmt(value) : '—'}</td>
                      <td>
                        {Number.isFinite(value) && value > 0 ? (
                          copyButton(
                            `table-${g.id}`,
                            r ? fmt(value) : '',
                            `Copy ${g.name} comparison sensitivity`,
                          )
                        ) : (
                          <button disabled className="quiet">
                            Out of range
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!rendered.length && <p role="status">No matching game in this reference set.</p>}
          </div>
        </div>
        <div className="saved" id="saved-profiles">
          <div className="section-kicker">YOUR SETTINGS, CLOSE AT HAND</div>
          <h2>Keep a setup for later</h2>
          <p>Save up to 20 profiles on this device. No account or cloud sync.</p>
          <label className="numeric-field">
            <span className="field-label">Profile name</span>
            <input
              value={profileName}
              maxLength={60}
              placeholder="e.g. My 800 DPI setup"
              onChange={(e) => setProfileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') save();
              }}
            />
          </label>
          <button
            data-analytics-id="save_profile"
            className="action-primary"
            onClick={save}
            disabled={!r}
          >
            <ProfileIcon kind="save" />
            Save current setup
          </button>
          <div className="profile-status" role="status">
            {profileMessage}
          </div>
          <div className="profile-list">
            {profiles.length ? (
              profiles.map((p) => (
                <div className="saved-profile" key={p.id}>
                  <button
                    data-analytics-id="restore_profile"
                    onClick={() => {
                      update(p.settings);
                      setLock(false);
                      setMessage(`Restored “${p.name}”.`);
                      document.getElementById('converter')?.scrollIntoView({ block: 'start' });
                    }}
                  >
                    <strong>{p.name}</strong>
                    <small>
                      {game(p.settings.from)?.short} → {game(p.settings.to)?.short}
                    </small>
                  </button>
                  <div className="profile-edit-actions">
                    <button
                      className="quiet"
                      onClick={() => {
                        setEditing(p.id);
                        setEditName(p.name);
                      }}
                      aria-label={`Rename profile ${p.name}`}
                    >
                      Rename
                    </button>
                    <button
                      className="quiet"
                      disabled={!r}
                      onClick={() => {
                        persistProfiles(
                          profiles.map((x) => (x.id === p.id ? { ...x, settings: { ...s } } : x)),
                          `Updated “${p.name}” with the current setup.`,
                        );
                      }}
                      aria-label={`Update profile ${p.name}`}
                    >
                      Update
                    </button>
                    <button
                      className="quiet"
                      onClick={() => remove(p.id)}
                      aria-label={`Delete profile ${p.name}`}
                    >
                      ×
                    </button>
                    {editing === p.id && (
                      <div className="profile-rename">
                        <input
                          aria-label="New profile name"
                          value={editName}
                          maxLength={60}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <button onClick={() => rename(p.id)}>Save name</button>
                        <button onClick={() => setEditing('')}>Cancel rename</button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty">Your saved setups will appear here.</p>
            )}
          </div>
          <div className="profile-backup">
            <ExportForm
              kind="profiles"
              payload={JSON.stringify({ version: 1, profiles })}
              disabled={!profiles.length}
            >
              <ProfileIcon kind="export" />
              Back up profiles
            </ExportForm>
            <ImportBackup onImport={(file) => void importProfiles(file)} />
            {undoProfiles && (
              <button
                onClick={() => {
                  persistProfiles(undoProfiles, 'Previous profile list restored.', false);
                  setUndoProfiles(null);
                  setEditing('');
                }}
              >
                Undo profile change
              </button>
            )}
          </div>
          <p className="backup-format">JSON files · up to 50 KB</p>
          <details className="paste-backup">
            <summary>Restore from pasted backup</summary>
            <label>
              Profile backup JSON
              <textarea
                aria-label="Profile backup JSON"
                maxLength={50000}
                value={backupText}
                onChange={(e) => setBackupText(e.target.value)}
                placeholder="Paste the complete contents of your Turnmatch JSON backup"
              />
            </label>
            <button
              data-analytics-id="import_pasted_backup"
              onClick={() => importProfileText(backupText)}
            >
              Import pasted backup
            </button>
          </details>
          <button
            data-analytics-id="clear_profiles"
            className="text-button clear"
            onClick={() => setConfirmClear(true)}
          >
            Clear saved profiles &amp; favorites
          </button>
          {confirmClear && (
            <div
              id="clear-profile-confirmation"
              className="clear-confirmation"
              role="group"
              aria-label="Confirm clearing saved data"
            >
              <p>
                Clear all saved profiles and favorites on this device? Download a backup first if
                you want to keep them.
              </p>
              <button type="button" onClick={clear}>
                Yes, clear saved data
              </button>
              <button type="button" onClick={() => setConfirmClear(false)}>
                Cancel clearing
              </button>
            </div>
          )}

          <div className="source-note">
            <strong>Know what you’re matching.</strong>
            <p>
              These are documented reference scales, not direct measurements of your game. Use the
              source links, check your settings, and verify a full turn on your mousepad.
            </p>
            <a href="#formula">Understand the formula ↗</a>
          </div>
        </div>
      </section>
    </>
  );
}
