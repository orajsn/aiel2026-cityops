import { useEffect, useRef } from 'react';
import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';
import { CHAPTER_NAME, PARTS, SECTIONS } from '../scenes/sections';
import { pageLabel } from '../scenes';
import { MAP_STEPS, stepName } from '../content/lab3Map';
import { useDrawerStore } from '../engine/presentation';

/** Lab 3's code map is one page with many steps; the overview shows each step as its own sub-page, 19, 19a, 19b… (owner, 4 Nov) */
const MAP_PAGE = '3.6m';
const stepLetter = (i: number) => (i === 0 ? '' : String.fromCharCode(96 + i));

/**
 * Page overview (Pages button or J): every page as a preview with its name under it, grouped by
 * chapter and story section. Click one to jump there. Previews are pictures of the real pages
 * (public/thumbs/<id>.jpg, refreshed by tools/capture-thumbs.mjs). The code map's steps are sub-pages with pictures of their own
 * (public/thumbs/3.6m_<step>.jpg, tools/capture-code-map-thumbs.mjs).
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
  const mapStep = useDrawerStore((s) => (s.open ? Math.min(s.focus, MAP_STEPS.length - 1) : 0));

  return (
    <div className="jump" onClick={close} role="dialog" aria-label="All pages">
      <div className="jump__panel" onClick={(e) => e.stopPropagation()}>
        <div className="jump__top">
          <span className="jump__title">All pages</span>
          <button type="button" className="jump__close" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>
        {PARTS.map((c) => (
          <section key={c} className="jump__chapter">
            <h2 className="jump__chapter-name">{CHAPTER_NAME[c]}</h2>
            {SECTIONS.filter((sec) => sec.chapter === c).map((sec) => (
              <div key={sec.name} className="jump__section">
                <h3 className="jump__section-name">{sec.name}</h3>
                <div className="jump__grid">
                  {sec.pages.flatMap((id) => {
                    const s = byId.get(id);
                    if (!s) return [];
                    const onPage = scenes[index]?.id === id;
                    // the code map: one tile per step, on the page's own number plus a letter
                    const tiles = id === MAP_PAGE ? MAP_STEPS.map((m, k) => ({ key: `${id}-${k}`, label: `${pageLabel(id)}${stepLetter(k)}`, name: k === 0 ? s.title : stepName(m), thumb: k === 0 ? `./thumbs/${id}.jpg` : `./thumbs/${id}_${k}.jpg`, step: k, here: onPage && mapStep === k })) : [{ key: id, label: pageLabel(id), name: s.title, thumb: `./thumbs/${id}.jpg`, step: -1, here: onPage }];
                    return tiles.map((t) => (
                      <button
                        key={t.key}
                        ref={t.here ? current : undefined}
                        type="button"
                        className={`jump__card${t.here ? ' current' : ''}`}
                        aria-label={`${CHAPTER_NAME[s.chapter]} ${t.label} ${t.name}`}
                        onClick={() => {
                          jumpTo(id);
                          if (t.step >= 0) {
                            const d = useDrawerStore.getState();
                            d.setOpen(t.step > 0);
                            d.setFocus(t.step);
                            useDrawerStore.setState({ done: false });
                          }
                          close();
                        }}
                      >
                        <span className="jump__thumb">
                          <img
                            src={t.thumb}
                            alt={`Preview of ${CHAPTER_NAME[s.chapter]} page ${t.label}`}
                            loading="lazy"
                            onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
                          />
                          <span className="jump__id mono">{t.label}</span>
                        </span>
                        <span className="jump__name">{t.name}</span>
                      </button>
                    ));
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
