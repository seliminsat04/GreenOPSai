import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enregistrement du Service Worker pour la résilience hors-ligne d'Opalia Pharma Recordati
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('GreenOpsAI Service Worker enregistré avec succès sur le périmètre :', registration.scope);
      })
      .catch((error) => {
        console.error('Échec de l\'enregistrement du Service Worker d\'Opalia :', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

