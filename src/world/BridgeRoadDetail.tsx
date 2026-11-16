import { useMemo } from 'react';
import * as THREE from 'three';
import { harborBridgeFrame, fromBridgeLocal, bridgeDeckHeight } from './bridgeFrame';

/** Edge paint only: the mapped single-lane road has no two-lane centreline. */
export function BridgeRoadDetail() {
  const root = useMemo(() => {
    const group = new THREE.Group();
    const frame = harborBridgeFrame();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const paint = new THREE.MeshStandardMaterial({ color: '#e8e2d0', roughness: 1 });
    for (const side of [-1, 1]) {
      for (let x = -frame.half + 0.025; x < frame.half - 0.02; x += 0.05) {
        const point = fromBridgeLocal(x, side * 0.145);
        const mesh = new THREE.Mesh(geometry, paint);
        mesh.position.set(point.x, (bridgeDeckHeight(point.x, point.z) ?? 0.04) + 0.003, point.z);
        mesh.rotation.y = frame.yaw;
        mesh.scale.set(0.052, 0.004, 0.008);
        group.add(mesh);
      }
    }
    return group;
  }, []);
  return <primitive object={root} />;
}
