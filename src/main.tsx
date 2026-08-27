// Fix for "TypeError: Cannot set property fetch of #<Window> which has only a getter"
// usually caused by libraries trying to polyfill fetch globally.
if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  try {
    Object.defineProperty(window, 'fetch', {
      value: originalFetch,
      writable: true,
      configurable: true,
    });
  } catch (e) {
    console.warn('Could not make window.fetch writable', e);
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
