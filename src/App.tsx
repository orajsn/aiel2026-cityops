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
import { loadOverrides, useCameraStore } from './engine/camera';
import { loadTraffic, useTrafficStore } from './engine/traffic';
import { setTrafficMode } from './overlay/TrafficEditor';

export default function App() {
  useEffect(() => {
    useSceneStore.getState().setScenes(SCENES);
    void loadOverrides();
    void loadTraffic();
    const ui = useUiStore.getState();
    const unHash = bindHash(useSceneStore);
    const unKeys = bindKeys(useSceneStore, {
      jump: () => ui.toggleJump(),
      notes: () => ui.toggleNotes(),
      lang: () => ui.toggleLang(),
      theme: () => ui.toggleTheme(),
      script: () => ui.toggleScript(),
      camera: () => (useTrafficStore.getState().editing ? setTrafficMode(false) : useCameraStore.getState().setEditing(!useCameraStore.getState().editing)),
      traffic: () => setTrafficMode(!useTrafficStore.getState().editing),
      isEditing: () => useCameraStore.getState().editing,
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
          camera={{ position: [10, 150, 170], fov: 45, near: 0.1, far: 4000 }}
          style={{ position: 'absolute', inset: 0 }}
          // dev only: lets a verification script render full-size captures from any camera
          onCreated={(state) => {
            if (import.meta.env.DEV) (window as unknown as { __r3f: unknown }).__r3f = state;
          }}
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
