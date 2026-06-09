const CACHE_NAME = 'greenops-opalia-v1';
const OFFLINE_FALLBACK_URL = '/index.html';

// Asset lists to cache initially (Precaching static assets that we know exist)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  'https://www.keejob.com/media/recruiter/recruiter_151/logo-opalia-pharma-recordati-group-20160202-085534.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;750&family=Space+Grotesk:wght@400;550;700&family=JetBrains+Mono:wght@400;700&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache primary documents and external branding resources
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-cache warning: some static assets could not be cached immediately. Dynamic cache will capture them.', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache Service Worker :', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Dynamic cache strategy: Network First with Cache Fallback for documents and assets.
// Stale-While-Revalidate for script/stylesheet assets.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Avoid intercepting Chrome Extensions, non-GET or browser internals
  if (req.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Ne pas intercepter les requêtes de développement (Vite, sources typescript, modules, rechargement à chaud)
  if (
    url.hostname.includes('localhost') || 
    url.hostname.includes('127.0.0.1') ||
    url.pathname.includes('/src/') || 
    url.pathname.includes('@vite') || 
    url.pathname.includes('node_modules') ||
    url.search.includes('v=')
  ) {
    return;
  }

  // Handle API chat requests offline fallback
  if (url.pathname.startsWith('/api/gemini/chat')) {
    event.respondWith(
      fetch(req).catch(() => {
        // Offer a premium pre-compiled offline expert advisory
        const offlineChatResponse = {
          response: "**[Mode Hors-ligne - Assistant de Secours de l'Usine]**\n\n⚠️ Votre connexion réseau avec le serveur de l'usine d'Opalia Recordati Tunis est temporairement instable. \n\n* **Données préservées** : Vos relevés manuels saisis restent consultables et modifiables en toute sécurité sur cette tablette/ordinateur. Ils sont stockés localement grâce à la synchronisation hors-ligne.\n* **Recommandation** : Continuez les relevés d'armoires électriques. Les diagnostics énergétiques basés sur de l'IA reprendront dès la reconnexion."
        };
        return new Response(JSON.stringify(offlineChatResponse), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Strategy for normal static assets: Stale-While-Revalidate
  // This loads from cache instantly while refetching in background for maximum speed in Tunisian warehouse environments.
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in the background and update the cache dynamically
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, networkResponse);
            });
          }
        }).catch(() => {/* Ignore background sync failures */});
        
        return cachedResponse;
      }

      // If not in cache, fallback to network and dynamically cache
      return fetch(req).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, responseToCache);
        });

        return networkResponse;
      }).catch((err) => {
        // Fallback for HTML documents when completely offline
        if (req.mode === 'navigate') {
          return caches.match(OFFLINE_FALLBACK_URL);
        }
        throw err;
      });
    })
  );
});
