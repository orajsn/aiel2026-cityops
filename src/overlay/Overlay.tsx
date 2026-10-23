import { AnimatePresence, motion } from 'motion/react';
import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';
import { OVERLAYS } from './registry';
import { HandoffCard } from './HandoffCard';
import { JumpMenu } from './JumpMenu';

const CHAPTER_LABEL = ['The city', 'RAG to Agents', 'Agent Memory'];

export function Overlay() {
  const scene = useSceneStore((s) => s.scenes[s.index]);
  const index = useSceneStore((s) => s.index);
  const total = useSceneStore((s) => s.scenes.length);
  const settled = useSceneStore((s) => s.settled);
  const jumpOpen = useUiStore((s) => s.jumpOpen);
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

      <div className="progress">
        <div className="progress__bar" style={{ width: `${((index + 1) / Math.max(1, total)) * 100}%` }} />
      </div>

      {jumpOpen && <JumpMenu />}
    </>
  );
}
