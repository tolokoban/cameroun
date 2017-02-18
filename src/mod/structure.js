"use strict";

require("polyfill.promise");
var $ = require("dom");
var WS = require("tfw.web-service");
var Files = require("files");
var Modal = require("wdg.modal");
var Parser = require("structure.parser");
var Storage = require("tfw.storage").session;

var FS = require("node://fs");

// Name of the local backup for structure.
var FILENAME = "data/structure.json";
// URL of the service delivering structure.
var URL = "https://tolokoban.org/Cameroun/tfw/svc.php?s=GetOrg";


exports.load = function() {
    return new Promise(function (resolve, reject) {
        Files.mkdir( "data" )
            .then(function() {
                return fetch( URL );
            })
            .then(function( response ) {
                if( response.ok == false) {
                    throw( "Error " + response.status + " - " + response.statusText );
                }
                return response.json();
            })
            .then(function( data ) {
                var key, val;
                for( key in data ) {
                    val = data[key];
                    if( typeof val !== 'string' ) val = '';
                    try {
                        exports[key] = Parser.parse( val );
                    }
                    catch (ex) {
                        Modal.alert($.div([
                            "Error in structure `" + key + "` at line " + ex.lineNumber,
                            $.tag('code', [ex.message])
                        ]));
                        reject();
                        return;
                    }
                }
                FS.writeFile( FILENAME, JSON.stringify( data, null, '    ' ) );
                resolve();
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
                            resolve( JSON.parse( data.toString() ) );
                        }
                    });
                }
            });
    });
};

exports.getForm = function() {
    var path = [];
    var i, arg;
    for (i = 0 ; i < arguments.length ; i++) {
        arg = arguments[i];
        path.push( arg );
    }
    return Parser.get( exports.forms, path );
};
