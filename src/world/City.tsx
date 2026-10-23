import { Component, Suspense, type ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import { ProceduralCity } from './ProceduralCity';
import { KitCity } from './KitCity';

/** An optional whole-city GLB (plan Task 5). null = kit city built from Kenney models. */
export const CITY_MODEL_URL: string | null = null;

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function GltfCity({ url }: { url: string }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} name="gltf-city" />;
}

/**
 * The city. Kit models (or a whole-city GLB when configured) with the procedural
 * box city as the fallback while loading or if any model fails.
 */
export function City({ model = CITY_MODEL_URL }: { model?: string | null }) {
  return (
    <Boundary fallback={<ProceduralCity />}>
      <Suspense fallback={<ProceduralCity />}>{model ? <GltfCity url={model} /> : <KitCity />}</Suspense>
    </Boundary>
  );
}
