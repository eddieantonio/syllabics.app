/*
 * Copyright (C) 2019 Eddie Antonio Santos <easantos@ualberta.ca>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Service worker for syllabics.app.
 */


var cacheName = 'syllabics-app';
var filesToCache = [
  '/',
  // TODO: we somehow have to figure out the content hash
  /*
  'styles.css',
  'main.js',
  */
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] installing...');

  // ugh, this syntax is killing me!
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', event => {
  // not sure what this does...
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // match the resource, ignoring the query string
    caches.match(event.request, { ignoreSearch: true }).then(response => {
      // return the cached response, or fetch it.
      return response || fetch(event.request);
    })
  );
});
