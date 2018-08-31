"use strict";

/**
 * @param {string} remoteServer -
 * @param {string} secretCode - Code of the care center.
 */
exports.check = check;

var Preferences = require("preferences");

Preferences.definePersistentProperty( exports, 'remoteServer', "localhost/www/cameroun-server/" );
Preferences.definePersistentProperty( exports, 'secretCode', "" );


//############################################################

var WebService = require("tfw.web-service");


function check( remoteServer, secretCode ) {
  remoteServer = ("" + remoteServer).trim();
  if( remoteServer.charAt( remoteServer.length - 1 ) !== '/' )
    remoteServer += '/';
  remoteServer += "tfw";

  return new Promise(function (resolve, reject) {
    WebService.get( "synchro", { cmd: 'status', code: secretCode }, remoteServer).then(
      function( ret ) {
        console.info("[synchro] ret=", ret);
        if( typeof ret === 'number' ) reject( ret );
        resolve( ret );
      },
      function( err ) {
        console.error(err);
        reject( err );
      }
    );
  });
}
