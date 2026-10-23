import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { quality } from '../engine/quality';
import { useUiStore } from '../engine/ui';

export function Effects() {
  const theme = useUiStore((s) => s.theme);
  if (!theme.bloom || quality() !== 'high') return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.8} luminanceThreshold={0.6} luminanceSmoothing={0.25} mipmapBlur />
      <Vignette eskil={false} offset={0.25} darkness={0.55} />
    </EffectComposer>
  );
}
