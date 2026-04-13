import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import WebApp from '@twa-dev/sdk';
import App from './App.tsx';
import 'katex/dist/katex.min.css';
import './index.css';

// 1. Initialize Telegram SDK (it automatically reads the hash upon import)
WebApp.ready();

// 2. Fix for Telegram Web App + HashRouter conflict on GitHub Pages:
// Telegram puts its initialization data in the URL hash (e.g., #tgWebAppData=...)
// HashRouter will crash because it thinks this is a page route.
// Solution: Clear the hash AFTER Telegram reads it, but BEFORE React Router starts.
if (window.location.hash.includes('tgWebAppData')) {
  window.location.hash = '';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
