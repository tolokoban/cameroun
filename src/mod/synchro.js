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
  
}
