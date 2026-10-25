import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useProgress } from '@react-three/drei';
import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';
import { OVERLAYS } from './registry';
import { HandoffCard } from './HandoffCard';
import { JupyterDrawer } from './jupyter/JupyterDrawer';
import { JumpMenu } from './JumpMenu';
import { CameraEditor } from './CameraEditor';
import { TrafficEditor, setTrafficMode } from './TrafficEditor';
import { useTrafficStore } from '../engine/traffic';
import { useCameraStore } from '../engine/camera';
import { Rich } from './Rich';
import { pageNumber } from '../scenes';

// named for the event's agenda (owner): the intro, then Lab 2 and Lab 3; pages are numbered the same way (0.x, 2.x, 3.x)
const CHAPTER_LABEL = ['Introduction', 'Lab 2 · RAG to Agents', 'Lab 3 · Agent Memory'];

/** The map is ~70 MB: say so while it downloads instead of showing an empty sky. */
function MapLoading() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return <div className="map-loading mono">Loading the Bangkok map · {Math.round(progress)}%</div>;
}

export function Overlay() {
  const scene = useSceneStore((s) => s.scenes[s.index]);
  const index = useSceneStore((s) => s.index);
  const total = useSceneStore((s) => s.scenes.length);
  const settled = useSceneStore((s) => s.settled);
  const jumpOpen = useUiStore((s) => s.jumpOpen);
  const scriptOpen = useUiStore((s) => s.scriptOpen);
  const cameraEditing = useCameraStore((s) => s.editing);
  const trafficEditing = useTrafficStore((s) => s.editing);
  // the panel group on screen now: a page in the same group keeps it up while its camera settles
  const shownKey = useRef<string | null>(null);
  if (!scene) return null;

  const panelKey = scene.overlayGroup ?? scene.id;
  // Traffic mode clears the page away: only the map, the traffic and its bar stay
  const showPanel = !trafficEditing && !!scene.overlay && (settled || (!!scene.overlayGroup && shownKey.current === panelKey));
  shownKey.current = showPanel ? panelKey : settled ? null : shownKey.current;

  const Comp = scene.overlay ? OVERLAYS[scene.overlay] : null;

  return (
    <>
      {!trafficEditing && (
      <div className="strip">
        {/* the Oracle logo shares the strip's white panel (owner: on its own it sat on the city) */}
        <span className="strip__logo" role="img" aria-label="Oracle" />
        <span className="strip__sep" />
        <span className="strip__chapter">{CHAPTER_LABEL[scene.chapter]}</span>
        <span className="strip__sep" />
        <span className="strip__id mono">{pageNumber(scene.id)}</span>
        <span className="strip__sep" />
        <span className="strip__title">{scene.title}</span>
      </div>
      )}
      {!trafficEditing && (
        <div className="counter mono">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      )}

      <AnimatePresence mode="wait">
        {showPanel && (
          <motion.div
            key={panelKey}
            className="overlay-layer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {Comp ? <Comp {...(scene.overlayProps ?? {})} /> : <div className="overlay-missing">overlay not found: {scene.overlay}</div>}
          </motion.div>
        )}
      </AnimatePresence>

      {scene.card && settled && !trafficEditing && <HandoffCard card={scene.card} />}

      {/* lab guide: on a page with a notebook stop, the Jupyter drawer waits on the left edge */}
      {settled && !trafficEditing && <JupyterDrawer key={scene.id} sceneId={scene.id} />}

      {/* presenter script under the page; CC (or S) hides it */}
      {scene.script && scriptOpen && !trafficEditing && (
        <div className="script" aria-label="presenter script">
          <Rich text={scene.script} />
        </div>
      )}

      {/* touch navigation: the iPad has no arrow keys */}
      <nav className="stepper" aria-label="Scene navigation">
        <button
          type="button"
          className={`stepper__btn stepper__btn--text${scriptOpen ? ' is-on' : ''}`}
          aria-label={scriptOpen ? 'Hide script' : 'Show script'}
          onClick={() => useUiStore.getState().toggleScript()}
        >
          CC
        </button>
        <button
          type="button"
          className={`stepper__btn stepper__btn--text${jumpOpen ? ' is-on' : ''}`}
          aria-label="All pages"
          onClick={() => useUiStore.getState().toggleJump()}
        >
          ▦
        </button>
        <button
          type="button"
          className={`stepper__btn stepper__btn--text${cameraEditing && !trafficEditing ? ' is-on' : ''}`}
          aria-label={cameraEditing ? 'Leave Camera mode' : 'Camera mode'}
          onClick={() => (trafficEditing ? setTrafficMode(false) : useCameraStore.getState().setEditing(!cameraEditing))}
        >
          CAM
        </button>
        <button
          type="button"
          className={`stepper__btn stepper__btn--text stepper__btn--small${trafficEditing ? ' is-on' : ''}`}
          aria-label={trafficEditing ? 'Leave Traffic mode' : 'Traffic mode'}
          onClick={() => setTrafficMode(!trafficEditing)}
        >
          Traffic
        </button>
        <button type="button" className="stepper__btn" aria-label="Back" disabled={index === 0} onClick={() => useSceneStore.getState().prev()}>
          ‹
        </button>
        <button type="button" className="stepper__btn" aria-label="Next" disabled={index >= total - 1} onClick={() => useSceneStore.getState().next()}>
          ›
        </button>
      </nav>

      <div className="progress">
        <div className="progress__bar" style={{ width: `${((index + 1) / Math.max(1, total)) * 100}%` }} />
      </div>

      <MapLoading />
      {trafficEditing ? <TrafficEditor /> : <CameraEditor />}

      {jumpOpen && <JumpMenu />}
    </>
  );
}
