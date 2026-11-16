import { Component, Suspense, type ReactNode } from 'react';
import { KitCity } from './KitCity';

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error('Senayan scene failed to load', error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** The locally bundled Senayan district and its lesson interactions. */
export function City() {
  return (
    <Boundary>
      <Suspense fallback={null}>
        <KitCity />
      </Suspense>
    </Boundary>
  );
}
