import { Canvas } from '@react-three/fiber';
import { World } from './world/World';

export default function App() {
  return (
    <div id="app">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 160, 260], fov: 45, near: 0.5, far: 4000 }}
        style={{ position: 'fixed', inset: 0, background: '#0B0E14' }}
      >
        <color attach="background" args={['#0B0E14']} />
        <World />
      </Canvas>
      <div id="overlay" />
    </div>
  );
}
