import { useEffect, useRef } from 'react';
import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';
import { CHAPTER_NAME, SECTIONS } from '../scenes/sections';

/**
 * Page overview (Pages button or J): every page as a preview with its name under it, grouped by
 * chapter and story section. Click one to jump there. Previews are pictures of the real pages
 * (public/thumbs/<id>.jpg, refreshed by tools/capture-thumbs.mjs).
 */
export function JumpMenu() {
  const scenes = useSceneStore((s) => s.scenes);
  const index = useSceneStore((s) => s.index);
  const jumpTo = useSceneStore((s) => s.jumpTo);
  const close = useUiStore((s) => s.closeJump);
  const current = useRef<HTMLButtonElement>(null);
  // block body: newer Chromium returns a Promise from scrollIntoView, which React would treat as a cleanup
  useEffect(() => {
    current.current?.scrollIntoView?.({ block: 'center' });
  }, []);
  const byId = new Map(scenes.map((s) => [s.id, s]));

  return (
    <div className="jump" onClick={close} role="dialog" aria-label="All pages">
      <div className="jump__panel" onClick={(e) => e.stopPropagation()}>
        <div className="jump__top">
          <span className="jump__title">All pages</span>
          <button type="button" className="jump__close" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>
        {[0, 1, 2].map((c) => (
          <section key={c} className="jump__chapter">
            <h2 className="jump__chapter-name">{CHAPTER_NAME[c]}</h2>
            {SECTIONS.filter((sec) => sec.chapter === c).map((sec) => (
              <div key={sec.name} className="jump__section">
                <h3 className="jump__section-name">{sec.name}</h3>
                <div className="jump__grid">
                  {sec.pages.map((id) => {
                    const s = byId.get(id);
                    if (!s) return null;
                    const here = scenes[index]?.id === id;
                    return (
                      <button
                        key={id}
                        ref={here ? current : undefined}
                        type="button"
                        className={`jump__card${here ? ' current' : ''}`}
                        aria-label={`${id} ${s.title}`}
                        onClick={() => {
                          jumpTo(id);
                          close();
                        }}
                      >
                        <span className="jump__thumb">
                          <img
                            src={`./thumbs/${id}.jpg`}
                            alt={`Preview of page ${id}`}
                            loading="lazy"
                            onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
                          />
                          <span className="jump__id mono">{id}</span>
                        </span>
                        <span className="jump__name">{s.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
