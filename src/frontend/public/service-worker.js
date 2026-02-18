const CACHE_NAME = 'credential-manager-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/generated/app-icon-192.png',
  '/assets/generated/app-icon-512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network-first strategy with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // CRITICAL: Never cache APK downloads or any requests to /downloads/app.apk
  // This ensures users always get the latest APK after redeploy
  // Match /downloads/app.apk with or without query parameters (cache-busting)
  // Also handle HEAD and Range requests for APK validation
  if (url.pathname === '/downloads/app.apk' || url.pathname.includes('/downloads/app.apk')) {
    // Always fetch from network, never cache, pass through all headers
    event.respondWith(
      fetch(request, { 
        cache: 'no-store',
        // Preserve all request headers including Range for byte-range requests
        headers: request.headers,
      }).catch(() => {
        // If network fails, return a helpful error response
        return new Response('APK download unavailable - network error', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      })
    );
    return;
  }

  // For all other requests: network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response before caching
        const responseToCache = response.clone();
        
        // Only cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If not in cache either, return offline page or error
          return new Response('Offline - resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});
