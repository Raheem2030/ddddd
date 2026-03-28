import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import WebApp from '@twa-dev/sdk';
import App from './App.tsx';
import './index.css';

// إخبار تيليجرام أن التطبيق جاهز تماماً للعرض
WebApp.ready();
// إجبار التطبيق على التوسع لملء كامل الشاشة فوراً
WebApp.expand();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
