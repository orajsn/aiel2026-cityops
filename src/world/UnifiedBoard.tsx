import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { DataShape } from './DataShapes';
import { BOARD_DEPTH, HEADER_H, boardPoint, fitShapeIn } from './answerBoard';
import { cardGeometry } from './BridgeQuestion';
import { UNIFIED_PANELS } from './skyPlaces';
import { SHOTS } from './shots';

const PAD = 0.03;

/**
 * Lab 2 page 6 · the four shapes the unified query returns, each on its own panel between the database and
 * the model (the beams and the brief are drawn by the UnifiedQuery overlay). Each panel grows in as its
 * part of the query arrives; framed from the sky camera, outside the stage's grow-in.
 */
export function UnifiedBoard({ t }: { t: number }) {
  const facing = useMemo(() => {
    const c = SHOTS.sky;
    const m = new THREE.Matrix4().lookAt(new THREE.Vector3(...c.position), new THREE.Vector3(...c.target), new THREE.Vector3(0, 1, 0));
    return new THREE.Quaternion().setFromRotationMatrix(m);
  }, []);
  const panels = useMemo(
    () =>
      UNIFIED_PANELS.map((p) => {
        const d = BOARD_DEPTH + 1.2;
        const card = cardGeometry([boardPoint(p.x0, p.y1, d), boardPoint(p.x1, p.y1, d), boardPoint(p.x1, p.y0, d), boardPoint(p.x0, p.y0, d)]);
        const fit = fitShapeIn(p.kind, { x0: p.x0 + PAD, x1: p.x1 - PAD, y0: p.y0 + PAD, y1: p.y1 - HEADER_H }, (x, y) => boardPoint(x, y));
        return { ...p, card, fit };
      }),
    [],
  );
  useEffect(() => () => panels.forEach((p) => p.card.dispose()), [panels]);
  return (
    <group name="unified-board">
      {panels.map((p, i) => {
        // the part arrives 1.6 s in, one after another
        const k = Math.max(0.001, ease((t - 1600 - i * 250) / 500));
        return (
          <group key={p.kind}>
            <mesh geometry={p.card} renderOrder={1}>
              <meshBasicMaterial color="#f7f5f1" transparent opacity={0.96 * k} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
            </mesh>
            <group position={p.fit.origin} quaternion={facing} scale={p.fit.scale * k}>
              <DataShape kind={p.kind} lit={p.kind !== 'vectors'} title={false} story search={t > 2400 + i * 250} />
            </group>
          </group>
        );
      })}
    </group>
  );
}

const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - c, 3);
};
