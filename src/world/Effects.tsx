import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useQualityStore } from '../engine/quality';
import { useUiStore } from '../engine/ui';

export function Effects() {
  const theme = useUiStore(s => s.theme);
  const preset = useQualityStore(s => s.preset);
  if (!theme.bloom || preset !== 'high') return null;
  return <EffectComposer multisampling={0}>
    <Bloom intensity={.24} luminanceThreshold={1.05} luminanceSmoothing={.2} mipmapBlur />
  </EffectComposer>;
}
