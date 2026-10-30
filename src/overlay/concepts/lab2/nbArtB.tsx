import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { AgentAvatar } from './AgentAvatar';
import { Figure } from './everyday';

/**
 * Notebook pages 2.5d to 2.8: the everyday picture of what each page's code does (owner, 30 Oct), in the flat style of
 * Lab 3's pages 3.2 to 3.4. Two greys, teal for the thing that matters, at most one slow motion each. Every drawing
 * is a 420 x 480 viewBox that fills the column it is shown in.
 */

const G_LIGHT = 'rgba(138, 145, 156, 0.35)';
const G_MID = '#8a919c';
const G_DARK = '#5c6b78';
const G_DEEP = '#46515c';
const T_SOFT = 'rgba(27, 138, 156, 0.28)';
const TEAL = 'var(--teal)';
const PAPER = '#f4f6f8';
const MONO = 'JetBrains Mono, monospace';
const SANS = 'Inter, sans-serif';

function Art({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg data-art={id} width="100%" height="100%" viewBox="0 0 420 480" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <ellipse cx="210" cy="466" rx="190" ry="7" fill="rgba(127,127,127,0.18)" />
      {children}
    </svg>
  );
}

const pop = (delay: number) => ({ initial: { opacity: 0, y: -14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.6, ease: EASE } });
const fade = (delay: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay, duration: 0.6, ease: EASE } });

