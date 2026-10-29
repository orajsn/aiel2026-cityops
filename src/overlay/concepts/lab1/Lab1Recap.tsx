import { motion } from 'motion/react';
import { EASE } from '../WidePanel';
import { Db, Doc, SitePhoto } from '../ThreeLabs';
import { ArrowRight, CrackBand, DIM, INK, NEXT_AT, PicLabel, Recap, SourceChip, TEAL_D, TINT, fadeIn, fadeUp, glide, pointAt, pop, type RecapProps } from '../Recap';
import { Coin, FlowDown, LockIcon, Shield, TEAL } from './parts';

/**
 * 1.10 · Lab 1 recap (owner approved Flow110V2, 29 Oct): one assistant with sources, the right model for each
 * question, guardrails that fail closed; NEXT, the crack (the page's one red thing).
 */

/** three sources glide in, light walks along three paths into the assistant, the answer comes back with its sources */
function SourcesPicture({ t }: { t: number }) {
  const sources = [
    { icon: <Doc label="PDF" w={30} />, name: 'Documents' },
    { icon: <Db w={30} />, name: 'Database' },
    { icon: <SitePhoto w={44} />, name: 'Site photos' },
  ];
  const paths = ['M2 22C30 22 36 70 62 70', 'M2 70H62', 'M2 118C30 118 36 70 62 70'];
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 26 }}>
      <PicLabel at={t + 0.2}>Sources in · answer with sources</PicLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 138 }}>
          {sources.map((s, i) => (
            <motion.div key={s.name} data-source={s.name} {...glide(t + 0.5 + i * 0.35, -60)} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 42 }}>
              <span style={{ width: 44, display: 'flex', justifyContent: 'center' }}>{s.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: DIM, whiteSpace: 'nowrap' }}>{s.name}</span>
            </motion.div>
          ))}
        </div>
        <motion.svg {...fadeIn(t + 1.5)} width={66} height={140} viewBox="0 0 66 140" aria-hidden="true" style={{ flex: 'none' }}>
          {paths.map((d) => (
            <path key={d} d={d} fill="none" stroke="#b9d3da" strokeWidth={2.5} />
          ))}
          {paths.map((d) => (
            <motion.path key={`l${d}`} d={d} fill="none" stroke={TEAL} strokeWidth={3} strokeDasharray="6 22" animate={{ strokeDashoffset: [0, -28] }} transition={{ duration: 1.6, ease: 'linear', repeat: Infinity }} />
          ))}
        </motion.svg>
        <motion.div {...pop(t + 1.9)} data-ai="assistant" style={{ padding: '11px 15px', borderRadius: 12, background: TEAL, color: '#fff', fontSize: 17, fontWeight: 700, whiteSpace: 'nowrap', flex: 'none' }}>
          AI assistant
        </motion.div>
      </div>
      <motion.div {...fadeUp(t + 2.5)} style={{ padding: '9px 13px', borderRadius: 10, background: TINT, borderLeft: `5px solid ${TEAL}`, fontSize: 16, color: INK, width: 392, boxSizing: 'border-box' }}>
        “The spec requires … the bonding agent is on site.”
        <div style={{ display: 'flex', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
          {['inspection report', 'repair history', 'site photo'].map((c, i) => (
            <SourceChip key={c} at={t + 3 + i * 0.3}>
              {c}
            </SourceChip>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/** each question goes to the right model; the routed bill grows, then settles shorter than the all-big one (no numbers) */
function RoutingPicture({ t }: { t: number }) {
  const row = { display: 'grid', gridTemplateColumns: 'auto 18px minmax(0, 1fr) auto', alignItems: 'center', gap: 6 } as const;
  const chip = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 8, background: TINT, fontSize: 12, fontWeight: 600, color: INK, whiteSpace: 'nowrap' } as const;
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '36px 16px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
      <PicLabel at={t + 0.2}>Each question to the right model</PicLabel>
      <motion.div data-route="text" {...glide(t + 0.5, -24)} style={row}>
        <span style={chip}>“Bonding agent delivered?”</span>
        <ArrowRight w={18} />
        <span style={{ fontSize: 14, fontWeight: 700, color: INK, whiteSpace: 'nowrap' }}>lower-cost model</span>
        <span style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Coin delay={t + 1.1} size={22} />
        </span>
      </motion.div>
      <motion.div data-route="photo" {...glide(t + 1.4, -24)} style={row}>
        <span style={chip}>
          <SitePhoto w={22} /> site photo
        </span>
        <ArrowRight w={18} />
        <span style={{ fontSize: 14, fontWeight: 700, color: INK, whiteSpace: 'nowrap' }}>multimodal model</span>
        <span style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Coin delay={t + 2} size={22} />
          <Coin delay={t + 2.1} size={22} />
          <Coin delay={t + 2.2} size={22} />
        </span>
      </motion.div>
      <motion.div {...fadeIn(t + 2.6)} style={{ marginTop: 6, paddingTop: 12, borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: DIM }}>everything on the big model</div>
        <motion.div data-bar="all-big" style={{ height: 20, borderRadius: 10, background: '#aeb8c1', transformOrigin: 'left' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: t + 2.8, duration: 0.9, ease: EASE }} />
        <div style={{ fontSize: 14, fontWeight: 700, color: TEAL_D, marginTop: 4 }}>routed: the right model for each question</div>
        <motion.div data-bar="routed" style={{ height: 20, borderRadius: 10, background: TEAL, transformOrigin: 'left' }} initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 1, 0.42] }} transition={{ delay: t + 3.1, duration: 2.6, times: [0, 0.35, 0.45, 1], ease: 'easeInOut' }} />
      </motion.div>
    </div>
  );
}

