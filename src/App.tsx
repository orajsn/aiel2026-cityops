import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { World } from './world/World';
import { Overlay } from './overlay/Overlay';
import { useSceneStore } from './engine/store';
import { useUiStore } from './engine/ui';
import { bindHash } from './engine/hash';
import { bindKeys } from './engine/keys';
import { SCENES } from './scenes';

export default function App() {
  useEffect(() => {
    useSceneStore.getState().setScenes(SCENES);
    const ui = useUiStore.getState();
    const unHash = bindHash(useSceneStore);
    const unKeys = bindKeys(useSceneStore, {
      jump: () => ui.toggleJump(),
      notes: () => ui.toggleNotes(),
      lang: () => ui.toggleLang(),
    });
    return () => {
      unHash();
      unKeys();
    };
  }, []);

  return (
    <div id="app">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [10, 150, 170], fov: 45, near: 0.5, far: 4000 }}
        style={{ position: 'fixed', inset: 0, background: '#0B0E14' }}
      >
        <color attach="background" args={['#0B0E14']} />
        <World />
      </Canvas>
      <div id="overlay">
        <Overlay />
      </div>
    </div>
  );
}
