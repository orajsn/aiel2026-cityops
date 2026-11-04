import { useEffect, useMemo } from 'react';
import { joinUrl, qrPath, useFollowStore } from '../engine/follow';

/**
 * The join card (owner, 3 Nov): a big QR and the 6-digit code over the stage, so the room can open the follow page on their phones.
 * Click it or press Esc to put it away; Settings › Phone follow brings it back.
 */
export function FollowCard() {
  const code = useFollowStore((s) => s.code);
  const card = useFollowStore((s) => s.card);
  const listeners = useFollowStore((s) => s.listeners);
  const showCard = useFollowStore((s) => s.showCard);
  useEffect(() => {
    if (!card) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        showCard(false);
      }
    };
    window.addEventListener('keydown', k, true);
    return () => window.removeEventListener('keydown', k, true);
  }, [card, showCard]);
  const url = code ? joinUrl(code) : '';
  const qr = useMemo(() => (url ? qrPath(url) : null), [url]);
  if (!card || !code || !qr) return null;
  const pretty = `${code.slice(0, 3)} ${code.slice(3)}`;
  return (
    <div className="follow-card" role="dialog" aria-label="Follow on your phone" onClick={() => showCard(false)}>
      <div className="follow-card__box">
        <div className="follow-card__kicker">Follow on your phone</div>
        <svg className="follow-card__qr" viewBox={`-2 -2 ${qr.n + 4} ${qr.n + 4}`} shapeRendering="crispEdges" role="img" aria-label="QR code to join">
          <rect x="-2" y="-2" width={qr.n + 4} height={qr.n + 4} fill="#fff" />
          <path d={qr.d} fill="#0b1016" />
        </svg>
        <div className="follow-card__code" data-follow-code>{pretty}</div>
        {/* a real link with the code in it (owner, 4 Nov); the click opens it and leaves the card up */}
        <a className="follow-card__url" href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          {url.replace(/^https?:\/\//, '').replace(/\?c=\d+$/, '')}
        </a>
        <div className="follow-card__n">{listeners > 0 ? `${listeners} watching` : 'Scan, or type the code'}</div>
      </div>
    </div>
  );
}
