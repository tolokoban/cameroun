"use strict";

navigator.serviceWorker.register('offline.js', {
  scope: '.'
});

navigator.serviceWorker.ready.then(function() {
    console.info( "Service Worker is ready!" );
});
