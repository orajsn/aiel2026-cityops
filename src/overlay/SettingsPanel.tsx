import { useUiStore } from '../engine/ui';
import { SKIES, THEMES } from '../world/theme';

/**
 * Settings, above the corner buttons: which sky the city sits under (owner, 25 Oct). Remembered on this device.
 */
export function SettingsPanel({ onClose }: { onClose(): void }) {
  const themeName = useUiStore((s) => s.themeName);
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
    </div>
  );
}
