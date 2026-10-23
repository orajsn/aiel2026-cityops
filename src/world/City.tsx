import { Component, Suspense, type ReactNode } from 'react';
import { KitCity } from './KitCity';

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error('Bangkok map failed to load', error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The city: the owner's TerraMesh map. Nothing is drawn while it downloads (the overlay shows
 * the loading progress); the old generated box city is never used as a stand-in.
 */
export function City() {
  return (
    <Boundary>
      <Suspense fallback={null}>
        <KitCity />
      </Suspense>
    </Boundary>
  );
}
