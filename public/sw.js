var cacheName = 'cache';
var filesToCache = [
  './404-error-page-examples.jpeg',
  './bundle.js',
  './manifest.json',
  './bundle.js.map',
  './offline.html',
  './favicon.ico	',
  './style.css',

  './timey-icon.png',
  './index.html',
  './timeylogo.jpeg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(preLoad());
});

var preLoad = function() {
  console.log('Installing web app');
  return caches.open(cacheName).then(function(cache) {
    console.log('caching index and important routes');
    return cache.addAll(filesToCache);
  });
};

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cName) {
          if (cName !== cacheName) {
            return caches.delete(cName);
          }
        })
      );
    })
  );
});
//!!!!!!!!!!!!!!!!!!
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: ' + e.request.url);
      return (
        r ||
        fetch(e.request).then(function(response) {
          return caches.open(cacheName).then(function(cache) {
            console.log(
              '[Service Worker] Caching new resource: ' + e.request.url
            );
            cache.put(e.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});
