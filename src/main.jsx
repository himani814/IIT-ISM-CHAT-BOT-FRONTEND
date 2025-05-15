import React from 'react';
import './index.css';

import { createRoot } from 'react-dom/client';
import App from './App.jsx';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');

  if (rootElement) {
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
          <App />
      </React.StrictMode>
    );
  } else {
    console.error('Error: root element not found');
  }
});