/* ---------------- 2.5d · the manual open in the truck ---------------- */
function Manual() {
  return (
    <Art id="nb-manual">
      <defs>
        <clipPath id="nbm-win"><rect x="296" y="68" width="78" height="58" rx="8" /></clipPath>
      </defs>
      {/* the truck, side on */}
      <rect x="24" y="52" width="250" height="118" rx="14" fill={G_MID} />
      <path d="M274 80h66a14 14 0 0 1 12 7l30 40a14 14 0 0 1 3 9v34h-111z" fill={G_DARK} />
      <rect x="296" y="68" width="78" height="58" rx="8" fill="#e9f4f6" />
      <g clipPath="url(#nbm-win)"><Figure x={336} y={70} scale={0.5} shirt="#5d7f8c" /></g>
      <rect x="24" y="148" width="368" height="22" rx="6" fill={G_DEEP} />
      {[88, 330].map((x) => (
        <g key={x}>
          <circle cx={x} cy="172" r="26" fill="#2f3842" />
          <circle cx={x} cy="172" r="11" fill={G_MID} />
        </g>
      ))}
      <path d="M44 78h210M44 104h120" stroke="rgba(255,255,255,0.3)" strokeWidth="6" strokeLinecap="round" />
      {/* the manual, open on the lap */}
      <rect x="14" y="228" width="392" height="226" rx="14" fill={G_DARK} />
      <rect x="26" y="236" width="178" height="208" rx="8" fill={PAPER} stroke={G_DEEP} strokeWidth="2" />
      <rect x="216" y="236" width="178" height="208" rx="8" fill={PAPER} stroke={G_DEEP} strokeWidth="2" />
      <rect x="204" y="236" width="12" height="208" fill={G_LIGHT} />
      {/* left page: the order of the checks */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${i * 64})`}>
          <circle cx="56" cy="278" r="15" fill={i < 2 ? TEAL : G_MID} />
          <text x="56" y="284" textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff" fontFamily={SANS}>{i + 1}</text>
          <path d="M82 270h84M82 286h58" stroke={G_MID} strokeWidth="6" strokeLinecap="round" />
          <rect x="170" y="266" width="22" height="22" rx="5" fill="#fff" stroke={G_DARK} strokeWidth="2" />
          {i < 2 && (
            <motion.path d="M174 277l6 6 9-12" fill="none" stroke={TEAL} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 + i * 0.9, duration: 0.5 }} />
          )}
        </g>
      ))}
      {/* right page: write down the decision; escalate when unsure */}
      <text x="234" y="272" fontSize="17" fontWeight="700" fill={G_DARK} fontFamily={SANS}>Write it down</text>
      <rect x="232" y="284" width="144" height="58" rx="6" fill="#fff" stroke={G_MID} strokeWidth="2" />
      <path d="M244 302h92M244 320h60" stroke={G_LIGHT} strokeWidth="5" strokeLinecap="round" />
      <path d="M340 336l30-30 8 8-30 30-12 4z" fill={TEAL} />
      <path d="M232 362h144" stroke={G_LIGHT} strokeWidth="2" strokeDasharray="5 5" />
      <path d="M262 428V386M262 386l-12 12M262 386l12 12" stroke={G_DARK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="290" y="404" fontSize="17" fontWeight="700" fill={G_DARK} fontFamily={SANS}>Not sure?</text>
      <text x="290" y="426" fontSize="17" fontWeight="700" fill={TEAL} fontFamily={SANS}>Escalate</text>
    </Art>
  );
}

/* ---------------- 2.6b · the lunch tray ---------------- */
function Tray() {
  return (
    <Art id="nb-tray">
      {/* the one JSON: a tag over the tray */}
      <motion.g {...fade(2.4)}>
        <rect x="120" y="30" width="180" height="104" rx="16" fill="#fff" stroke={TEAL} strokeWidth="4" />
        <text x="210" y="106" textAnchor="middle" fontSize="76" fontWeight="700" fill={TEAL} fontFamily={MONO}>{'{ }'}</text>
        <path d="M210 134v40M210 174l-12-14M210 174l12-14" stroke={TEAL} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </motion.g>
      {/* the tray */}
      <rect x="14" y="196" width="392" height="250" rx="20" fill={G_DARK} />
      <rect x="22" y="204" width="376" height="234" rx="16" fill={G_MID} />
      <rect x="170" y="186" width="80" height="10" rx="5" fill={G_DEEP} />
      {/* compartment 1: the asset row */}
      <rect x="38" y="224" width="150" height="196" rx="12" fill={PAPER} />
      <motion.g {...pop(0.5)}>
        <rect x="52" y="262" width="122" height="116" rx="8" fill="#fff" stroke={G_DARK} strokeWidth="2.5" />
        <rect x="52" y="262" width="122" height="30" rx="8" fill={TEAL} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M66 ${312 + i * 22}h40M118 ${312 + i * 22}h40`} stroke={G_MID} strokeWidth="6" strokeLinecap="round" />
        ))}
      </motion.g>
      {/* compartment 2: the graph neighbours */}
      <rect x="200" y="224" width="184" height="92" rx="12" fill={PAPER} />
      <motion.g {...pop(1.4)}>
        <path d="M242 270l56-18M242 270l56 26M298 252l50 20M298 296l50-24" stroke={G_MID} strokeWidth="3" />
        {[[242, 270, true], [298, 252, false], [298, 296, false], [348, 272, false]].map(([x, y, c]) => (
          <circle key={`${x}-${y}`} cx={x as number} cy={y as number} r={c ? 16 : 12} fill={c ? TEAL : G_DARK} />
        ))}
      </motion.g>
      {/* compartment 3: the closest reports */}
      <rect x="200" y="328" width="184" height="92" rx="12" fill={PAPER} />
      <motion.g {...pop(2.0)}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${216 + i * 54} 344)`}>
            <rect width="44" height="60" rx="5" fill="#fff" stroke={G_DARK} strokeWidth="2.5" />
            <path d="M8 16h28M8 28h28M8 40h16" stroke={i === 0 ? TEAL : G_MID} strokeWidth="4" strokeLinecap="round" />
          </g>
        ))}
      </motion.g>
    </Art>
  );
}

/* ---------------- 2.6c · the coffee machine, one button ---------------- */
function Coffee() {
  return (
    <Art id="nb-coffee">
      <g transform="translate(-10 46) scale(1.5)">
        <rect x="30" y="10" width="190" height="232" rx="16" fill={G_DARK} />
        <rect x="30" y="10" width="182" height="232" rx="16" fill={G_MID} />
        <rect x="46" y="26" width="150" height="66" rx="10" fill="rgba(255,255,255,0.8)" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={76 + i * 45} cy="52" r="15" fill={i === 1 ? TEAL : G_LIGHT} stroke={i === 1 ? '#146f7f' : G_DARK} strokeWidth="2" />
            <rect x={64 + i * 45} y="72" width="24" height="5" rx="2.5" fill={i === 1 ? TEAL : G_MID} />
          </g>
        ))}
        <motion.circle cx="121" cy="52" r="15" fill="none" stroke={TEAL} strokeWidth="3" initial={{ r: 15, opacity: 0.9 }} animate={{ r: [15, 26], opacity: [0.9, 0] }} transition={{ delay: 0.6, duration: 1.6, repeat: Infinity, repeatDelay: 2.4 }} />
        {/* the recipe stays behind a locked panel */}
        <rect x="46" y="102" width="150" height="40" rx="8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeDasharray="5 5" />
        <g transform="translate(110 108)" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round">
          <rect x="0" y="10" width="22" height="16" rx="3" fill="rgba(255,255,255,0.25)" />
          <path d="M4 10V6a7 7 0 0 1 14 0v4" />
        </g>
        <rect x="108" y="150" width="26" height="14" rx="4" fill={G_DARK} />
        <rect x="46" y="222" width="150" height="10" rx="4" fill={G_DARK} />
        <path d="M96 192h50l-5 30h-40z" fill="#fff" stroke={G_DARK} strokeWidth="2" />
        <path d="M146 198c10 0 10 14 0 14" fill="none" stroke={G_DARK} strokeWidth="3" />
        <rect x="100" y="204" width="42" height="14" rx="2" fill={T_SOFT} />
      </g>
      {/* the AI agent, who only sees the button */}
      <g transform="translate(322 40)"><AgentAvatar size={90} /></g>
      <path d="M326 62Q250 6 174 90" stroke={TEAL} strokeWidth="3.5" strokeDasharray="2 8" strokeLinecap="round" fill="none" />
    </Art>
  );
}

/* ---------------- 2.7 · the cook who tastes and tastes again ---------------- */
function Cook() {
  const a = (r: number, deg: number): [number, number] => [320 + r * Math.cos((deg * Math.PI) / 180), 120 + r * Math.sin((deg * Math.PI) / 180)];
  const arc = (from: number, to: number) => {
    const [x1, y1] = a(52, from);
    const [x2, y2] = a(52, to);
    return `M${x1} ${y1}A52 52 0 0 1 ${x2} ${y2}`;
  };
  return (
    <Art id="nb-cook">
      {/* the loop: taste, add, taste again */}
      <g fill="none" stroke={TEAL} strokeWidth="4" strokeLinecap="round">
        <path d={arc(-80, 20)} />
        <path d={arc(40, 140)} />
        <path d={arc(160, 260)} />
      </g>
      {[20, 140, 260].map((d) => {
        const [x, y] = a(52, d);
        return <path key={d} d={`M${x - 6} ${y - 7}l12 7l-12 7z`} fill={TEAL} transform={`rotate(${d + 90} ${x} ${y})`} />;
      })}
      {[-50, 90, 210].map((d, i) => {
        const [x, y] = a(52, d);
        return <circle key={d} cx={x} cy={y} r={i === 1 ? 10 : 8} fill={i === 1 ? TEAL : G_MID} />;
      })}
      {/* the cook */}
      <Figure x={92} y={110} scale={1.75} shirt="#b9c9cf" />
      <path d="M58 138c-10-30 10-42 22-34 4-18 28-18 32 0 12-8 32 4 18 34z" fill="#fff" stroke={G_LIGHT} strokeWidth="2" transform="translate(-6 8)" />
      {/* the pot on the stove */}
      <motion.path d="M205 250c-10-20 10-26 0-46M240 250c-10-20 10-26 0-46M275 250c-10-20 10-26 0-46" stroke={G_LIGHT} strokeWidth="5" strokeLinecap="round" fill="none" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
      <rect x="148" y="288" width="184" height="104" rx="16" fill={G_DARK} />
      <rect x="132" y="304" width="22" height="12" rx="5" fill={G_DEEP} />
      <rect x="326" y="304" width="22" height="12" rx="5" fill={G_DEEP} />
      <rect x="142" y="280" width="196" height="18" rx="9" fill={G_MID} />
      <rect x="156" y="286" width="168" height="8" rx="4" fill={T_SOFT} />
      <rect x="56" y="392" width="330" height="22" rx="6" fill={G_MID} />
      <rect x="66" y="414" width="310" height="44" rx="4" fill={G_DARK} />
      <path d="M110 428h60M250 428h60" stroke={G_MID} strokeWidth="6" strokeLinecap="round" />
      {/* arm and spoon, dipping slowly */}
      <motion.g animate={{ y: [0, 10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M120 218c40-6 70-26 100-40" stroke="#b9c9cf" strokeWidth="16" strokeLinecap="round" fill="none" />
        <circle cx="226" cy="174" r="9" fill="#c98e6a" />
        <path d="M230 172l40 32" stroke={G_DEEP} strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="276" cy="212" rx="14" ry="9" transform="rotate(38 276 212)" fill={TEAL} />
      </motion.g>
    </Art>
  );
}

/* ---------------- 2.7c · the changing-room lockers ---------------- */
function Lockers() {
  const xs = [26, 126, 226, 326];
  return (
    <Art id="nb-lockers">
      <rect x="14" y="76" width="392" height="352" rx="10" fill={G_DEEP} opacity={0.35} />
      {xs.map((x, i) => {
        const open = i === 1;
        return (
          <g key={x}>
            <rect x={x} y="96" width="80" height="312" rx="8" fill={open ? PAPER : G_MID} stroke={open ? TEAL : G_DARK} strokeWidth={open ? 5 : 3} />
            {open ? (
              <>
                {/* inside: a coat on a hook and a bag on the shelf */}
                <path d={`M${x + 12} 134h56`} stroke={G_DARK} strokeWidth="4" strokeLinecap="round" />
                <path d={`M${x + 40} 134v10l-24 18v86h48v-86l-24-18`} fill={G_LIGHT} stroke={G_MID} strokeWidth="2" />
                <rect x={x + 8} y="330" width="64" height="8" fill={G_MID} />
                <rect x={x + 18} y="304" width="44" height="26" rx="6" fill={T_SOFT} />
                {/* door swung open */}
                <path d={`M${x} 96l-44 22v264l44 26z`} fill={TEAL} />
                <circle cx={x - 12} cy="250" r="5" fill="#fff" />
                <rect x={x + 8} y="360" width="64" height="36" rx="5" fill={TEAL} />
                <path d={`M${x + 20} 374h40M${x + 20} 384h26`} stroke="#fff" strokeWidth="4" strokeLinecap="round" />
              </>
            ) : (
              <>
                {[0, 1, 2].map((j) => (
                  <rect key={j} x={x + 22} y={116 + j * 8} width="36" height="3.5" rx="1.7" fill="rgba(255,255,255,0.55)" />
                ))}
                <rect x={x + 56} y="250" width="6" height="34" rx="3" fill={G_DARK} />
                <g transform={`translate(${x + 40} 330)`}>
                  <path d="M-12 -4v-12a12 12 0 0 1 24 0v12" fill="none" stroke={G_DARK} strokeWidth="5" />
                  <rect x="-17" y="-6" width="34" height="26" rx="5" fill={G_DARK} />
                  <circle cx="0" cy="7" r="4" fill={G_LIGHT} />
                </g>
              </>
            )}
          </g>
        );
      })}
      {/* the sweep: dust leaves the one open locker */}
      <motion.g animate={{ x: [0, 14, 0], opacity: [0.9, 0.3, 0.9] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M120 340l-16 14M126 352l-22 6M118 364l-14 4" stroke={G_MID} strokeWidth="4" strokeLinecap="round" />
      </motion.g>
      <rect x="14" y="428" width="392" height="18" rx="6" fill={G_MID} />
    </Art>
  );
}

/* ---------------- 2.7d · the records office ---------------- */
function Records() {
  const spines = [G_DARK, G_MID, G_DARK, G_MID, G_DARK, G_MID];
  return (
    <Art id="nb-records">
      {/* sign */}
      <path d="M230 18v34M370 18v34" stroke={G_DARK} strokeWidth="3" />
      <rect x="200" y="46" width="200" height="50" rx="8" fill={G_DARK} />
      <text x="300" y="80" textAnchor="middle" fontSize="24" fontWeight="700" fill="#fff" fontFamily={SANS}>Records</text>
      {/* the shelves of logbooks */}
      <rect x="20" y="56" width="164" height="290" rx="8" fill={G_DEEP} />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x="28" y={116 + r * 58} width="148" height="6" fill={G_MID} />
          {spines.map((c, i) => (
            <rect key={i} x={34 + i * 23} y={72 + r * 58 + (i % 2) * 4} width="19" height={44 - (i % 2) * 4} rx="2.5" fill={r === 1 && i === 2 ? TEAL : c} />
          ))}
        </g>
      ))}
      {/* the clerk behind the counter */}
      <Figure x={246} y={150} scale={1.3} shirt="#5d7f8c" />
      {/* the counter */}
      <rect x="14" y="340" width="392" height="18" rx="6" fill={G_MID} />
      <rect x="22" y="358" width="376" height="62" rx="4" fill={G_DARK} />
      <text x="100" y="396" textAnchor="middle" fontSize="19" fontWeight="600" fill="#fff" fontFamily={SANS}>logbook</text>
      <text x="324" y="396" textAnchor="middle" fontSize="19" fontWeight="600" fill="#fff" fontFamily={SANS}>notebook</text>
      {/* the small notebook on the counter */}
      <g transform="translate(300 290)">
        <rect x="0" y="0" width="92" height="50" rx="5" fill="#fff" stroke={G_DEEP} strokeWidth="2.5" />
        <path d="M46 0v50" stroke={G_DEEP} strokeWidth="2" />
        <path d="M10 14h26M10 26h20M56 14h26M56 26h16" stroke={G_MID} strokeWidth="4" strokeLinecap="round" />
        <motion.path d="M56 38h24" stroke={TEAL} strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 0.8, 1] }} />
      </g>
      {/* one connection under the counter */}
      <path d="M100 420v22q0 8 8 8h84M324 420v22q0 8-8 8h-84" fill="none" stroke={TEAL} strokeWidth="5" strokeLinecap="round" />
      <rect x="192" y="436" width="36" height="28" rx="6" fill={TEAL} />
    </Art>
  );
}

/* ---------------- 2.7e · the toolbox with a foam insert ---------------- */
function Toolbox() {
  const tool = (i: number, x: number, y: number) => {
    const c = i === 6 ? TEAL : G_MID;
    switch (i) {
      case 0: return <g fill={c}><rect x={x + 33} y={y + 40} width="14" height="86" rx="5" /><path d={`M${x + 20} ${y + 22}a20 20 0 1 1 40 0l-12 10v8h-16v-8z`} /></g>;
      case 1: return <g fill={c}><rect x={x + 34} y={y + 38} width="12" height="92" rx="5" /><rect x={x + 16} y={y + 18} width="48" height="26" rx="5" /></g>;
      case 2: return <g stroke={c} strokeWidth="9" strokeLinecap="round" fill="none"><path d={`M${x + 28} ${y + 124}l12-52M${x + 52} ${y + 124}l-12-52`} /><circle cx={x + 40} cy={y + 52} r="16" fill={c} stroke="none" /></g>;
      case 3: return <g fill={c}><rect x={x + 30} y={y + 70} width="20" height="58" rx="9" /><rect x={x + 37} y={y + 16} width="6" height="58" rx="3" /></g>;
      case 4: return <g><circle cx={x + 40} cy={y + 70} r="34" fill={c} /><circle cx={x + 40} cy={y + 70} r="14" fill={G_DEEP} /><rect x={x + 56} y={y + 98} width="22" height="12" rx="3" fill={c} /></g>;
      case 5: return <g fill={c}><rect x={x + 30} y={y + 50} width="20" height="78" rx="6" /><path d={`M${x + 22} ${y + 18}h36l-8 32h-20z`} /></g>;
      case 6: return <g><circle cx={x + 40} cy={y + 62} r="30" fill={c} /><circle cx={x + 40} cy={y + 62} r="20" fill="#fff" /><path d={`M${x + 40} ${y + 62}l10-12`} stroke={G_DARK} strokeWidth="3.5" strokeLinecap="round" /><rect x={x + 33} y={y + 92} width="14" height="36" rx="5" fill={c} /></g>;
      default: return <g fill={c}><rect x={x + 33} y={y + 62} width="14" height="64" rx="5" /><path d={`M${x + 22} ${y + 18}h36l4 46h-44z`} /></g>;
    }
  };
  return (
    <Art id="nb-toolbox">
      <path d="M130 70v-22a14 14 0 0 1 14-14h132a14 14 0 0 1 14 14v22" fill="none" stroke={G_DARK} strokeWidth="12" strokeLinecap="round" />
      <rect x="14" y="66" width="392" height="372" rx="22" fill={G_DARK} />
      <rect x="28" y="80" width="364" height="344" rx="14" fill={G_DEEP} />
      <rect x="168" y="428" width="84" height="16" rx="6" fill={G_MID} />
      {[0, 1].map((r) =>
        [0, 1, 2, 3].map((c) => {
          const i = r * 4 + c;
          const x = 38 + c * 88;
          const y = 92 + r * 168;
          return (
            <g key={i}>
              <rect x={x} y={y} width="80" height="156" rx="12" fill="#39434d" />
              {i === 6 ? (
                <motion.g animate={{ y: [0, -9, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>{tool(i, x, y + 8)}</motion.g>
              ) : (
                tool(i, x, y + 8)
              )}
            </g>
          );
        }),
      )}
    </Art>
  );
}

/* ---------------- 2.7f · the briefing pack on a clipboard ---------------- */
function Briefing() {
  const bands: { y: number; title: string; icon: ReactNode; tint: string }[] = [
    {
      y: 78,
      title: 'The manual',
      tint: G_LIGHT,
      icon: (
        <g>
          <path d="M0 6h28v34H0z" fill={G_MID} />
          <path d="M28 6h28v34H28z" fill={G_DARK} />
          <path d="M8 16h14M8 24h14M36 16h14M36 24h14" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </g>
      ),
    },
    {
      y: 194,
      title: 'The safety rule',
      tint: T_SOFT,
      icon: (
        <g>
          <path d="M28 0l26 8v18c0 14-10 22-26 28C12 48 2 40 2 26V8z" fill={TEAL} />
          <path d="M16 26l9 9 15-17" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ),
    },
    {
      y: 310,
      title: 'The report form',
      tint: G_LIGHT,
      icon: (
        <g>
          <rect x="6" y="0" width="44" height="54" rx="5" fill="#fff" stroke={G_DARK} strokeWidth="3" />
          <path d="M16 14h24M16 26h24M16 38h14" stroke={G_MID} strokeWidth="4" strokeLinecap="round" />
        </g>
      ),
    },
  ];
  return (
    <Art id="nb-briefing">
      <rect x="54" y="26" width="312" height="432" rx="20" fill={G_DARK} />
      <rect x="72" y="62" width="276" height="378" rx="8" fill={PAPER} />
      <rect x="140" y="12" width="140" height="48" rx="12" fill={G_MID} />
      <rect x="164" y="26" width="92" height="12" rx="6" fill={G_DEEP} />
      {bands.map((b, i) => (
        <motion.g key={b.title} {...pop(0.4 + i * 0.8)}>
          <rect x="88" y={b.y} width="244" height="104" rx="12" fill={b.tint} stroke={i === 1 ? TEAL : G_MID} strokeWidth={i === 1 ? 3.5 : 2} />
          <g transform={`translate(104 ${b.y + 26})`}>{b.icon}</g>
          <circle cx="180" cy={b.y + 28} r="13" fill={i === 1 ? TEAL : G_DARK} />
          <text x="180" y={b.y + 34} textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff" fontFamily={SANS}>{i + 1}</text>
          <text x="200" y={b.y + 34} fontSize="17" fontWeight="700" fill={G_DEEP} fontFamily={SANS}>{b.title}</text>
          <path d={`M180 ${b.y + 58}h130M180 ${b.y + 76}h90`} stroke={i === 1 ? 'rgba(27,138,156,0.5)' : G_MID} strokeWidth="5" strokeLinecap="round" />
        </motion.g>
      ))}
    </Art>
  );
}

/* ---------------- 2.8 · a letter filed under the street, not the person ---------------- */
function Filed() {
  return (
    <Art id="nb-filed">
      {/* the cabinet */}
      <rect x="150" y="30" width="256" height="420" rx="12" fill={G_DARK} />
      {/* top drawer: pulled open, nothing under this name */}
      <rect x="164" y="46" width="228" height="176" rx="8" fill={G_DEEP} />
      <rect x="176" y="136" width="204" height="78" rx="6" fill="#39434d" />
      <rect x="176" y="150" width="204" height="10" fill="#2f3842" />
      <rect x="196" y="58" width="164" height="38" rx="6" fill="#fff" stroke={TEAL} strokeWidth="3" />
      <text x="278" y="84" textAnchor="middle" fontSize="19" fontWeight="700" fill={TEAL} fontFamily={MONO}>Harbor Bridge</text>
      <text x="278" y="196" textAnchor="middle" fontSize="54" fontWeight="700" fill={G_MID} fontFamily={SANS}>?</text>
      {/* second drawer: the note sits here */}
      <rect x="164" y="240" width="228" height="190" rx="8" fill={G_MID} />
      <rect x="224" y="226" width="110" height="34" rx="4" fill={TEAL} transform="rotate(-4 280 243)" />
      <path d="M236 240h80" stroke="#fff" strokeWidth="5" strokeLinecap="round" transform="rotate(-4 280 243)" />
      <rect x="196" y="272" width="164" height="38" rx="6" fill="#fff" stroke={G_DARK} strokeWidth="3" />
      <text x="278" y="298" textAnchor="middle" fontSize="19" fontWeight="700" fill={G_DARK} fontFamily={MONO}>bearing plate</text>
      <rect x="236" y="368" width="84" height="16" rx="8" fill={G_DEEP} />
      {/* Vance, looking in the wrong drawer */}
      <Figure x={72} y={196} scale={1.5} shirt="#6f6a8f" />
      <g transform="translate(110 292)">
        <circle cx="0" cy="0" r="18" fill="#e9f4f6" stroke={G_DEEP} strokeWidth="5" />
        <path d="M12 14l18 18" stroke={G_DEEP} strokeWidth="7" strokeLinecap="round" />
      </g>
      <motion.path d="M118 270C128 200 140 150 164 118" fill="none" stroke={TEAL} strokeWidth="4" strokeLinecap="round" strokeDasharray="3 10" animate={{ strokeDashoffset: [0, -26] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
    </Art>
  );
}

export const NB_ART_B: Record<string, { art: ReactNode; caption: ReactNode }> = {
  '2.5d': { art: <Manual />, caption: <>The inspector keeps the <b>manual</b> open in the truck: the checks in order, write down the decision, and call for help when unsure.</> },
  '2.6b': { art: <Tray />, caption: <>Like one lunch tray, <b>one statement</b> carries the asset row, its neighbours and the closest reports together.</> },
  '2.6c': { art: <Coffee />, caption: <>The AI agent sees <b>one button</b> and its label; the recipe behind it stays hidden in the machine.</> },
  '2.7': { art: <Cook />, caption: <>Like a cook who <b>tastes, adds and tastes again</b>, the agent keeps looping until it needs no more tools.</> },
  '2.7c': { art: <Lockers />, caption: <>Clearing <b>only this lab&apos;s locker</b> leaves everyone else&apos;s belongings alone.</> },
  '2.7d': { art: <Records />, caption: <>The <b>logbook</b> keeps what lasts and the <b>notebook</b> what is happening now, both handled at one counter.</> },
  '2.7e': { art: <Toolbox />, caption: <>The agent gets <b>eight tools</b>, each in its own cut-out, and nothing else fits in the box.</> },
  '2.7f': { art: <Briefing />, caption: <>Before the job the agent gets <b>one briefing pack</b>: the manual, the safety rule and the report form.</> },
  '2.8': { art: <Filed />, caption: <>A note filed under <b>&quot;bearing plate&quot;</b> is not found by asking for <b>&quot;Harbor Bridge&quot;</b>, like a letter filed under the street.</> },
};
