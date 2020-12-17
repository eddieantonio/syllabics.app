/**
 * Allow the service worker to delete all cached entries.
 *
 * Intention: delete main.js when loaded from Cypress tests.
 */
addEventListener('message', function (event) {
  if (event.data !== "clearcache") {
    return;
  }

  self.caches.keys().then(keys => {
    keys.forEach(key => {
      console.log("clearing cache:", key);
      self.caches.delete(key)
    });
  });
});
