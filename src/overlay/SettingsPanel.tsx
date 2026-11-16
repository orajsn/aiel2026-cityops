import { useEffect, useState } from 'react';
import { useUiStore } from '../engine/ui';
import { useCameraStore } from '../engine/camera';
import { useTrafficStore } from '../engine/traffic';
import { drawSize, fixedDpr, TEXT_MAX, TEXT_MIN, useGraphicsStore, type Resolution } from '../engine/graphics';
import { QUALITY, useQualityStore, type Quality } from '../engine/quality';
import { useRenderDpr } from '../Stage';
import { setTrafficMode } from './TrafficEditor';
import { usePresentationStore } from '../engine/presentation';
import { PERF_STEPS, usePerfStore, verdict } from '../engine/perfCheck';
import { SKIES, THEMES } from '../world/theme';
import { useFollowStore } from '../engine/follow';

const RESOLUTIONS: { id: Resolution; label: string }[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'fhd', label: 'FHD' },
  { id: '2k', label: 'QHD' },
  { id: '4k', label: '4K' },
  { id: 'custom', label: 'Custom' },
];

/**
 * Settings, above the corner buttons: which sky the city sits under (owner, 25 Oct), how many pixels the
 * 3D view draws, Presentation mode for a clicker, and the owner's tools, Camera mode and Traffic mode (owner, 27 Oct:
 * out of the corner bar, into here). Sky, resolution and Presentation mode are remembered on this device.
 */
export function SettingsPanel({ onClose }: { onClose(): void }) {
  const themeName = useUiStore((s) => s.themeName);
  const cameraEditing = useCameraStore((s) => s.editing);
  const trafficEditing = useTrafficStore((s) => s.editing);
  const presenting = usePresentationStore((s) => s.on);
  return (
    <div className="settings" role="dialog" aria-label="Settings">
      <div className="settings__head">
        <span>Settings</span>
        <button type="button" className="settings__close" aria-label="Close settings" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="settings__label" id="settings-sky">
        Sky
      </div>
      <div className="settings__skies" role="radiogroup" aria-labelledby="settings-sky">
        {SKIES.map((k) => (
          <button
            key={k.id}
            type="button"
            role="radio"
            aria-checked={themeName === k.id}
            aria-label={k.label}
            className={`settings__sky${themeName === k.id ? ' is-on' : ''}`}
            onClick={() => useUiStore.getState().setTheme(k.id)}
          >
            <i style={{ background: `linear-gradient(${THEMES[k.id].skyTop}, ${THEMES[k.id].skyHorizon} 60%, ${THEMES[k.id].ground})` }} />
            {k.label}
          </button>
        ))}
      </div>



      <TextSize />

      <Graphics />

      <button
        type="button"
        role="switch"
        aria-checked={presenting}
        aria-label="Presentation mode"
        className={`settings__switch${presenting ? ' is-on' : ''}`}
        onClick={() => usePresentationStore.getState().setOn(!presenting)}
      >
        <span className="settings__switch-text">
          <b>Presentation mode</b>
          <span>Clicker: Page Down / Page Up walk every page and every Jupyter cell · B blanks the screen</span>
        </span>
        <i aria-hidden />
      </button>

      <PhoneFollow />
      <div className="settings__label">Scripts</div>
      <a className="settings__tool" href={`${location.pathname}?mode=scripts`} target="_blank" rel="noreferrer">
        Script manager (edit, versions, comments) ↗
      </a>
    </div>
  );
}

