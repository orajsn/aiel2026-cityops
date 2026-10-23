import { City } from './City';
import { Lighting } from './Lighting';
import { Effects } from './Effects';

export function World() {
  return (
    <>
      <fogExp2 attach="fog" args={['#0B0E14', 0.0021]} />
      <Lighting />
      <City />
      <Effects />
    </>
  );
}
