import { useEffect, useState } from 'react';
import { BRIDGE_CARS, LIMITS, type TrafficKind } from '../content/traffic';
import { persistTraffic, useTrafficStore } from '../engine/traffic';
import { useCameraStore } from '../engine/camera';
import { bridgeLanes } from '../world/bridgeFrame';

const NAME: Record<TrafficKind, string> = { boats: 'Boats', cars: 'Cars' };

/** open or close Traffic mode; it borrows Camera mode's walking and looking to move over the map */
export function setTrafficMode(on: boolean) {
  useTrafficStore.getState().setEditing(on);
  useCameraStore.getState().setEditing(on);
}

/**
 * Traffic mode bar (owner tool): draw boat and car routes on the map, set how many and how fast (a slowest and a
 * fastest speed, each vehicle gets its own in between) and the cars' size. Changes show at once; Save writes them
 * into the project (src/content/traffic.json).
 */
export function TrafficEditor() {
  const editing = useTrafficStore((s) => s.editing);
  const config = useTrafficStore((s) => s.config);
  const kind = useTrafficStore((s) => s.kind);
  const route = useTrafficStore((s) => s.route);
  const dirty = useTrafficStore((s) => s.dirty);
  const point = useTrafficStore((s) => s.point);
  const restored = useTrafficStore((s) => s.restored);
  const [note, setNote] = useState('');
  // Delete or Backspace deletes the picked point
  useEffect(() => {
    if (!editing) return;
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && useTrafficStore.getState().point) {
        e.preventDefault();
        useTrafficStore.getState().deletePoint();
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [editing]);
  if (!editing) return null;
  const st = useTrafficStore.getState();
  const fleet = config[kind];
  const lim = LIMITS[kind].count;
  // the sliders belong to the picked route; with none picked, to the next new route (and the river boats)
  const picked = route >= 0 && route < fleet.routes.length ? fleet.routes[route] : null;
  const target = picked ?? fleet;
  const unit = kind === 'cars' ? 'cars' : 'boats';
  const settingsFor = picked
    ? `Route ${route + 1}`
    : kind === 'boats' && !fleet.routes.length
      ? 'River boats'
      : 'New routes start with';

  const save = async () => {
    const where = await persistTraffic();
    setNote(where === 'project' ? 'Saved in the project' : 'Could not save: the server did not answer. Your routes are kept in this browser: press Save again in a moment');
  };

  return (
    <div className="cam-edit traffic-edit" role="toolbar" aria-label="Traffic mode">
      <div className="cam-edit__row">
        <span className="cam-edit__title mono">Traffic{dirty ? ' · not saved yet' : ''}</span>
        <div className="traffic-edit__tabs" role="tablist">
          {(['boats', 'cars'] as TrafficKind[]).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={kind === k} className={kind === k ? 'is-primary' : ''} onClick={() => st.setKind(k)}>
              {NAME[k]} · {config[k].routes.length} {config[k].routes.length === 1 ? 'route' : 'routes'}
            </button>
          ))}
        </div>
      </div>
      <div className="cam-edit__hint">
        Tap the map to add a point to the {kind === 'cars' ? 'car' : 'boat'} route · tap a point to pick it, drag it to move it · drag elsewhere to look · arrows / WASD move, Q E down / up · iPad: two fingers move
        {kind === 'boats' && !fleet.routes.length ? ' · no boat route yet: the boats sail the river' : ''}
      </div>
      <div className="cam-edit__row traffic-edit__routes">
        {fleet.routes.map((r, i) => (
          <button key={i} type="button" className={i === route ? 'is-primary' : ''} onClick={() => st.select(i)} aria-label={`Route ${i + 1}`}>
            Route {i + 1} · {r.count} {unit}
          </button>
        ))}
        <button type="button" onClick={() => st.newRoute()}>
          + New route
        </button>
        {kind === 'cars' && (
          <button type="button" onClick={() => st.addRoutes('cars', bridgeLanes().map((r) => ({ ...r, ...BRIDGE_CARS })))} title="Two lanes over Harbor Bridge, one each way, street to street">
            + Bridge lanes
          </button>
        )}
        <button type="button" onClick={() => st.undoPoint()} disabled={route < 0}>
          Undo point
        </button>
        <button type="button" onClick={() => route >= 0 && st.deleteRoute(route)} disabled={route < 0}>
          Delete route
        </button>
      </div>
      {point && (
        <div className="cam-edit__row traffic-edit__point">
          <span>
            Point {point.index + 1} of route {point.route + 1} · drag it on the map to move it
          </span>
          <button type="button" onClick={() => st.deletePoint()}>
            Delete point
          </button>
          <button type="button" onClick={() => st.selectPoint(null)}>
            Done with this point
          </button>
        </div>
      )}
      <div className="cam-edit__row traffic-edit__sliders">
        <span className="traffic-edit__for">{settingsFor}</span>
        <label>
          How many <b>{target.count}</b>
          <input type="range" min={lim[0]} max={lim[1]} value={target.count} onChange={(e) => st.setFleet(kind, { count: Number(e.target.value) })} aria-label="How many" />
        </label>
        <label>
          Slowest <b>{target.speedMin}</b>
          <input type="range" min={LIMITS.speed[0]} max={LIMITS.speed[1]} step={0.5} value={target.speedMin} onChange={(e) => st.setFleet(kind, { speedMin: Number(e.target.value) })} aria-label="Slowest speed" />
        </label>
        <label>
          Fastest <b>{target.speedMax}</b>
          <input type="range" min={LIMITS.speed[0]} max={LIMITS.speed[1]} step={0.5} value={target.speedMax} onChange={(e) => st.setFleet(kind, { speedMax: Number(e.target.value) })} aria-label="Fastest speed" />
        </label>
        {kind === 'cars' && (
          <label>
            Size <b>{target.size}</b>
            <input type="range" min={LIMITS.size[0]} max={LIMITS.size[1]} step={0.5} value={target.size} onChange={(e) => st.setFleet('cars', { size: Number(e.target.value) })} aria-label="Car size" />
          </label>
        )}
      </div>
      <div className="cam-edit__row">
        <button type="button" onClick={save}>
          Save to the project
        </button>
        <button type="button" className="is-primary" onClick={() => setTrafficMode(false)}>
          Done
        </button>
      </div>
      {restored && dirty && !note && (
        <div className="cam-edit__note">
          Your unsaved routes from {new Date(restored).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} are back: press Save to keep them
        </div>
      )}
      {note && <div className="cam-edit__note">{note}</div>}
    </div>
  );
}