/** Phone follow: the audience reads the page's script on their phones, with a 6-digit code (src/engine/follow.ts) */
function PhoneFollow() {
  const status = useFollowStore((s) => s.status);
  const code = useFollowStore((s) => s.code);
  const listeners = useFollowStore((s) => s.listeners);
  const { start, stop, showCard } = useFollowStore.getState();
  const on = status === 'on' || (status === 'error' && !!code);
  return (
    <>
      <div className="settings__label" id="settings-follow">
        Phone follow
      </div>
      <div className="settings__follow" role="group" aria-labelledby="settings-follow">
        {on ? (
          <>
            <div className="code" data-follow-settings-code>{`${code.slice(0, 3)} ${code.slice(3)}`}</div>
            <small>{status === 'error' ? 'Cannot reach the follow server. Retrying on the next page.' : listeners > 0 ? `${listeners} phone${listeners === 1 ? '' : 's'} watching` : 'Waiting for phones'}</small>
            <button type="button" className="settings__tool" onClick={() => showCard(true)}>
              Show code on screen
            </button>
            <button type="button" className="settings__tool" onClick={() => void stop()}>
              Stop sharing
            </button>
          </>
        ) : (
          <>
            <button type="button" className="settings__tool" disabled={status === 'starting'} onClick={() => void start()}>
              {status === 'starting' ? 'Starting…' : 'Start sharing'}
            </button>
            <small>{status === 'error' ? 'Could not start: the follow server is not reachable from here.' : 'Phones show the script of the page on screen, live. Ends by itself after 90 minutes without a page change.'}</small>
          </>
        )}
      </div>
    </>
  );
}

