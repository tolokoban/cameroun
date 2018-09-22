"use strict";

module.exports = createPromise;

Object.defineProperty( module.exports, 'value', { get: function() { return g_structure; } });
Object.defineProperty( module.exports, 'source', { get: function() { return g_source; } });


//############################################################


require("polyfill.promise");
var $ = require("dom");
var WS = require("tfw.web-service");
var Err = require("tfw.message").error;
var Msg = require("tfw.message").info;
var Files = require("files");
var Modal = require("wdg.modal");
var Parser = require("structure.parser");
var Synchro = require("synchro");
var Storage = require("tfw.storage").session;

var FS = require("node://fs");

// Name of the local backup for structure.
var FILENAME = "data/structure.json";

var g_structure = null;
var g_source = null;

/**
 * Resolves in the complete structure.
 */
function createPromise() {
  return new Promise(function (resolve, reject) {
    if( g_structure ) resolve( g_structure );
    else {
      Synchro.start().then(function() {
        console.log(_('synchro-success'));
      }, function() {
        Err(_('synchro-failure'));
      });
      // Load structure from internet or from local disk if network is unreachable.
      Files
        .mkdir( "data" )
        .then(function() {
          return Synchro.structure();
        })
        .then(function( data ) {
          if( !loadStructure( data ) ) {
            throw( "Unparsable JSON!" );
          }
          FS.writeFile( FILENAME, JSON.stringify( data, null, '    ' ) );
          resolve( g_structure );
        })
        .catch(function( err ) {
          // Unable to  retrieve structure from the  network (or
          // structure is corrupted). We  try to get the locally
          // stored backup.
          if( !FS.existsSync( FILENAME ) ) {
            reject( "No connection and no structure in cache!" );
          } else {
            FS.readFile( FILENAME, function(err, data) {
              if( err ) {
                reject( "Unable to read backup file for structure!\n" + err );
              } else {
                loadStructure( JSON.parse( data.toString() ) );
                resolve( g_structure );
              }
            });
          }
        });
    }
  });
}


function loadStructure( data ) {
  g_structure = {};
  g_source = {};

  var key, val;
  ['exams', 'vaccins', 'patient', 'forms', 'types'].forEach(function (key) {
    val = data[key];
    if( typeof val !== 'string' ) val = '';
    try {
      g_source[key] = val;
      g_structure[key] = Parser.parse( val );
    }
    catch (ex) {
      Modal.alert($.div([
        "Error in structure `" + key + "` at line " + ex.lineNumber,
        $.tag('code', [ex.message])
      ]));
      return false;
    }
  });
  return true;
}
