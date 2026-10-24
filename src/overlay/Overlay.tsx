import { AnimatePresence, motion } from 'motion/react';
import { useProgress } from '@react-three/drei';
import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';
import { OVERLAYS } from './registry';
import { HandoffCard } from './HandoffCard';
import { JumpMenu } from './JumpMenu';
import { CameraEditor } from './CameraEditor';
import { useCameraStore } from '../engine/camera';
import { Rich } from './Rich';

const CHAPTER_LABEL = ['The city', 'RAG to Agents', 'Agent Memory'];

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
  if (!scene) return null;

  const Comp = scene.overlay ? OVERLAYS[scene.overlay] : null;

  return (
    <>
      <div className="strip">
        <span className="strip__chapter">{CHAPTER_LABEL[scene.chapter]}</span>
        <span className="strip__sep" />
        <span className="strip__id mono">{scene.id}</span>
        <span className="strip__sep" />
        <span className="strip__title">{scene.title}</span>
      </div>
      <div className="logo-slot" aria-hidden />
      <div className="counter mono">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      <AnimatePresence mode="wait">
        {settled && scene.overlay && (
          <motion.div
            key={scene.id}
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

      {scene.card && settled && <HandoffCard card={scene.card} />}

      {/* presenter script under the page; CC (or S) hides it */}
      {scene.script && scriptOpen && (
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
          className={`stepper__btn stepper__btn--text${cameraEditing ? ' is-on' : ''}`}
          aria-label={cameraEditing ? 'Leave Camera mode' : 'Camera mode'}
          onClick={() => useCameraStore.getState().setEditing(!cameraEditing)}
        >
          CAM
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
      <CameraEditor />

      {jumpOpen && <JumpMenu />}
    </>
  );
}
