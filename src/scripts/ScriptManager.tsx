import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { at } from '../engine/base';
import './scripts.css';

/**
 * Script manager (owner, 3 Nov): the non-presenter mode of CityOps. Colleagues open it (same login, each with their own name), pick a page, edit
 * its Thai or English presenter script, see every earlier version, and leave comments in threads. Every save is a version and goes live to
 * the phones at once (follow/server.mjs). Open it with ?mode=scripts, or from Settings › Script manager.
 */
interface Page {
  id: string;
  label: string;
  part: string;
  title: string;
  en: string;
  th: string;
  vEn: number;
  vTh: number;
  byEn: string;
  byTh: string;
  atEn: string;
  atTh: string;
  open: number;
}
interface Version {
  n: number;
  id: string;
  lang: Lang;
  text: string;
  by: string;
  at: string;
  note: string;
  from?: number;
}
interface Comment {
  cid: string;
  id: string;
  by: string;
  at: string;
  text: string;
  parent: string | null;
  resolved: boolean;
  deleted: boolean;
}
type Lang = 'th' | 'en';
type Tab = 'script' | 'versions' | 'comments';

const API = (p: string) => at(`follow/api/m/${p}`);
const api = async <T,>(p: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T }> => {
  const r = await fetch(API(p), { cache: 'no-store', ...init });
  let data = {} as T;
  try {
    data = await r.json();
  } catch {
    /* no body */
  }
  return { ok: r.ok, status: r.status, data };
};

