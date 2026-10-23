import { Html } from '@react-three/drei';
import type { Asset } from '../content/geo';
import { pinColor } from './pinColors';

export function PinCardBody({ asset }: { asset: Asset }) {
  const c = pinColor(asset.type);
  return (
    <div className="pin-card" style={{ borderColor: c }}>
      <div className="pin-card__name mono">{asset.id}</div>
      <div className="pin-card__meta">
        <span style={{ color: c }}>{asset.type}</span>
        <span>{asset.district}</span>
      </div>
      <div className="pin-card__crit" aria-label={`criticality ${asset.criticality} of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <i key={n} data-dot className={n <= asset.criticality ? 'filled' : ''} />
        ))}
      </div>
      <dl className="pin-card__specs mono">
        {Object.entries(asset.specs).map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{String(v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function PinCard({ asset, position }: { asset: Asset; position: [number, number, number] }) {
  return (
    <Html position={position} center={false} distanceFactor={undefined} zIndexRange={[50, 0]} style={{ pointerEvents: 'none' }}>
      <PinCardBody asset={asset} />
    </Html>
  );
}
