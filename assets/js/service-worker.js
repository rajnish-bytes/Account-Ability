// Account Ability Network - Service Worker
// Version 1.0

// Cache name - increment version when making changes to force cache update
const CACHE_NAME = 'account-ability-cache-v1';

// Assets to cache immediately during installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/thank-you.html',
  '/offline.html',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/js/utils.js',
  '/assets/js/forms.js',
  '/assets/js/parallax.js',
  '/assets/js/animations.js',
  // Font Awesome and Google Fonts are served from CDNs and are handled separately
];

// Install event - precache essential assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');

  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();

  // Precaching essential assets
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .catch(error => {
        console.error('[Service Worker] Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Service Worker Activated');
        // Claim clients to control all open tabs
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip some URLs that shouldn't be cached
  const url = new URL(event.request.url);

  // Don't cache analytics, chrome extensions, etc.
  if (
    url.hostname.includes('google-analytics.com') ||
    url.hostname.includes('analytics') ||
    url.hostname.includes('chrome-extension')
  ) {
    return;
  }

  // Cache-first for assets, network-first for HTML
  const isAsset = /(\.js|\.css|\.woff2?|\.ttf|\.png|\.jpe?g|\.gif|\.svg|\.ico)$/i.test(url.pathname);

  if (isAsset) {
    // Cache-first for assets
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Return cached response
            return cachedResponse;
          }

          // Not in cache, fetch from network
          return fetch(event.request)
            .then(networkResponse => {
              // Check if we received a valid response
              if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                return networkResponse;
              }

              // Clone the response since we want to use it in two places
              const responseToCache = networkResponse.clone();

              // Add to cache for future use
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return networkResponse;
            });
        })
    );
  } else {
    // Network-first for HTML and other files
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // Clone the response since we want to use it in two places
          const responseToCache = networkResponse.clone();

          // Add to cache for future use
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return networkResponse;
        })
        .catch(() => {
          // If network fails, try from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }

              // If not in cache and network failed, return offline page if it's an HTML request
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
            });
        })
    );
  }
});

// Background sync for contact form submissions when offline
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
});

// Function to sync stored form submissions
async function syncContactForms() {
  try {
    // Open IndexedDB to get stored form data
    const db = await openDB('account-ability-forms', 1);
    const transaction = db.transaction('forms', 'readwrite');
    const store = transaction.objectStore('forms');

    // Get all stored form submissions
    const forms = await store.getAll();

    // Process each form
    for (const form of forms) {
      try {
        // Try to send the form data
        const response = await fetch('/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        });

        if (response.ok) {
          // If successful, delete from storage
          await store.delete(form.id);
        }
      } catch (err) {
        console.error('[Service Worker] Form sync failed:', err);
      }
    }

    await transaction.complete;
  } catch (err) {
    console.error('[Service Worker] Error syncing forms:', err);
  }
}

// Helper function to open IndexedDB
function openDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('forms')) {
        db.createObjectStore('forms', { keyPath: 'id' });
      }
    };

    request.onsuccess = e => resolve(e.target.result);
    request.onerror = e => reject(e.target.error);
  });
}

// Periodic syncing (if browser supports it)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-sync') {
    event.waitUntil(updateContent());
  }
});

// Function to update cached content periodically
async function updateContent() {
  // Update main files
  const mainFiles = ['/', '/index.html', '/assets/css/styles.css'];

  try {
    const cache = await caches.open(CACHE_NAME);

    for (const url of mainFiles) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.error(`[Service Worker] Failed to update ${url}:`, error);
      }
    }

    console.log('[Service Worker] Content updated successfully');
  } catch (error) {
    console.error('[Service Worker] Content update failed:', error);
  }
}