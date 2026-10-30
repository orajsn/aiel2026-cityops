import type { ReactNode } from 'react';
import { LineIcon } from '../icons';

/** a plain stand-in until a page's own picture is drawn */
export const NB_ART_FALLBACK: { art: ReactNode; caption: ReactNode } = {
  art: (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LineIcon name="prompt" size={160} />
    </div>
  ),
  caption: 'the everyday picture comes here',
};
