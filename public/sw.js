// Service Worker for MediSoluce Healthcare Compliance Platform
const CACHE_NAME = 'medisoluce-v1.0.0';
const STATIC_CACHE = 'medisoluce-static-v1.0.0';
const DYNAMIC_CACHE = 'medisoluce-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // Add critical CSS and JS files here
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/assessments/,
  /\/api\/compliance/,
  /\/api\/security/,
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    (async () => {
      try {
        // Check if CacheStorage is available
        if (typeof caches === 'undefined') {
          console.warn('Service Worker: CacheStorage not available, skipping cache');
          return self.skipWaiting();
        }
        
        const cache = await caches.open(STATIC_CACHE);
        console.log('Service Worker: Caching static files');
        await cache.addAll(STATIC_FILES);
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      } catch (error) {
        console.error('Service Worker: Failed to cache static files', error);
        // Still skip waiting even if caching fails
        return self.skipWaiting();
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Check if CacheStorage is available
        if (typeof caches === 'undefined') {
          console.warn('Service Worker: CacheStorage not available');
          return self.clients.claim();
        }
        
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
        console.log('Service Worker: Activated');
        return self.clients.claim();
      } catch (error) {
        console.error('Service Worker: Error during activation', error);
        return self.clients.claim();
      }
    })()
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip external resources (Google Fonts, CDNs, etc.) - let browser handle them directly
  // Don't intercept external requests at all - let them pass through naturally
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try cache first for static files
    if (isStaticFile(url.pathname)) {
      const cachedResponse = await getFromCache(request, STATIC_CACHE);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Try network first for API calls
    if (isApiCall(url.pathname)) {
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          await cacheResponse(request, networkResponse.clone(), DYNAMIC_CACHE);
          return networkResponse;
        }
      } catch (error) {
        console.log('Service Worker: Network failed for API call, trying cache');
        const cachedResponse = await getFromCache(request, DYNAMIC_CACHE);
        if (cachedResponse) {
          return cachedResponse;
        }
      }
    }

    // For other requests, try network first, then cache
    try {
      const networkResponse = await fetch(request);
      
      // Cache successful responses
      if (networkResponse.ok) {
        await cacheResponse(request, networkResponse.clone(), DYNAMIC_CACHE);
      }
      
      return networkResponse;
    } catch (error) {
      console.log('Service Worker: Network failed, trying cache');
      
      // Try to get from cache
      const cachedResponse = await getFromCache(request, DYNAMIC_CACHE);
      if (cachedResponse) {
        return cachedResponse;
      }

      // If it's a navigation request and we have no cache, show offline page
      if (request.mode === 'navigate') {
        if (typeof caches !== 'undefined') {
          const offlinePage = await caches.match('/offline.html');
          if (offlinePage) {
            return offlinePage;
          }
        }
        // Fallback if cache is not available or offline page not found
        return new Response('Offline - Please check your connection', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/html' },
        });
      }

      // For other requests, return a generic offline response
      return new Response('Offline - Content not available', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  } catch (error) {
    console.error('Service Worker: Error handling request', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      if (typeof caches !== 'undefined') {
        try {
          const offlinePage = await caches.match('/offline.html');
          if (offlinePage) {
            return offlinePage;
          }
        } catch (cacheError) {
          console.error('Service Worker: Error accessing cache', cacheError);
        }
      }
      // Fallback if cache is not available or offline page not found
      return new Response('Offline - Please check your connection', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/html' },
      });
    }
    
    // For non-navigation requests, return a generic error response
    return new Response('Service Worker Error', {
      status: 500,
      statusText: 'Internal Server Error',
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

function isStaticFile(pathname) {
  return STATIC_FILES.includes(pathname) || 
         pathname.endsWith('.css') || 
         pathname.endsWith('.js') || 
         pathname.endsWith('.png') || 
         pathname.endsWith('.jpg') || 
         pathname.endsWith('.svg');
}

function isApiCall(pathname) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(pathname));
}

async function getFromCache(request, cacheName) {
  try {
    // Check if CacheStorage is available
    if (typeof caches === 'undefined') {
      return null;
    }
    const cache = await caches.open(cacheName);
    return await cache.match(request);
  } catch (error) {
    console.error('Service Worker: Error getting from cache', error);
    return null;
  }
}

async function cacheResponse(request, response, cacheName) {
  try {
    // Check if CacheStorage is available
    if (typeof caches === 'undefined') {
      return;
    }
    // Only cache successful responses
    if (!response || !response.ok) {
      return;
    }
    // Response is already cloned before being passed to this function
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
  } catch (error) {
    // Silently fail for cache errors - don't break the app
    console.warn('Service Worker: Error caching response', error);
  }
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'assessment-sync') {
    event.waitUntil(syncAssessmentData());
  } else if (event.tag === 'security-sync') {
    event.waitUntil(syncSecurityData());
  }
});

async function syncAssessmentData() {
  try {
    // Get pending assessments from IndexedDB
    const pendingAssessments = await getPendingAssessments();
    
    for (const assessment of pendingAssessments) {
      try {
        const response = await fetch('/api/assessments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(assessment),
        });
        
        if (response.ok) {
          // Remove from pending queue
          await removePendingAssessment(assessment.id);
          console.log('Service Worker: Assessment synced successfully', assessment.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync assessment', assessment.id, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Error syncing assessment data', error);
  }
}

async function syncSecurityData() {
  try {
    // Get pending security events from IndexedDB
    const pendingEvents = await getPendingSecurityEvents();
    
    for (const event of pendingEvents) {
      try {
        const response = await fetch('/api/security/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });
        
        if (response.ok) {
          // Remove from pending queue
          await removePendingSecurityEvent(event.id);
          console.log('Service Worker: Security event synced successfully', event.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync security event', event.id, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Error syncing security data', error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingAssessments() {
  // This would integrate with your IndexedDB implementation
  return [];
}

async function removePendingAssessment(id) {
  // This would integrate with your IndexedDB implementation
  console.log('Removing pending assessment', id);
}

async function getPendingSecurityEvents() {
  // This would integrate with your IndexedDB implementation
  return [];
}

async function removePendingSecurityEvent(id) {
  // This would integrate with your IndexedDB implementation
  console.log('Removing pending security event', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'New compliance update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png',
      },
    ],
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'MediSoluce Notification';
  }

  event.waitUntil(
    self.registration.showNotification('MediSoluce', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_ASSESSMENT') {
    // Cache assessment data for offline use
    cacheAssessmentData(event.data.assessment);
  }
});

async function cacheAssessmentData(assessment) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(assessment), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await cache.put(`/api/assessments/${assessment.id}`, response);
    console.log('Service Worker: Assessment data cached', assessment.id);
  } catch (error) {
    console.error('Service Worker: Error caching assessment data', error);
  }
}