import { Component, Suspense, type ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import { ProceduralCity } from './ProceduralCity';

/** Set by the city model pipeline (plan Task 5). null = procedural city only. */
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

export function City({ model = CITY_MODEL_URL }: { model?: string | null }) {
  if (!model) return <ProceduralCity />;
  return (
    <Boundary fallback={<ProceduralCity />}>
      <Suspense fallback={<ProceduralCity />}>
        <GltfCity url={model} />
      </Suspense>
    </Boundary>
  );
}
