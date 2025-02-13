import 'buffer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// Polyfill Buffer and process
if (typeof window !== 'undefined') {
  window.global = window;
  window.Buffer = window.Buffer || require('buffer').Buffer;
  window.process = window.process || require('process');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
