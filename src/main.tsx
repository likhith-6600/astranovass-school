import React from 'react';
import ReactDOM from 'react-dom/client';
import { SkoolaApp } from './SkoolaApp';
import './styles/skoola.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <SkoolaApp />
    </React.StrictMode>
  );
}
