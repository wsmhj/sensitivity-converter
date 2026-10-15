'use client';
import { useEffect, useRef, useState } from 'react';
import { format, type Result, type Settings, game } from '@/lib/conversion';
import { decimal } from '@/lib/numeric';
import { moveView } from '@/lib/aim';
import {
  createRun,
  duration,
  modeName,
  MODES,
  SCENARIOS,
  tickRun,
  shootRun,
  totalHits,
  type RangeMode,
} from '@/lib/range';
import { renderRange } from '@/lib/range-renderer';
import { featureEvent, aimEvent } from '@/lib/analytics';
import RangeReport from './range-report';
import { TURN_OBSERVATIONS, type Score } from '@/lib/range-report';
import { rangePixelRatio } from '@/lib/range-performance';
import { RangeDiagnostics, type TimingSummary } from '@/lib/range-diagnostics';
import { RangeHud, updateRangeHud } from './range-hud';

type Phase = 'ready' | 'countdown' | 'playing' | 'paused' | 'finished';
export default function AimTrainer({
  settings,
  result,
  onClose,
  previous,
  onComplete,
  onApply,
  onUpdateScore,
}: {
  settings: Settings;
  result: Result;
  onClose: () => void;
  previous: Score[];
  onComplete: (score: Score) => void;
  onApply: (scale: number) => boolean;
  onUpdateScore: (score: Score) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    hudDisplay = useRef<HTMLDivElement>(null);
  const [fov, setFov] = useState(settings.fovTo),
    [scale, setScale] = useState('1'),
    [error, setError] = useState(''),
    [phase, setPhase] = useState<Phase>('ready');
  const [mode, setMode] = useState<RangeMode>('quick'),
    [crosshair, setCrosshair] = useState('#ffffff');
  const [score, setScore] = useState<Score | null>(null),
    [raw, setRaw] = useState(false);
  const diagnostics = useRef<RangeDiagnostics | null>(null);
  const [timing, setTiming] = useState<TimingSummary | null>(null);
  function showTiming() {
    if (diagnostics.current) setTiming(diagnostics.current.snapshot());
  }
  const state = useRef({
    phase: 'ready' as Phase,
    yaw: 0,
    pitch: 0,
    hits: 0,
    shots: 0,
    countdown: 3,
    scale: 1,
    fov: 103,
    run: createRun('quick'),
    crosshair: '#ffffff',
    raw: false,
  });
  const complete = useRef(onComplete);
  useEffect(() => {
    complete.current = onComplete;
  }, [onComplete]);
  const name = game(settings.to)?.name || 'Custom game';
  const validFov = Number.isFinite(decimal(fov)) && decimal(fov) >= 30 && decimal(fov) <= 150;
  const validScale = [0.9, 0.95, 1, 1.05, 1.1].includes(decimal(scale));
  function pause() {
    const s = state.current;
    if (s.phase === 'playing' || s.phase === 'countdown') {
      aimEvent('paused', s.run.mode);
      s.phase = 'paused';
      setPhase('paused');
      showTiming();
    }
    if (document.pointerLockElement === canvas.current) document.exitPointerLock();
  }
  function close() {
    const s = state.current;
    if (['playing', 'countdown', 'paused'].includes(s.phase)) aimEvent('abandoned', s.run.mode);
    aimEvent('closed', s.run.mode);
    pause();
    onClose();
  }
  async function start() {
    if (!validFov || !validScale) {
      setError('Use a horizontal FOV from 30° to 150° and one of the available trial multipliers.');
      return;
    }
    if (!canvas.current?.requestPointerLock) {
      setError(
        'This browser cannot capture a desktop mouse. Try Chrome, Edge or Firefox on a computer.',
      );
      return;
    }
    setError('');
    const s = state.current;
    s.fov = decimal(fov);
    s.scale = decimal(scale);
    s.crosshair = crosshair;
    s.raw = raw;
    if (s.phase === 'ready') {
      s.run = createRun(mode);
      if (diagnostics.current) diagnostics.current = new RangeDiagnostics();
      setTiming(null);
    }
    try {
      await canvas.current.requestPointerLock(raw ? { unadjustedMovement: true } : undefined);
    } catch (cause) {
      setError(
        cause instanceof DOMException && cause.name === 'WrongDocumentError'
          ? 'This browser window cannot capture the mouse. Open this site in a regular desktop browser window and retry.'
          : 'Mouse capture was blocked. Keep this tab active and click Start again. If raw input is enabled, turn it off and retry.',
      );
      featureEvent('aim_test', 'error', { error_code: 'pointer_lock_unavailable' });
    }
  }
  function restart(nextMode: RangeMode = mode) {
    pause();
    Object.assign(state.current, {
      phase: 'ready',
      yaw: 0,
      pitch: 0,
      countdown: 3,
      run: createRun(nextMode),
    });
    setPhase('ready');
    setScore(null);
    setTiming(null);
    if (diagnostics.current) diagnostics.current = new RangeDiagnostics();
    updateRangeHud(hudDisplay.current, state.current.run);
    setError('');
  }
  function changeMode(value: RangeMode) {
    setMode(value);
    restart(value);
  }
  useEffect(() => {
    const d = dialog.current!,
      c = canvas.current!;
    d.showModal();
    diagnostics.current =
      new URLSearchParams(location.search).get('range-diagnostics') === '1'
        ? new RangeDiagnostics()
        : null;
    const ctx = c.getContext('2d', { alpha: false });
    if (!ctx) {
      setError('Your browser could not create the training canvas.');
      return;
    }
    let frame = 0,
      last = performance.now(),
      lastHud = 0;
    updateRangeHud(hudDisplay.current, state.current.run);
    const initial = c.getBoundingClientRect();
    let width = initial.width,
      height = initial.height,
      dpr = rangePixelRatio(width, height, devicePixelRatio),
      sizeDirty = true;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) {
        width = rect.width;
        height = rect.height;
        sizeDirty = true;
      }
    });
    observer.observe(c);
    const screenChanged = () => {
      sizeDirty = true;
    };
    window.addEventListener('resize', screenChanged);
    let lastScene = '';
    const lock = () => {
      const s = state.current;
      if (document.pointerLockElement === c) {
        aimEvent(s.phase === 'paused' ? 'resumed' : 'started', s.run.mode);
        s.phase = 'countdown';
        s.countdown = 3;
        setPhase('countdown');
        last = performance.now();
      } else if (s.phase === 'playing' || s.phase === 'countdown') {
        aimEvent('paused', s.run.mode);
        s.phase = 'paused';
        setPhase('paused');
        showTiming();
      }
    };
    const lockError = () =>
      setError(
        (previous) =>
          previous || 'Mouse capture was blocked. Keep this tab active and click Start again.',
      );
    const move = (e: MouseEvent) => {
      const s = state.current;
      if (document.pointerLockElement === c && (s.phase === 'playing' || s.phase === 'countdown'))
        Object.assign(
          s,
          moveView(
            s.yaw,
            s.pitch,
            e.movementX,
            e.movementY,
            result.targetSens * result.yawTo * s.scale,
          ),
        );
    };
    const shoot = (e: MouseEvent) => {
      const s = state.current;
      if (e.button !== 0 || document.pointerLockElement !== c || s.phase !== 'playing') return;
      e.preventDefault();
      const started = diagnostics.current ? performance.now() : 0;
      shootRun(s.run, s.yaw, s.pitch);
      if (diagnostics.current) diagnostics.current.shot(performance.now() - started);
    };
    const blurred = () => {
      const s = state.current;
      if (s.phase === 'playing' || s.phase === 'countdown') {
        aimEvent('paused', s.run.mode);
        s.phase = 'paused';
        setPhase('paused');
        showTiming();
      }
      if (document.pointerLockElement === c) document.exitPointerLock();
    };
    const hidden = () => {
      if (document.hidden) blurred();
    };
    function draw(now: number) {
      const s = state.current,
        frameInterval = Math.max(0, now - last),
        dt = Math.min(0.1, frameInterval / 1000);
      last = now;
      const measured = diagnostics.current && s.phase === 'playing' ? performance.now() : null;
      let activeDt = s.phase === 'playing' ? dt : 0;
      if (s.phase === 'countdown') {
        const before = s.countdown;
        s.countdown -= dt;
        if (s.countdown <= 0) {
          s.phase = 'playing';
          setPhase('playing');
          activeDt = Math.max(0, dt - before);
        }
      }
      if (s.phase === 'playing') {
        if (tickRun(s.run, activeDt, s.yaw, s.pitch)) {
          s.yaw = 0;
          s.pitch = 0;
        }
        if (s.run.elapsed >= duration(s.run.mode) - 1e-8) {
          s.phase = 'finished';
          setPhase('finished');
          const rows = Object.values(s.run.stats),
            hits = totalHits(s.run),
            shots = rows.reduce((n, r) => n + r.shots, 0);
          const final: Score = {
            id: crypto.randomUUID(),
            setupKey: JSON.stringify({
              game: settings.to,
              sensitivity: result.targetSens * s.scale,
              yaw: result.yawTo,
              dpi: result.dpiTo,
              fov: s.fov,
              raw: s.raw,
              mode: s.run.mode,
              viewport: [Math.round(width), Math.round(height), dpr],
            }),
            hits,
            shots,
            mean: hits ? rows.reduce((n, r) => n + r.acquisitionMs, 0) / hits : 0,
            scale: s.scale,
            fov: s.fov,
            label:
              name +
              ' · ' +
              format(result.targetSens * s.scale, 8) +
              ' · ' +
              result.dpiTo +
              ' DPI · yaw ' +
              format(result.yawTo, 8),
            mode: s.run.mode,
            raw: s.raw,
            stats: structuredClone(s.run.stats),
          };
          setScore(final);
          complete.current(final);
          featureEvent('aim_test', 'success', { result_count: hits });
          document.exitPointerLock();
        }
      }
      const w = width,
        h = height;
      if (sizeDirty) {
        dpr = rangePixelRatio(w, h, devicePixelRatio);
        const pw = Math.max(1, Math.floor(w * dpr)),
          ph = Math.max(1, Math.floor(h * dpr));
        if (c.width !== pw || c.height !== ph) {
          c.width = pw;
          c.height = ph;
        }
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        sizeDirty = false;
        lastScene = '';
      }
      const sceneKey = `${s.phase}/${s.yaw}/${s.pitch}/${s.fov}/${s.run.mode}/${s.run.index}/${w}/${h}`;
      if (s.phase === 'playing' || s.phase === 'countdown' || sceneKey !== lastScene) {
        renderRange(ctx!, w, h, s.yaw, s.pitch, s.fov, s.run, s.crosshair);
        lastScene = sceneKey;
      }
      if (s.phase === 'countdown') {
        ctx!.fillStyle = '#fff';
        ctx!.font = 'bold 64px system-ui';
        ctx!.textAlign = 'center';
        ctx!.fillText(String(Math.max(1, Math.ceil(s.countdown))), w / 2, h / 2 - 50);
      }
      if (now - lastHud > 100 || s.phase === 'finished') {
        updateRangeHud(hudDisplay.current, s.run);
        lastHud = now;
      }
      if (measured !== null) {
        diagnostics.current?.frame(frameInterval, performance.now() - measured);
        if (s.phase === 'finished') showTiming();
      }
      frame = requestAnimationFrame(draw);
    }
    document.addEventListener('pointerlockchange', lock);
    document.addEventListener('pointerlockerror', lockError);
    document.addEventListener('mousemove', move);
    c.addEventListener('mousedown', shoot);
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener('blur', blurred);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', screenChanged);
      document.removeEventListener('pointerlockchange', lock);
      document.removeEventListener('pointerlockerror', lockError);
      document.removeEventListener('mousemove', move);
      c.removeEventListener('mousedown', shoot);
      document.removeEventListener('visibilitychange', hidden);
      window.removeEventListener('blur', blurred);
      if (document.pointerLockElement === c) document.exitPointerLock();
      d.close();
    };
  }, [name, result.targetSens, result.yawTo, result.dpiTo, settings.to]);
  const editable = phase === 'ready' || phase === 'finished';
  return (
    <dialog
      ref={dialog}
      className="aim-dialog"
      aria-labelledby="aim-title"
      onCancel={(e) => {
        e.preventDefault();
        if (['playing', 'countdown', 'paused'].includes(state.current.phase)) pause();
        else close();
      }}
    >
      <header className="aim-header">
        <div>
          <span className="section-kicker">TURNMATCH / PRACTICE RANGE</span>
          <h2 id="aim-title">Test your setup</h2>
        </div>
        <button
          type="button"
          data-analytics-id="close_aim_range"
          onClick={close}
          aria-label="Close practice range"
        >
          ✕
        </button>
      </header>
      <p className="aim-setup">
        <strong>{name}</strong> · Target sensitivity{' '}
        <b>{format(result.targetSens * decimal(scale), 8)}</b> · {result.dpiTo} DPI · Yaw{' '}
        {format(result.yawTo, 8)} · {format(result.targetCm / decimal(scale), 3)} cm/360
      </p>
      <div className="range-modes" role="group" aria-label="Practice scenario">
        {MODES.map((value) => (
          <button
            type="button"
            key={value}
            data-analytics-id={`aim_mode_${value}`}
            disabled={phase === 'playing' || phase === 'countdown' || phase === 'paused'}
            aria-pressed={mode === value}
            onClick={() => changeMode(value)}
          >
            {modeName(value)}
          </button>
        ))}
      </div>
      <p className="range-brief">
        {mode === 'quick'
          ? 'Four 15-second checks: precision, tracking, switching and turns. Each stage starts facing forward.'
          : SCENARIOS[mode].hint}{' '}
        {['cs2', 'csgo', 'valorant', 'r6'].includes(settings.to)
          ? 'Suggested focus: precision shots and target switching.'
          : ['apex', 'overwatch', 'cod'].includes(settings.to)
            ? 'Suggested focus: moving targets and target switching.'
            : 'Choose the skill you want to check.'}
      </p>
      <div className="aim-options">
        <label>
          Horizontal FOV (actual degrees)
          <input
            aria-label="Practice horizontal FOV"
            type="number"
            min="30"
            max="150"
            value={fov}
            disabled={!editable}
            onChange={(e) => setFov(e.target.value)}
          />
        </label>
        <label>
          Trial sensitivity multiplier
          <select
            aria-label="Trial sensitivity multiplier"
            value={scale}
            disabled={!editable}
            onChange={(e) => setScale(e.target.value)}
          >
            <option value="0.9">−10% · slower</option>
            <option value="0.95">−5% · slower</option>
            <option value="1">Current result</option>
            <option value="1.05">+5% · faster</option>
            <option value="1.1">+10% · faster</option>
          </select>
        </label>
        <p>
          Trials keep your converter settings unchanged. Set your mouse to {result.dpiTo} DPI. FOV
          comes from the converter’s target field; check it against your game.
        </p>
      </div>
      <label className="range-crosshair">
        Crosshair color
        <select
          aria-label="Practice crosshair color"
          value={crosshair}
          disabled={!editable}
          onChange={(e) => setCrosshair(e.target.value)}
        >
          <option value="#ffffff">White</option>
          <option value="#00e5ff">Cyan</option>
          <option value="#ff75cf">Pink</option>
        </select>
      </label>
      <label className="aim-raw">
        <input
          type="checkbox"
          checked={raw}
          disabled={!editable}
          onChange={(e) => setRaw(e.target.checked)}
        />{' '}
        Request raw mouse input (optional; turn off if capture is blocked)
      </label>
      <div className="aim-arena">
        <canvas
          ref={canvas}
          aria-label="3D mouse aiming practice. Move the mouse to aim and left-click to shoot. Escape pauses."
        />
        <RangeHud displayRef={hudDisplay} />
        {(phase === 'ready' || phase === 'paused' || phase === 'finished') && (
          <div className="aim-overlay">
            <strong>
              {phase === 'paused'
                ? 'Paused'
                : phase === 'finished'
                  ? 'Round complete'
                  : modeName(mode)}
            </strong>
            <p>
              {phase === 'ready'
                ? SCENARIOS[state.current.run.stage].hint + ' Escape pauses.'
                : phase === 'paused'
                  ? 'Your remaining time is preserved.'
                  : 'Compare your results below or try another multiplier.'}
            </p>
            {phase !== 'finished' && (
              <button
                type="button"
                data-analytics-id={phase === 'paused' ? 'resume_aim_test' : 'start_aim_test'}
                onClick={start}
              >
                {phase === 'paused'
                  ? 'Resume practice'
                  : 'Start ' + duration(mode) + '-second check'}
              </button>
            )}
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <div className="aim-actions">
        <button
          type="button"
          data-analytics-id="aim_fullscreen"
          onClick={async () => {
            try {
              await canvas.current?.parentElement?.requestFullscreen();
            } catch {
              setError('Fullscreen was blocked. You can continue in this window.');
            }
          }}
        >
          Fullscreen range
        </button>
        <button
          type="button"
          data-analytics-id="reset_aim_round"
          onClick={() => {
            aimEvent('reset', state.current.run.mode);
            restart();
          }}
        >
          Reset round
        </button>
        <button type="button" data-analytics-id="aim_back_to_converter" onClick={close}>
          Back to converter
        </button>
        <button
          type="button"
          data-analytics-id="aim_save_setup"
          onClick={() => {
            close();
            requestAnimationFrame(() => {
              document.getElementById('saved-profiles')?.scrollIntoView({ behavior: 'smooth' });
              document
                .querySelector<HTMLInputElement>('#saved-profiles input')
                ?.focus({ preventScroll: true });
            });
          }}
        >
          Name &amp; save current setup
        </button>
        {phase === 'finished' && score && score.scale !== 1 && (
          <button
            type="button"
            data-analytics-id="aim_apply_trial"
            onClick={() => {
              if (onApply(score.scale)) {
                aimEvent('trial_applied', score.mode);
                close();
              } else
                setError('This trial exceeds the converter range. Choose a smaller adjustment.');
            }}
          >
            Apply {score.scale}× trial to converter
          </button>
        )}
      </div>
      <p className="aim-note">
        Desktop mouse required. The sensitivity converter practice uses relative mouse movement and
        perspective projection. Enable raw input if your browser supports it. Browser, OS and
        hardware behavior can differ from your game. Confirm the physical turn in your game. No
        keyboard or touch substitute is used for sensitivity testing.
      </p>
      {timing && (
        <details className="range-diagnostics">
          <summary>Local frame timing</summary>
          <p>
            {timing.frames} active frames · intervals over 50 ms: {timing.framesOver50ms}
          </p>
          <p>
            Frame interval P95 / max: {timing.frameP95.toFixed(2)} / {timing.frameMax.toFixed(2)} ms
            <br />
            Callback P95 / max: {timing.drawP95.toFixed(2)} / {timing.drawMax.toFixed(2)} ms
            <br />
            {timing.shots} shots · maximum handler: {timing.shotMax.toFixed(2)} ms
          </p>
          <p>
            Intervals include browser scheduling. Callback time excludes GPU presentation. P95 uses
            the latest 4,096 active frames; counts and maxima cover the round. Data stays in this
            dialog and is cleared on reset. A 180 ms target respawn is intentional and is not itself
            a frozen frame.
          </p>
        </details>
      )}
      {score && (
        <RangeReport
          key={score.id}
          score={score}
          history={previous}
          onObservation={(observation) => {
            const updated = { ...score, observation };
            setScore(updated);
            onUpdateScore(updated);
          }}
          onPractice={(value) => {
            setFov(String(score.fov));
            setScale(String(score.scale));
            setRaw(score.raw);
            changeMode(value);
            requestAnimationFrame(() =>
              canvas.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
            );
          }}
        />
      )}
      {previous.length > 0 && (
        <section className="aim-results" aria-label="Practice results">
          <h3>Compare your rounds</h3>
          <p>
            Compare the same scenario, FOV, input mode and game settings. Target patterns repeat.
            Results last until page reload. Applying a trial changes your original conversion match;
            confirm it in game before saving.
          </p>
          <div className="aim-table">
            <table>
              <thead>
                <tr>
                  <th>Scenario / setup</th>
                  <th>Trial</th>
                  <th>FOV / input</th>
                  <th>Kills / accuracy</th>
                  <th>Tracking</th>
                  <th>Mean target time</th>
                  <th>Turn observation</th>
                </tr>
              </thead>
              <tbody>
                {previous.slice(-5).map((v, i) => (
                  <tr key={i}>
                    <td>
                      {modeName(v.mode)}
                      <br />
                      {v.label}
                    </td>
                    <td>{Math.round((v.scale - 1) * 100)}%</td>
                    <td>
                      {v.fov}° / {v.raw ? 'raw' : 'standard'}
                    </td>
                    <td>
                      {v.hits} / {v.shots ? Math.round((v.hits / v.shots) * 100) + '%' : '—'}
                    </td>
                    <td>
                      {v.stats.tracking.trackingTime
                        ? Math.round(
                            (v.stats.tracking.onTarget / v.stats.tracking.trackingTime) * 100,
                          ) + '%'
                        : '—'}
                    </td>
                    <td>{v.mean > 0 ? Math.round(v.mean) + ' ms' : '—'}</td>
                    <td>{v.observation ? TURN_OBSERVATIONS[v.observation] : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </dialog>
  );
}
export type { Score };