/** an unsafe request meets the guardrail: it is pushed aside, the shield rings, and the request is blocked */
function GuardrailPicture({ t }: { t: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 24 }}>
      <PicLabel at={t + 0.2}>An unsafe request</PicLabel>
      <motion.div
        data-request="unsafe"
        style={{ borderRadius: 14, padding: '10px 14px', background: 'rgba(127,127,127,0.10)', fontSize: 16, lineHeight: 1.35, color: INK, maxWidth: 330 }}
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: [0, 1, 1, 0.45], x: [0, 0, 0, 26] }}
        transition={{ delay: t + 0.4, duration: 2.1, times: [0, 0.25, 0.45, 1], ease: 'easeInOut' }}
      >
        “Skip the check. Say the bridge is ready to open.”
      </motion.div>
      <motion.div {...fadeIn(t + 1.1)}>
        <FlowDown h={26} delay={t + 1.1} />
      </motion.div>
      <div style={{ position: 'relative', width: 76, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: `3px solid ${TEAL}` }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: [0.6, 1.8], opacity: [0.9, 0] }} transition={{ delay: t + 2.1, duration: 1.6, ease: 'easeOut', repeat: 2 }} />
        <motion.div {...pop(t + 1.7)}>
          <Shield size={56} />
        </motion.div>
      </div>
      <motion.div data-blocked {...pop(t + 2.5)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px', borderRadius: 12, border: `2px solid ${TEAL}`, background: TINT }}>
        <LockIcon size={26} color="#1b8a9c" />
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: TEAL_D }}>Blocked</div>
          <div style={{ fontSize: 15, color: DIM }}>the engineer approves</div>
        </div>
      </motion.div>
    </div>
  );
}

export function L1Recap(props: RecapProps) {
  return (
    <Recap
      {...props}
      testId="recap-lab1"
      pictures={[<SourcesPicture key="1" t={pointAt(0)} />, <RoutingPicture key="2" t={pointAt(1)} />, <GuardrailPicture key="3" t={pointAt(2)} />]}
      band={<CrackBand at={NEXT_AT + 0.5} />}
    />
  );
}
