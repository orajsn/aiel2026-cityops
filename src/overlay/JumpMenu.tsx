import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';

const CHAPTER_NAME = ['Chapter 0 · The city', 'Chapter 1 · RAG to Agents', 'Chapter 2 · Agent Memory'];

export function JumpMenu() {
  const scenes = useSceneStore((s) => s.scenes);
  const index = useSceneStore((s) => s.index);
  const jumpTo = useSceneStore((s) => s.jumpTo);
  const close = useUiStore((s) => s.closeJump);
  const chapters = [0, 1, 2].filter((c) => scenes.some((s) => s.chapter === c));
  return (
    <div className="jump" onClick={close}>
      <div className="jump__panel" onClick={(e) => e.stopPropagation()}>
        {chapters.map((c) => (
          <div key={c} className="jump__chapter">
            <div className="jump__chapter-name">{CHAPTER_NAME[c]}</div>
            {scenes
              .filter((s) => s.chapter === c)
              .map((s) => {
                const i = scenes.indexOf(s);
                return (
                  <button
                    key={s.id}
                    className={`jump__item${i === index ? ' current' : ''}`}
                    onClick={() => {
                      jumpTo(s.id);
                      close();
                    }}
                  >
                    <span className="mono">{s.id}</span>
                    <span>{s.title}</span>
                  </button>
                );
              })}
          </div>
        ))}
        <div className="jump__hint">← → move · J close</div>
      </div>
    </div>
  );
}
