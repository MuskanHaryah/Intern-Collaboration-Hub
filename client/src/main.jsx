import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global error handler
window.addEventListener('error', (event) => {
  console.error('❌ [Global Error]', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ [Unhandled Promise Rejection]', event.reason);
});

console.log('🚀 [main.jsx] Starting application...');
console.log('🔍 [main.jsx] Root element:', document.getElementById('root'));

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('❌ [main.jsx] Root element not found!');
    document.body.innerHTML = '<div style="padding: 20px; color: red;">ERROR: Root element not found</div>';
  } else {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('✅ [main.jsx] App rendered successfully');
  }
} catch (error) {
  console.error('❌ [main.jsx] Error rendering app:', error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;">ERROR: ${error.message}</div>`;
}
