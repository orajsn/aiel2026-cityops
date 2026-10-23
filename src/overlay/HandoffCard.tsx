import type { HandoffCard as Card } from '../engine/types';

export function HandoffCard({ card }: { card: Card }) {
  return (
    <div className="handoff" role="dialog" aria-label="hand-off to the notebook">
      <div className="handoff__inner">
        <div className="handoff__kicker">Now run</div>
        <div className="handoff__run">{card.run}</div>
        <div className="handoff__expect">
          <span className="ok">✔</span> {card.expect}
        </div>
        {card.then && (
          <div className="handoff__then">
            <b>When it finishes:</b> {card.then}
          </div>
        )}
        <div className="handoff__pill">{card.minutes}</div>
      </div>
    </div>
  );
}
