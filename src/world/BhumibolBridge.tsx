import { Component, Suspense, useMemo, type ReactNode } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import url from '../assets/models/bhumibol.glb?url';
import { BRIDGE, harborBridgeFrame } from './bridgeFrame';

/**
 * The Bhumibol Bridge (owner, 28 Oct: from the owner's SketchUp model, converted to glTF, cut down to the
 * cable-stayed section: no ground photos, no edge lines, no 1.5 km approach). In the file the origin is midway
 * between the towers, the deck runs along +x from the west tower to the east, and units are metres.
 *
 * Scaled evenly (never stretched) so its towers stand where Harbor Bridge's towers stand, in the water off each
 * bank: about 0.42 of real size, as the river at the Taksin crossing is narrower than the Bhumibol's main span.
 */
export const BHUMIBOL = {
  /** each tower's distance from the middle, measured on the model (337.4 m apart) */
  towerM: 168.7,
  /** the tower tops */
  towerTopM: 148.7,
  /** world units per model metre: the towers onto Harbor Bridge's tower piers */
  scale: (BRIDGE.piers[BRIDGE.pylonPiers[1]] - BRIDGE.piers[BRIDGE.pylonPiers[0]]) / (2 * 168.7),
  /** the middle between those piers, along the bridge (bridge-local world units) */
  x: (BRIDGE.piers[BRIDGE.pylonPiers[0]] + BRIDGE.piers[BRIDGE.pylonPiers[1]]) / 2,
};

function Model() {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      // SketchUp faces are often wound the wrong way round: draw both sides so none goes missing
      (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => (mat.side = THREE.DoubleSide));
    });
    return scene;
  }, [scene]);
  return <primitive object={model} position={[BHUMIBOL.x, 0, 0]} scale={BHUMIBOL.scale} />;
}

/** a model that fails to load leaves only itself out, never the city around it */
class Guard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error('Bhumibol Bridge model failed to load', error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** in the bridge's own frame over the Taksin crossing, loaded on its own so the city never waits for it */
export function BhumibolBridge() {
  const f = useMemo(() => harborBridgeFrame(), []);
  return (
    <group name="bhumibol-bridge" position={[f.x, 0, f.z]} rotation={[0, f.yaw, 0]}>
      <Guard>
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Guard>
    </group>
  );
}
