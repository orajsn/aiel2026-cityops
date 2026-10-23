export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <hemisphereLight args={['#22303f', '#0B0E14', 0.5]} />
      <directionalLight position={[120, 220, 80]} intensity={0.9} color="#cfe0f5" />
    </>
  );
}
