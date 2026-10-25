import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/noto-sans-thai/400.css';
import '@fontsource/noto-sans-thai/600.css';
import '@fontsource/jetbrains-mono/400.css';
import './styles.css';

/**
 * public/sw.js keeps the ~50 MB map on the device after the first visit (through the tunnel it took about a
 * minute every time). Wait up to 2 s for it to take charge, so even the first visit's download is kept.
 * Needs https or localhost; anywhere else the app simply loads as before.
 */
async function keepMapOnDevice() {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  try {
    await navigator.serviceWorker.register('./sw.js');
    if (navigator.serviceWorker.controller) return;
    await Promise.race([
      new Promise((r) => navigator.serviceWorker.addEventListener('controllerchange', r, { once: true })),
      new Promise((r) => setTimeout(r, 2000)),
    ]);
  } catch {
    /* no service worker: the map downloads as before */
  }
}

void keepMapOnDevice().finally(() =>
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  ),
);