const ago = (iso: string): string => {
  if (!iso) return '';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

/** a word diff of two texts (longest common subsequence), as inserted and deleted runs */
function diff(a: string, b: string): { t: 'same' | 'ins' | 'del'; s: string }[] {
  const x = a.split(/(\s+)/);
  const y = b.split(/(\s+)/);
  if (x.length * y.length > 400_000) return [{ t: 'del', s: a }, { t: 'ins', s: b }];
  const L = Array.from({ length: x.length + 1 }, () => new Uint16Array(y.length + 1));
  for (let i = x.length - 1; i >= 0; i--) for (let j = y.length - 1; j >= 0; j--) L[i][j] = x[i] === y[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out: { t: 'same' | 'ins' | 'del'; s: string }[] = [];
  const push = (t: 'same' | 'ins' | 'del', s: string) => (out.length && out[out.length - 1].t === t ? (out[out.length - 1].s += s) : out.push({ t, s }));
  let i = 0;
  let j = 0;
  while (i < x.length && j < y.length) {
    if (x[i] === y[j]) {
      push('same', x[i]);
      i++;
      j++;
    } else if (L[i + 1][j] >= L[i][j + 1]) push('del', x[i++]);
    else push('ins', y[j++]);
  }
  while (i < x.length) push('del', x[i++]);
  while (j < y.length) push('ins', y[j++]);
  return out;
}

export function ScriptManager() {
  const [me, setMe] = useState('');
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState('');
  const [sel, setSel] = useState<string>(() => new URLSearchParams(location.search).get('page') ?? '');
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<Tab>('script');
  const [lang, setLang] = useState<Lang>('th');
  const [draft, setDraft] = useState('');
  const [note, setNote] = useState('');
  const [compare, setCompare] = useState(true);
  const [showThumb, setShowThumb] = useState(() => {
    try {
      return localStorage.getItem('sm-thumb') !== '0';
    } catch {
      return true;
    }
  });
  const toggleThumb = () => {
    setShowThumb((v) => {
      try {
        localStorage.setItem('sm-thumb', v ? '0' : '1');
      } catch {
        /* the choice just lasts this visit */
      }
      return !v;
    });
  };
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<{ kind: 'err' | 'ok'; text: string } | null>(null);
  const [versions, setVersions] = useState<{ versions: Version[]; default: string } | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showResolved, setShowResolved] = useState(false);

  const page = pages.find((p) => p.id === sel);
  const cur = page ? (lang === 'th' ? page.th : page.en) : '';
  const curV = page ? (lang === 'th' ? page.vTh : page.vEn) : 0;
  const curBy = page ? (lang === 'th' ? page.byTh : page.byEn) : '';
  const curAt = page ? (lang === 'th' ? page.atTh : page.atEn) : '';
  const base = useRef(0); // the version the editor started from
  const typedNew = !!page && draft !== cur; // the box differs from what is saved

  const load = useCallback(async () => {
    const r = await api<{ pages: Page[] }>('pages');
    if (r.status === 401) return setError('Please sign in again (reload this page).');
    if (!r.ok) return setError('Cannot reach the script server.');
    setError('');
    setPages(r.data.pages);
  }, []);

  useEffect(() => {
    void api<{ user: string }>('me').then((r) => setMe(r.data.user ?? ''));
    void load();
    const id = window.setInterval(() => void load(), 15_000);
    return () => window.clearInterval(id);
  }, [load]);

  // the editor follows the page and language; a colleague's newer save replaces the box only when there is nothing typed
  const shown = useRef('');
  useEffect(() => {
    if (!page) return;
    const key = `${page.id}:${lang}`;
    if (shown.current !== key) {
      shown.current = key;
      setDraft(cur);
      base.current = curV;
      setBanner(null);
    } else if (curV !== base.current) {
      if (draft === cur || draft === '' || !typedNew) {
        setDraft(cur);
        base.current = curV;
      } else setBanner({ kind: 'err', text: `${curBy || 'Someone'} saved a newer version (v${curV}) while you were editing. Your text is kept below; use “Load latest” to see theirs.` });
    }
  }, [page, lang, cur, curV, curBy, draft, typedNew]);

  const loadVersions = useCallback(async () => {
    if (!sel) return;
    const r = await api<{ versions: Version[]; default: string }>(`versions/${sel}?lang=${lang}`);
    if (r.ok) setVersions(r.data);
  }, [sel, lang]);
  const loadComments = useCallback(async () => {
    if (!sel) return;
    const r = await api<{ comments: Comment[] }>(`comments/${sel}`);
    if (r.ok) setComments(r.data.comments);
  }, [sel]);
  useEffect(() => {
    setVersions(null);
    setOpen(null);
    void loadVersions();
    void loadComments();
  }, [sel, lang, loadVersions, loadComments]);
  useEffect(() => {
    if (tab !== 'comments') return;
    const id = window.setInterval(() => void loadComments(), 10_000);
    return () => window.clearInterval(id);
  }, [tab, loadComments]);

  const choose = (id: string) => {
    if (typedNew && !window.confirm('You have unsaved changes on this page. Leave without saving?')) return;
    setSel(id);
    setTab('script');
    history.replaceState(null, '', `?mode=scripts&page=${id}`);
  };
  useEffect(() => {
    const k = (e: BeforeUnloadEvent) => {
      if (typedNew) e.preventDefault();
    };
    window.addEventListener('beforeunload', k);
    return () => window.removeEventListener('beforeunload', k);
  }, [typedNew]);

  const save = async (text: string, extra?: { note?: string; from?: number }) => {
    if (!page) return;
    setBusy(true);
    const r = await api<{ ok?: boolean; unchanged?: boolean; version?: number; by?: string; error?: string; text?: string }>(`script/${page.id}`, {
      method: 'PUT',
      body: JSON.stringify({ lang, text, base: base.current, note: extra?.note ?? note, from: extra?.from }),
    });
    setBusy(false);
    if (r.status === 409) {
      setBanner({ kind: 'err', text: `${r.data.by || 'Someone'} saved a newer version first. Your text is kept; use “Load latest” to see theirs.` });
      await load();
      return;
    }
    if (!r.ok) return setBanner({ kind: 'err', text: 'Could not save. Try again.' });
    setBanner({ kind: 'ok', text: r.data.unchanged ? 'Nothing changed.' : `Saved as version ${r.data.version}. Phones show it now.` });
    setNote('');
    base.current = r.data.version ?? base.current;
    shown.current = '';
    await load();
    void loadVersions();
    setDraft(text);
  };
  const loadLatest = () => {
    setDraft(cur);
    base.current = curV;
    setBanner(null);
  };

  const post = async (text: string, parent?: string) => {
    const r = await api(`comments/${sel}`, { method: 'POST', body: JSON.stringify({ text, parent }) });
    if (r.ok) {
      await loadComments();
      await load();
    }
    return r.ok;
  };
  const patch = async (body: object) => {
    await api(`comments/${sel}`, { method: 'PATCH', body: JSON.stringify(body) });
    await loadComments();
    await load();
  };

  const parts = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const list = pages.filter((p) => !ql || `${p.label} ${p.id} ${p.title} ${p.part}`.toLowerCase().includes(ql));
    const out: { part: string; pages: Page[] }[] = [];
    for (const p of list) {
      const last = out[out.length - 1];
      if (last && last.part === p.part) last.pages.push(p);
      else out.push({ part: p.part, pages: [p] });
    }
    return out;
  }, [pages, q]);

  const roots = comments.filter((c) => !c.parent);
  const visibleRoots = roots.filter((c) => showResolved || !c.resolved || comments.some((x) => x.parent === c.cid && !x.deleted));
  const openCount = page?.open ?? 0;
  const other = lang === 'th' ? page?.en : page?.th;

  return (
    <div className="sm">
      <div className="sm__top">
        <h1>Script manager</h1>
        <span className="who">{me ? `Signed in as ${me}` : ''}</span>
        <span className="sp" />
        <a href={at('follow/')} target="_blank" rel="noreferrer">Phone viewer ↗</a>
        <a href={at('')}>Presenter mode</a>
      </div>
      {error && <div className="sm__banner" role="alert" style={{ margin: 16 }}>{error}</div>}
      <div className="sm__body">
        <nav className="sm__list" aria-label="Pages">
          <input type="search" placeholder="Search pages" aria-label="Search pages" value={q} onChange={(e) => setQ(e.target.value)} />
          {parts.map((g) => (
            <div key={g.part}>
              <div className="sm__part">{g.part}</div>
              {g.pages.map((p) => (
                <button key={p.id} type="button" className="sm__row" aria-current={p.id === sel} onClick={() => choose(p.id)}>
                  <span className="n">{p.label}</span>
                  <span className="t">{p.title}</span>
                  {p.open > 0 && <span className="b c" title="open comments">{p.open}</span>}
                  <span className={`th${p.th ? ' on' : ''}`} title={p.th ? 'has Thai' : 'no Thai yet'} />
                </button>
              ))}
            </div>
          ))}
        </nav>
        <main className="sm__main">
          {!page ? (
            <p className="sm__empty">Choose a page on the left. A green dot means the page has a Thai script; a red number counts open comments.</p>
          ) : (
            <>
              <div className="sm__head">
                {showThumb && <img src={`${at('thumbs/')}${page.id}.jpg`} alt="" onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')} />}
                <div>
                  <div className="part">{page.part}</div>
                  <h2>
                    {page.label} · {page.title}
                  </h2>
                  <div className="meta">id {page.id}</div>
                </div>
                <button type="button" className="sm__thumb-toggle" aria-pressed={showThumb} onClick={toggleThumb}>
                  {showThumb ? 'Hide slide picture' : 'Show slide picture'}
                </button>
              </div>
              <div className="sm__tabs" role="tablist">
                {(['script', 'versions', 'comments'] as Tab[]).map((t) => (
                  <button key={t} role="tab" type="button" className="sm__tab" aria-selected={tab === t} onClick={() => setTab(t)}>
                    {t === 'script' ? 'Script' : t === 'versions' ? 'Versions' : 'Comments'}
                    {t === 'comments' && openCount > 0 && <span className="b">{openCount}</span>}
                  </button>
                ))}
              </div>

              {tab === 'script' && (
                <>
                  <div className="sm__bar">
                    <div className="sm__seg" role="group" aria-label="Language">
                      <button type="button" aria-pressed={lang === 'th'} onClick={() => setLang('th')}>ไทย</button>
                      <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
                    </div>
                    <label className="sm__stat">
                      <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} /> Show {lang === 'th' ? 'English' : 'Thai'} beside
                    </label>
                    <span className="sp" style={{ flex: 1 }} />
                    <span className="sm__stat">{curV ? `v${curV} by ${curBy}, ${ago(curAt)}` : 'Default text, not edited yet'}</span>
                  </div>
                  {banner && (
                    <div className={`sm__banner${banner.kind === 'ok' ? ' ok' : ''}`} role="status">
                      {banner.text} {banner.kind === 'err' && <button type="button" className="sm__btn small" onClick={loadLatest}>Load latest</button>}
                    </div>
                  )}
                  <div className={`sm__cols${compare ? ' two' : ''}`}>
                    {compare && (
                      <div className="sm__ref" lang={lang === 'th' ? 'en' : 'th'}>
                        <h3>{lang === 'th' ? 'English' : 'ไทย'} (reference)</h3>
                        {other || <span className="sm__stat">No script in this language yet.</span>}
                      </div>
                    )}
                    <div className="sm__ed">
                      <h3>{lang === 'th' ? 'ไทย' : 'English'} · one paragraph per blank line</h3>
                      <textarea className="sm__ta" lang={lang} value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Script" />
                    </div>
                  </div>
                  <div className="sm__bar" style={{ marginTop: 10 }}>
                    <input className="sm__note" style={{ flex: 1, minWidth: 200 }} placeholder="What changed? (optional)" aria-label="Note for this version" value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} />
                    <button type="button" className="sm__btn" disabled={!typedNew || busy} onClick={loadLatest}>Discard changes</button>
                    <button type="button" className="sm__btn primary" disabled={!typedNew || busy || draft.trim() === ''} onClick={() => void save(draft)}>
                      {busy ? 'Saving…' : 'Save version'}
                    </button>
                  </div>
                  <p className="sm__stat">
                    {draft.length} characters · about {Math.max(1, Math.round(draft.replace(/\s+/g, '').length / (lang === 'th' ? 9 : 5.5) / 2.2))} s to read aloud
                  </p>
                </>
              )}

              {tab === 'versions' && (
                <>
                  <div className="sm__bar">
                    <div className="sm__seg" role="group" aria-label="Language">
                      <button type="button" aria-pressed={lang === 'th'} onClick={() => setLang('th')}>ไทย</button>
                      <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
                    </div>
                    <span className="sm__stat">Every save is a version. Restoring one saves it again as a new version, nothing is lost.</span>
                  </div>
                  {!versions ? (
                    <p className="sm__empty">Loading…</p>
                  ) : (
                    <>
                      {versions.versions.map((v, i) => {
                        const prev = versions.versions[i + 1]?.text ?? versions.default;
                        return (
                          <div className="sm__v" key={v.n}>
                            <header>
                              <span className="no">v{v.n}</span>
                              <strong>{v.by}</strong>
                              <span className="when">{ago(v.at)}</span>
                              {v.note && <span className="note">“{v.note}”</span>}
                              {v.from !== undefined && <span className="when">restored from {v.from === 0 ? 'the default' : `v${v.from}`}</span>}
                              {i === 0 && <span className="when">· live on phones</span>}
                              <span className="sp" />
                              <button type="button" className="sm__btn small" onClick={() => setOpen(open === String(v.n) ? null : String(v.n))}>
                                {open === String(v.n) ? 'Hide changes' : 'Show changes'}
                              </button>
                              {i > 0 && (
                                <button type="button" className="sm__btn small" disabled={busy} onClick={() => { setLang(v.lang); void save(v.text, { note: `Restored v${v.n}`, from: v.n }).then(() => setTab('script')); }}>
                                  Restore
                                </button>
                              )}
                            </header>
                            {open === String(v.n) && (
                              <pre lang={v.lang}>
                                {diff(prev, v.text).map((d, k) => (d.t === 'ins' ? <ins key={k}>{d.s}</ins> : d.t === 'del' ? <del key={k}>{d.s}</del> : <span key={k}>{d.s}</span>))}
                              </pre>
                            )}
                          </div>
                        );
                      })}
                      <div className="sm__v">
                        <header>
                          <span className="no">v0</span>
                          <strong>Default text</strong>
                          <span className="when">the script the page started with</span>
                          <span className="sp" />
                          <button type="button" className="sm__btn small" onClick={() => setOpen(open === '0' ? null : '0')}>{open === '0' ? 'Hide' : 'Show text'}</button>
                          {versions.versions.length > 0 && versions.default && (
                            <button type="button" className="sm__btn small" disabled={busy} onClick={() => void save(versions.default, { note: 'Restored the default', from: 0 }).then(() => setTab('script'))}>
                              Restore
                            </button>
                          )}
                        </header>
                        {open === '0' && <pre lang={lang}>{versions.default || 'No default script in this language.'}</pre>}
                      </div>
                    </>
                  )}
                </>
              )}

              {tab === 'comments' && (
                <>
                  <div className="sm__bar">
                    <label className="sm__stat">
                      <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} /> Show resolved
                    </label>
                  </div>
                  <NewComment onPost={(t) => post(t)} label="Add a comment on this page" />
                  {visibleRoots.length === 0 && <p className="sm__empty">No comments yet.</p>}
                  {visibleRoots
                    .slice()
                    .reverse()
                    .map((c) => (
                      <div className={`sm__c${c.resolved ? ' resolved' : ''}`} key={c.cid}>
                        <div>
                          <span className="by">{c.by}</span>
                          <span className="when">{ago(c.at)}{c.resolved ? ' · resolved' : ''}</span>
                        </div>
                        <p>{c.deleted ? '(deleted)' : c.text}</p>
                        {comments.filter((x) => x.parent === c.cid && !x.deleted).map((r) => (
                          <div className="reply" key={r.cid}>
                            <span className="by">{r.by}</span>
                            <span className="when">{ago(r.at)}</span>
                            <p>{r.text}</p>
                            {r.by === me && <button type="button" className="sm__btn small" onClick={() => void patch({ op: 'delete', cid: r.cid })}>Delete</button>}
                          </div>
                        ))}
                        <div className="row">
                          <NewComment inline onPost={(t) => post(t, c.cid)} label="Reply" />
                          <button type="button" className="sm__btn small" onClick={() => void patch({ op: 'resolve', cid: c.cid, value: !c.resolved })}>{c.resolved ? 'Reopen' : 'Resolve'}</button>
                          {c.by === me && !c.deleted && <button type="button" className="sm__btn small" onClick={() => void patch({ op: 'delete', cid: c.cid })}>Delete</button>}
                        </div>
                      </div>
                    ))}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/** a small box to write a comment or a reply */
function NewComment({ onPost, label, inline = false }: { onPost: (t: string) => Promise<boolean>; label: string; inline?: boolean }) {
  const [t, setT] = useState('');
  const [open, setOpen] = useState(!inline);
  const [busy, setBusy] = useState(false);
  if (!open)
    return (
      <button type="button" className="sm__btn small" onClick={() => setOpen(true)}>
        {label}
      </button>
    );
  return (
    <div style={{ flex: 1, minWidth: 220, marginBottom: inline ? 0 : 14 }}>
      <textarea className="sm__note" rows={inline ? 2 : 3} placeholder={label} aria-label={label} value={t} onChange={(e) => setT(e.target.value)} maxLength={2000} style={{ resize: 'vertical' }} />
      <div className="sm__bar" style={{ marginTop: 6 }}>
        <button
          type="button"
          className="sm__btn primary small"
          disabled={!t.trim() || busy}
          onClick={async () => {
            setBusy(true);
            if (await onPost(t.trim())) {
              setT('');
              if (inline) setOpen(false);
            }
            setBusy(false);
          }}
        >
          Post
        </button>
        {inline && (
          <button type="button" className="sm__btn small" onClick={() => setOpen(false)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
