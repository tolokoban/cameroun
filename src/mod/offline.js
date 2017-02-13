"use strict";

// On vérifie que le browser sait gérer les service workers.
if( navigator.serviceWorker ) {
    // On enregistre le service worker en donnant son nom de fichier.
    navigator.serviceWorker.register('offline.js', {
        // Le `scope` indique le répertoire dont ce service worker est
        // responsable.  C'est-à-dire que  lorsque  le browser  voudra
        // charger un  fichier de ce  répertoire, il enverra  un event
        // `fetch` au service worker puisqu'il est responsable de tout
        // ce qui est dans ce répertoire (et les répertoires fils).
        scope: '.'
    });

    // Ca, c'est juste pour le debug.  Ca permet de voir dans les logs
    // quand le  service est installé correctement.  La première fois,
    // il va s'installer, mais ne  sera pas utiliser avant le prochain
    // démarrage du navigateur.
    navigator.serviceWorker.ready.then(function() {
        console.info( "Service Worker is ready!" );
    });
}
