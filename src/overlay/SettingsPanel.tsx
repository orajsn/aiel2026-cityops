import { useState } from 'react';
import { useUiStore } from '../engine/ui';
import { useCameraStore } from '../engine/camera';
import { useTrafficStore } from '../engine/traffic';
import { drawSize, fixedDpr, useGraphicsStore, type Resolution } from '../engine/graphics';
import { useRenderDpr } from '../Stage';
import { setTrafficMode } from './TrafficEditor';
import { usePresentationStore } from '../engine/presentation';
import { SKIES, THEMES } from '../world/theme';

const RESOLUTIONS: { id: Resolution; label: string }[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'fhd', label: 'FHD' },
  { id: '2k', label: '2K' },
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

      <div className="settings__label" id="settings-tools">
        Tools
      </div>
      {/* a mode takes the screen: the panel steps aside, and opening it again offers the way out */}
      <div className="settings__tools" role="group" aria-labelledby="settings-tools">
        <button
          type="button"
          className={`settings__tool${cameraEditing && !trafficEditing ? ' is-on' : ''}`}
          aria-label={cameraEditing && !trafficEditing ? 'Leave Camera mode' : 'Camera mode'}
          onClick={() => {
            if (trafficEditing) setTrafficMode(false);
            useCameraStore.getState().setEditing(!(cameraEditing && !trafficEditing));
            onClose();
          }}
        >
          {cameraEditing && !trafficEditing ? 'Leave Camera mode' : 'Camera mode'}
          <kbd>C</kbd>
        </button>
        <button
          type="button"
          className={`settings__tool${trafficEditing ? ' is-on' : ''}`}
          aria-label={trafficEditing ? 'Leave Traffic mode' : 'Traffic mode'}
          onClick={() => {
            setTrafficMode(!trafficEditing);
            onClose();
          }}
        >
          {trafficEditing ? 'Leave Traffic mode' : 'Traffic mode'}
        </button>
      </div>
    </div>
  );
}

/** Graphics: the resolution the 3D view draws at, a preset or a custom 16:9 size, and what it draws now */
function Graphics() {
  const resolution = useGraphicsStore((s) => s.resolution);
  const custom = useGraphicsStore((s) => s.custom);
  const autoDpr = useRenderDpr();
  const now = drawSize(fixedDpr(resolution, custom) ?? autoDpr);
  const [w, setW] = useState(String(custom.w));
  const [h, setH] = useState(String(custom.h));
  return (
    <>
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
        drawing {now.w} × {now.h}
      </div>
    </>
  );
}
