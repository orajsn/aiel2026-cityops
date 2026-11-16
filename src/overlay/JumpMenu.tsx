import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useSceneStore } from '../engine/store';
import { useUiStore } from '../engine/ui';
import { CHAPTER_NAME, PARTS, SECTIONS } from '../scenes/sections';
import { pageLabel } from '../scenes';
import { MAP_STEPS, stepName } from '../content/lab3Map';
import { useDrawerStore } from '../engine/presentation';

const MAP_PAGE = '3.6m';
const stepLetter = (i: number) => i === 0 ? '' : String.fromCharCode(96 + i);
/** Searchable native cards remain accurate when city scenes change. */
export function JumpMenu() {
  const scenes = useSceneStore(s => s.scenes);
  const index = useSceneStore(s => s.index);
  const jumpTo = useSceneStore(s => s.jumpTo);
  const close = useUiStore(s => s.closeJump);
  const mapStep = useDrawerStore(s => s.open ? Math.min(s.focus, MAP_STEPS.length - 1) : 0);
  const [query, setQuery] = useState('');
  const panel = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const old = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    search.current?.focus();
    return () => old?.focus();
  }, []);
  const byId = new Map(scenes.map(s => [s.id, s]));
  let count = 0;
  const matches = (text: string) => !query.trim() || text.toLowerCase().includes(query.trim().toLowerCase());
  const chapters = PARTS.map(c => {
    const sections = SECTIONS.filter(sec => sec.chapter === c).map(sec => {
      const cards = sec.pages.flatMap(id => {
        const scene = byId.get(id);
        if (!scene) return [];
        const onPage = scenes[index]?.id === id;
        const tiles = id === MAP_PAGE ? MAP_STEPS.map((m, k) => ({ key: `${id}-${k}`, label: pageLabel(id) + stepLetter(k), name: k === 0 ? scene.title : stepName(m), step: k, here: onPage && mapStep === k })) : [{ key: id, label: pageLabel(id), name: scene.title, step: -1, here: onPage }];
        return tiles.filter(t => matches(`${CHAPTER_NAME[c]} ${sec.name} ${t.label} ${t.name}`)).map(t => {
          count++;
          return <button key={t.key} type="button" className={`jump__card${t.here ? ' current' : ''}`} aria-label={`${CHAPTER_NAME[c]} ${t.label} ${t.name}`} aria-current={t.here ? 'page' : undefined} onClick={() => {
            jumpTo(id);
            if (t.step >= 0) {
              const d = useDrawerStore.getState();
              d.setOpen(t.step > 0); d.setFocus(t.step); useDrawerStore.setState({ done: false });
            }
            close();
          }}>
            <span className="jump__card-top"><span className="jump__number">{t.label}</span>{t.here ? <span className="jump__current">CURRENT</span> : <span className="jump__arrow" aria-hidden>↗</span>}</span>
            <span className="jump__name">{t.name}</span>
          </button>;
        });
      });
      return cards.length ? <div className="jump__section" key={sec.name}><h3 className="jump__section-name">{sec.name}</h3><div className="jump__grid">{cards}</div></div> : null;
    }).filter(Boolean);
    return sections.length ? <section className="jump__chapter" key={c}><h2 className="jump__chapter-name">{CHAPTER_NAME[c]}</h2>{sections}</section> : null;
  }).filter(Boolean);
  const onKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === 'Tab') {
      const items = Array.from(panel.current?.querySelectorAll<HTMLButtonElement | HTMLInputElement>('button,input') ?? []).filter(el => !el.disabled);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
    e.stopPropagation();
  };
  return <div className="jump" role="dialog" aria-label="All pages" aria-modal onClick={close} onKeyDown={onKeys}>
    <div className="jump__panel" ref={panel} onClick={e => e.stopPropagation()}>
      <div className="jump__top"><span className="jump__title">Explore the labs</span><input className="jump__search" ref={search} type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a topic, tool or page…" aria-label="Search presentation pages" /><button className="jump__close" type="button" onClick={close} aria-label="Close">×</button></div>
      {chapters}{count === 0 && <div className="jump__empty" role="status">No matching pages. Try a different word.</div>}
    </div>
  </div>;
}
