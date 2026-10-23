import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { World } from './world/World';
import { Overlay } from './overlay/Overlay';
import { Stage } from './Stage';
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
      theme: () => ui.toggleTheme(),
    });
    return () => {
      unHash();
      unKeys();
    };
  }, []);

  return (
    <Stage>
      <div id="app">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ position: [10, 150, 170], fov: 45, near: 0.5, far: 4000 }}
          style={{ position: 'absolute', inset: 0 }}
          resize={{ offsetSize: true, scroll: false, debounce: { scroll: 50, resize: 0 } }}
          events={(store) => ({
            ...store.getState().events,
            // the stage is CSS-scaled: map pointer position through the scaled rect
            compute: (event, state) => {
              const rect = state.gl.domElement.getBoundingClientRect();
              state.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
              state.raycaster.setFromCamera(state.pointer, state.camera);
            },
          })}
        >
          <World />
        </Canvas>
        <div id="overlay">
          <Overlay />
        </div>
      </div>
    </Stage>
  );
}