/** Graphics: the resolution the 3D view draws at, a preset or a custom 16:9 size, and what it draws now */
function Graphics() {
  const resolution = useGraphicsStore((s) => s.resolution);
  const custom = useGraphicsStore((s) => s.custom);
  const showFps = useGraphicsStore((s) => s.showFps);
  const autoDpr = useRenderDpr();
  const preset = useQualityStore(s => s.preset);
  const actual = useGraphicsStore(s => s.actualBuffer);
  const now = drawSize(fixedDpr(resolution, custom) ?? Math.min(autoDpr, QUALITY[preset].autoCap));
  const [w, setW] = useState(String(custom.w));
  const [h, setH] = useState(String(custom.h));
  return (
    <>
      <QualityChoices />
      <div className="settings__label" id="settings-res">
        Resolution · 16:9
      </div>
      <div className="settings__res" role="radiogroup" aria-labelledby="settings-res">
        {RESOLUTIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={resolution === r.id}
            aria-label={r.label}
            className={`settings__chip${resolution === r.id ? ' is-on' : ''}`}
            onClick={() => useGraphicsStore.getState().setResolution(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>
      {resolution === 'custom' && (
        <form
          className="settings__custom"
          onSubmit={(e) => {
            e.preventDefault();
            const cw = Math.round(Number(w));
            const ch = Math.round(Number(h));
            if (cw > 0 && ch > 0) useGraphicsStore.getState().setCustom({ w: cw, h: ch });
          }}
        >
          <label>
            <span>Width</span>
            <input type="number" inputMode="numeric" min={640} max={7680} value={w} onChange={(e) => setW(e.target.value)} aria-label="Width" />
          </label>
          <span className="settings__x">×</span>
          <label>
            <span>Height</span>
            <input type="number" inputMode="numeric" min={360} max={4320} value={h} onChange={(e) => setH(e.target.value)} aria-label="Height" />
          </label>
          <button type="submit" className="settings__chip">
            Apply
          </button>
        </form>
      )}
      <div className="settings__now mono">
        Requested {now.w} × {now.h}
        {actual && ` · Drawing ${actual.w} × ${actual.h} · ${actual.antialias ? 'Edge smoothing on' : 'Edge smoothing unavailable'}`}
      </div>
      <label className="settings__check">
        <input type="checkbox" checked={showFps} onChange={(e) => useGraphicsStore.getState().setShowFps(e.target.checked)} />
        Show frame rate
      </label>
      <PerformanceCheck />
    </>
  );
}

/** Settings › Graphics › Performance check: five measurements on this machine, then what they mean */
function PerformanceCheck() {
  const { status, step, results, info } = usePerfStore();
  return (
    <div className="settings__perf" data-testid="perf-check">
      {status === 'running' ? (
        <div className="settings__perf-run">
          Testing: {PERF_STEPS[step].label} ({step + 1}/{PERF_STEPS.length})…
        </div>
      ) : (
        <button type="button" className="settings__chip settings__perf-btn" onClick={() => usePerfStore.getState().start()}>
          {status === 'done' ? 'Run the performance check again' : 'Compare performance (about 35 s)'}
        </button>
      )}
      {status === 'done' && (
        <>
          <table className="settings__perf-table mono">
            <tbody>
              {results.map((r) => (
                <tr key={r.id} data-perf={r.id}>
                  <td>{r.label}</td>
                  <td>{r.fps} fps</td>
                  <td>slowest {r.slowMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
          {verdict(results).map((v) => (
            <div key={v} className="settings__perf-verdict">
              {v}
            </div>
          ))}
          {info && (
            <div className="settings__perf-info mono">
              {info.gpu} · {info.size} · {info.drawCalls} draw calls · {Math.round(info.triangles / 1000)}k triangles
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Text size: the page panels, the caption and the Jupyter drawer's code and notes, together: a slider, or type a number */
function TextSize() {
  const size = useGraphicsStore((s) => s.textSize);
  const pct = Math.round(size * 100);
  const [typed, setTyped] = useState(String(pct));
  // the box follows the slider (and a typed value once it is applied)
  useEffect(() => setTyped(String(pct)), [pct]);
  const apply = () => useGraphicsStore.getState().setTextSize(Number(typed) / 100);
  return (
    <>
      <div className="settings__label" id="settings-text">
        Text size
      </div>
      <div className="settings__text">
        <input
          type="range"
          min={TEXT_MIN * 100}
          max={TEXT_MAX * 100}
          step={5}
          value={pct}
          aria-labelledby="settings-text"
          onChange={(e) => useGraphicsStore.getState().setTextSize(Number(e.target.value) / 100)}
        />
        <label className="settings__pct">
          <input
            type="number"
            inputMode="numeric"
            min={TEXT_MIN * 100}
            max={TEXT_MAX * 100}
            value={typed}
            aria-label="Text size, percent"
            onChange={(e) => setTyped(e.target.value)}
            onBlur={apply}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
          />
          %
        </label>
      </div>
    </>
  );
}

/** Bridge: Harbor Bridge, or the Bhumibol Bridge model on preview (owner, 28 Oct) */
function BridgeChoice() {
  const bridge = useGraphicsStore((s) => s.bridge);
  const options = [
    { id: 'harbor' as const, label: 'Harbor Bridge' },
    { id: 'bhumibol' as const, label: 'Bhumibol (preview)' },
  ];
  return (
    <>
      <div className="settings__label" id="settings-bridge">
        Bridge
      </div>
      <div className="settings__bridge" role="radiogroup" aria-labelledby="settings-bridge">
        {options.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={bridge === o.id} aria-label={o.label} className={`settings__chip${bridge === o.id ? ' is-on' : ''}`} onClick={() => useGraphicsStore.getState().setBridge(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </>
  );
}

function QualityChoices() {
  const preset = useQualityStore(s => s.preset);
  const options: Quality[] = ['balanced', 'high'];
  return <div>
    <div className="settings__label" id="settings-quality">Visual quality</div>
    <div className="settings__res" role="radiogroup" aria-labelledby="settings-quality">
      {options.map(option => <button key={option} type="button" role="radio" aria-checked={preset === option} aria-label={QUALITY[option].label}
        className={`settings__chip${preset === option ? ' is-on' : ''}`} onClick={() => useQualityStore.getState().setPreset(option)}>{QUALITY[option].label}</button>)}
    </div>
    <p style={{ fontSize: 14, lineHeight: 1.4, margin: '9px 0 16px', color: 'var(--ink-dim)' }}>{preset === 'balanced'
      ? 'Balanced: softer lighting and detailed shadows. Auto keeps the drawing size at Full HD or below.'
      : 'High: sharper shadows and more detail in Auto, up to QHD. Uses more graphics power.'}</p>
  </div>;
}
