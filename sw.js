const CACHE_NAME = 'recovery-kneads-v1';
const STATIC_CACHE_NAME = 'recovery-kneads-static-v1';
const RUNTIME_CACHE_NAME = 'recovery-kneads-runtime-v1';

// Resources to cache on install
const STATIC_ASSETS = [
  '/',
  '/index-optimized.html',
  '/styles.min.css',
  '/script.min.js',
  '/logo-optimized.svg',
  '/deep-tissue-massage-naples.html',
  '/sports-massage-naples.html',
  '/therapeutic-massage-naples.html'
];

// Google Fonts to cache
const FONT_CACHE = [
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Open+Sans:wght@300;400;600&display=swap',
  'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDZbtXK-F2qO0isEw.woff2',
  'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4taVIGxA.woff2'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache fonts
      caches.open(RUNTIME_CACHE_NAME).then(cache => {
        return cache.addAll(FONT_CACHE);
      })
    ]).then(() => {
      // Skip waiting to activate new service worker immediately
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== RUNTIME_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle HTML pages - Network First strategy
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // If network request succeeds, update cache and return response
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request);
        })
    );
    return;
  }

  // Handle CSS and JS - Cache First strategy
  if (request.url.includes('.css') || request.url.includes('.js')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(response => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Handle images - Cache First strategy with fallback
  if (request.headers.get('accept').includes('image')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(response => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          // Return a fallback image if available
          return caches.match('/logo-optimized.svg');
        });
      })
    );
    return;
  }

  // Handle Google Fonts - Cache First strategy
  if (url.hostname === 'fonts.googleapis.com' || 
      url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(response => {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Handle API calls and other requests - Network First strategy
  if (request.method === 'POST' || request.url.includes('api')) {
    event.respondWith(
      fetch(request).catch(() => {
        // For POST requests, we might want to queue them
        // For now, just return a generic offline response
        return new Response('Offline', { status: 503 });
      })
    );
    return;
  }

  // Default: try network first, then cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Background sync for offline form submissions (if supported)
self.addEventListener('sync', event => {
  if (event.tag === 'appointment-sync') {
    event.waitUntil(syncAppointments());
  }
});

async function syncAppointments() {
  // Implementation for syncing offline appointment requests
  // This would be integrated with your actual appointment booking system
  console.log('Syncing appointments...');
}

// Handle push notifications (if needed)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo-optimized.svg',
      badge: '/logo-optimized.svg',
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore', 
          title: 'View Details',
          icon: '/icon-explore.png'
        },
        {
          action: 'close', 
          title: 'Close',
          icon: '/icon-close.png'
        }
      ]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('https://recoverykneads.com/#scheduler')
    );
  }
});