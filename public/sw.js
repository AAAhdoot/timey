var cacheName = 'v1';
var filesToCache = [
  '',
  '/projects/',
  './projects',
  '../CHANGELOG.md',
  '../package-lock.json',
  '../package.json',
  '../webpack.config.js',
  '../client/index.js',
  '../client/socket.js',
  '../client/utils.js',
  '../client/app.js',
  '../client/history.js',
  '../client/routes.js',
  '../client/actions/action-types.js',
  '../client/actions/d3data.js',
  '../client/actions/project.js',
  '../client/actions/ticket.js',

  '../client/components/AddUserToProject.js',
  '../client/components/DroppableContainer.js',
  '../client/components/auth-form.js',
  '../client/components/NotFound.js',
  '../client/components/board-top.js',
  '../client/components/Projects.js',
  '../client/components/index.js',
  '../client/components/Bars.js',
  '../client/components/ResponsiveWrapper.js',
  '../client/components/navbar.js',
  '../client/components/Chart.js',
  '../client/components/Ticket.js',
  '../client/components/project-board.js',
  '../client/components/Column.js',
  '../client/components/TimeSheet.js',
  '../client/components/user-home.js',
  '../client/components/CreateProject.js',
  '../client/components/Timer.js',
  '../client/components/CreateTicket.js',
  '../client/components/UpdateTicket.js',
  '../client/components/userTimeTable.js',

  '../client/store/d3data.js',
  '../client/store/project.js',
  '../client/store/user.js',
  '../client/store/index.js',
  '../client/store/ticket.js',
  '/404-error-page-examples.jpeg',
  '/bundle.js',
  '/manifest.json',
  '/bundle.js.map',
  '/offline.html',
  '/favicon.ico	',
  '/style.css',

  '/timey-icon.png',
  '/index.html',
  '/timeylogo.jpeg',

  '../server/index.js',
  '../server/api/index.js',	
  '../server/api/tickets.js',
  '../server/api/users.js',
  '../server/api/projects.js',
  '../server/api/userTickets.js',	
  '../server/auth/google.js',	
  '../server/auth/index.js',	

  '../server/db/db.js',	
  '../server/db/index.js',	


];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.info('[sw.js] cached all files');
      return cache.addAll(filesToCache);
    })
  );
});

// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.map(function(cName) {
//           if (cName !== cacheName) {
//             return caches.delete(cName);
//           }
//         })
//       );
//     })
//   );
// });

self.addEventListener('activate', function(event) {
  event.waitUntil(
    // Get all the cache names
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        // Get all the items that are stored under a different cache name than the current one
        cacheNames.filter(function(cacheName) {
          return cacheName != currentCacheName;
        }).map(function(cacheName) {
          // Delete the items
          return caches.delete(cacheName);
        })
      ); // end Promise.all()
    }) // end caches.keys()
  ); // end event.waitUntil()
});
self.addEventListener('fetch', function(event) {
    console.log('!!!!!',  caches.keys())
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      } else {
        // clone request stream
        // as stream once consumed, can not be used again
        var reqCopy = event.request.clone();

        return fetch(reqCopy, { credentials: 'include' }) // reqCopy stream consumed
          .then(function(response) {
            // bad response
            // response.type !== 'basic' means third party origin request
            if (
              !response ||
              response.status !== 200 ||
              response.type !== 'basic'
            ) {
              return response; // response stream consumed
            }

            // clone response stream
            // as stream once consumed, can not be used again
            var resCopy = response.clone();

            // ================== IN BACKGROUND ===================== //

            // add response to cache and return response
            caches.open(cacheName).then(function(cache) {
              return cache.put(reqCopy, resCopy); // reqCopy, resCopy streams consumed
            });

            // ====================================================== //

            return response; // response stream consumed
          });
      }
    })
  );
});
