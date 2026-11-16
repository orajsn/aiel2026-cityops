import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { World } from './world/World';
import { SHOTS } from './world/shots';
import { Overlay } from './overlay/Overlay';
import { Stage, useRenderDpr } from './Stage';
import { useSceneStore } from './engine/store';
import { useUiStore } from './engine/ui';
import { bindHash } from './engine/hash';
import { bindKeys } from './engine/keys';
import { SCENES } from './scenes';
import { loadOverrides, useCameraStore } from './engine/camera';
import { loadTraffic, useTrafficStore } from './engine/traffic';
import { setTrafficMode } from './overlay/TrafficEditor';
import { fixedDpr, antialiasFor, useGraphicsStore } from './engine/graphics';
import { usePresentationStore } from './engine/presentation';
import { QUALITY, useQualityStore } from './engine/quality';

export default function App() {
  // Settings › Graphics: Auto draws what the screen shows, a fixed resolution draws exactly that
  const autoDpr = useRenderDpr();
  const fixed = useGraphicsStore((s) => fixedDpr(s.resolution, s.custom));
  const preset = useQualityStore(s => s.preset);
  const dpr = fixed ?? Math.min(autoDpr, QUALITY[preset].autoCap);
  const aa = antialiasFor();
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
      traffic: () => {}, // Senayan traffic follows the authored road network.
      isEditing: () => useCameraStore.getState().editing,
      presenting: () => usePresentationStore.getState().on,
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
          key={`renderer-aa-${aa}`}
          shadows
          // the stage is CSS-scaled: Auto draws only the pixels the screen really shows (Stage.tsx)
          dpr={dpr}
          // A changed AA policy recreates the renderer; resolution alone only resizes it.
          gl={{ antialias: aa, powerPreference: 'high-performance' }}
          // starts at the city shot, close over the city (owner, 2 Nov: no flight in from far away where the map floats); CameraRig then cuts to the page's own camera
          camera={{ position: SHOTS.city.position, fov: 45, near: 0.1, far: 4000 }}
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
