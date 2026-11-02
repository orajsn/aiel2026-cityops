import { Html } from '@react-three/drei';
import type { ReactNode } from 'react';
import { DB, at } from './skyPlaces';
import type { Vec3 } from './shots';

/**
 * 4a on the sky stage (owner, 2 Nov): the documents come in as real-looking PDF books (click 1), each one becomes a very long
 * row of numbers on its way into the vector space (click 2), and the question is turned into numbers the same way (click 3).
 * Everything is drawn with HTML cards that follow 3D positions, timed by the act clock `t` (ms since the click).
 */
const ease = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};
const lerp3 = (a: Vec3, b: Vec3, k: number): Vec3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

export const PDFS = ['approved repair specification', 'maintenance manual', 'inspection report'];

/** the numbers of a vector: deterministic, signed, a few decimals, far longer than the card (the real one is 384 long) */
export function vectorNumbers(seed: number, n = 70): string {
  let s = seed * 9301 + 49297;
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const v = (s / 233280) * 4 - 2;
    out.push(v.toFixed(2).replace('-', '−'));
  }
  return out.join(', ');
}

const card: React.CSSProperties = { pointerEvents: 'none', fontFamily: 'var(--font-body, Inter, sans-serif)' };

/** a PDF drawn as a small book: a stack of pages, a teal PDF tab, lines of text */
export function PdfBook({ name, size = 1 }: { name?: string; size?: number }) {
  return (
    <div style={{ ...card, width: 118 * size, textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 96 * size, height: 124 * size, margin: '0 auto' }}>
        {[10, 5].map((o) => (
          <div key={o} style={{ position: 'absolute', left: o * size, top: -o * size * 0.6, right: -o * size, bottom: o * size * 0.6, background: '#e9edf0', border: '1.5px solid #9fb0bb', borderRadius: 4 }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: '#fff', border: '2px solid #1B8A9C', borderRadius: 4, boxShadow: '0 6px 14px rgba(20,40,60,0.28)', padding: `${14 * size}px ${10 * size}px` }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 9 * size, background: '#1B8A9C', borderRadius: '2px 0 0 2px' }} />
          <div style={{ marginLeft: 8 * size }}>
            {[88, 100, 76, 96, 60, 90, 72].map((w, i) => (
              <div key={i} style={{ height: 5 * size, width: `${w}%`, background: i === 0 ? '#1f2a33' : '#b9c4cc', borderRadius: 3, marginBottom: 6 * size }} />
            ))}
          </div>
          <div style={{ position: 'absolute', right: -8 * size, bottom: 10 * size, background: '#1B8A9C', color: '#fff', fontWeight: 800, fontSize: 13 * size, padding: `${2 * size}px ${7 * size}px`, borderRadius: 4, letterSpacing: 0.5 }}>PDF</div>
        </div>
      </div>
      {name && <div style={{ marginTop: 8 * size, fontSize: 14 * size, fontWeight: 600, color: '#1f2a33', background: 'rgba(255,255,255,0.92)', borderRadius: 6, padding: '2px 8px', display: 'inline-block' }}>{name}</div>}
    </div>
  );
}

/** one text turning into numbers: its icon, an arrow, a row of numbers that scrolls past, and "384 numbers" */
function Strip({ t, seed, icon, tone }: { t: number; seed: number; icon: ReactNode; tone: 'teal' | 'red' }) {
  const text = vectorNumbers(seed);
  const col = tone === 'teal' ? '#146f7f' : '#C74634';
  const shift = -((t * 0.06) % 900);
  return (
    <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 12, width: 520, padding: '8px 14px', background: 'rgba(255,255,255,0.96)', borderRadius: 12, border: `2px solid ${col}`, boxShadow: '0 6px 16px rgba(20,40,60,0.25)' }}>
      <div style={{ flex: 'none', display: 'flex' }}>{icon}</div>
      <span style={{ color: col, fontSize: 24, fontWeight: 700 }}>→</span>
      <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)', fontSize: 17, fontWeight: 600, color: '#1f2a33', maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 80%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 80%, transparent)' }}>
        <span style={{ display: 'inline-block', transform: `translateX(${shift}px)` }}>( {text}, … )</span>
      </div>
      <span style={{ flex: 'none', fontSize: 15, fontWeight: 700, color: col, background: tone === 'teal' ? 'rgba(27,138,156,0.12)' : 'rgba(199,70,52,0.1)', padding: '3px 9px', borderRadius: 999 }}>384 numbers</span>
    </div>
  );
}

const HOLD = (t: number, from: number, to: number, fade = 350) => Math.min(ease((t - from) / fade), 1 - ease((t - to) / fade));

export function SkyVectorize({ act, t, visible }: { act: 'vector' | 'vector2' | 'vector3'; t: number; visible: boolean }) {
  if (!visible) return null;
  const dbTop: Vec3 = [DB[0], DB[1] + 1.1, DB[2]];
  if (act === 'vector') {
    // three PDFs fly in from the top left and drop into the database, one after another
    return (
      <>
        {PDFS.map((name, i) => {
          const start = 300 + i * 1000;
          const k = ease((t - start) / 1300);
          const from = at(-6.4 + i * 0.5, 6.4 - i * 0.7);
          const pos = lerp3(from, dbTop, k);
          const op = Math.min(ease((t - start + 250) / 300), 1 - ease((t - start - 1100) / 300));
          if (op <= 0.01) return null;
          return (
            <Html key={name} position={pos} center zIndexRange={[16, 0]} style={{ pointerEvents: 'none', opacity: op, transform: `scale(${1 - 0.55 * k})`, transformOrigin: 'center' }}>
              <PdfBook name={name} />
            </Html>
          );
        })}
      </>
    );
  }
  if (act === 'vector2') {
    // each PDF comes back out of the database as a long row of numbers, then they turn into points in the cloud
    return (
      <>
        {PDFS.map((name, i) => {
          const start = 300 + i * 800;
          const op = HOLD(t, start, 3300);
          if (op <= 0.01) return null;
          const rise = ease((t - start) / 700);
          const pos: Vec3 = [DB[0], DB[1] + 1.4 + (1.2 + i * 1.0) * rise, DB[2]];
          return (
            <Html key={name} position={pos} center zIndexRange={[16, 0]} style={{ pointerEvents: 'none', opacity: op }}>
              <Strip t={t} seed={i + 3} tone="teal" icon={<PdfBook size={0.42} />} />
            </Html>
          );
        })}
      </>
    );
  }
  // vector3: the question is turned into numbers the same way, then it is a point
  const op = HOLD(t, 200, 2900);
  if (op <= 0.01) return null;
  const rise = ease((t - 200) / 700);
  const pos: Vec3 = [DB[0], DB[1] + 1.4 + 2.2 * rise, DB[2]];
  return (
    <Html position={pos} center zIndexRange={[16, 0]} style={{ pointerEvents: 'none', opacity: op }}>
      <Strip
        t={t}
        seed={11}
        tone="red"
        icon={<div style={{ ...card, fontSize: 17, fontWeight: 700, color: '#1f2a33', maxWidth: 120, lineHeight: 1.2 }}>“Which supplier is ready?”</div>}
      />
    </Html>
  );
}
