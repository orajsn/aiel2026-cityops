import { useState } from 'react';
import { persistOverrides, useCameraStore } from '../engine/camera';
import { useSceneStore } from '../engine/store';
import { frameCityScore } from '../world/frame';

/**
 * Camera mode bar: what to press, whether the frame shows sky or the map edge, and the save buttons.
 * Saves go to src/content/cameraOverrides.json through the dev server (or this browser without one).
 */
export function CameraEditor() {
  const editing = useCameraStore((s) => s.editing);
  const live = useCameraStore((s) => s.live);
  const overrides = useCameraStore((s) => s.overrides);
  const scene = useSceneStore((s) => s.scenes[s.index]);
  const scenes = useSceneStore((s) => s.scenes);
  const [note, setNote] = useState('');
  if (!editing || !scene) return null;

  const samePlace = scenes.filter((s) => s.shot === scene.shot).map((s) => s.id);
  const clean = live ? frameCityScore(live.position, live.target) >= 0.97 : true;

  const save = async (ids: string[]) => {
    if (!live) return;
    useCameraStore.getState().setOverride(ids, live);
    const where = await persistOverrides(useCameraStore.getState().overrides);
    setNote(`Saved for ${ids.length === 1 ? `page ${ids[0]}` : `${ids.length} pages`} · ${where === 'project' ? 'in the project' : 'in this browser only'}`);
  };
  const reset = async () => {
    useCameraStore.getState().clearOverride([scene.id]);
    await persistOverrides(useCameraStore.getState().overrides);
    setNote(`Page ${scene.id} is back to its place`);
  };

  return (
    <div className="cam-edit" role="toolbar" aria-label="Camera mode">
      <div className="cam-edit__row">
        <span className="cam-edit__title mono">
          Camera · page {scene.id} · place {scene.shot}
          {overrides[scene.id] ? ' · saved angle' : ''}
        </span>
        <span className={`cam-edit__badge${clean ? ' is-ok' : ' is-warn'}`}>{clean ? 'only city in frame' : 'sky or map edge in frame'}</span>
      </div>
      <div className="cam-edit__hint">Arrows / WASD walk · Q E down / up · Shift faster · drag to look · wheel forward · iPad: one finger looks, two fingers move</div>
      <div className="cam-edit__row">
        <button type="button" onClick={() => save([scene.id])}>Save for this page</button>
        {samePlace.length > 1 && (
          <button type="button" onClick={() => save(samePlace)}>
            Save for all {samePlace.length} pages at {scene.shot}
          </button>
        )}
        {overrides[scene.id] && (
          <button type="button" onClick={reset}>
            Reset this page
          </button>
        )}
        <button type="button" className="is-primary" onClick={() => useCameraStore.getState().setEditing(false)}>
          Done
        </button>
      </div>
      {note && <div className="cam-edit__note">{note}</div>}
    </div>
  );
}
