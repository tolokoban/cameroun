"use strict";

exports.get = get;
exports.set = set;
/**
 * @param {object} target
 * @param {string} name
 * @param {any} defaultValue
 */
exports.definePersistentProperty = definePersistentProperty;


//############################################################

var Fs = require("node://fs");
var Timer = require("tfw.timer");

var preferences;
var FILENAME = "./preferences.json";

var save = Timer.debounce( saveNow, 300 );


function get( name, defaultValue ) {
  if( !preferences ) preferences = load();
  var value = preferences[name];
  if( typeof value === 'undefined' ) value = defaultValue;
  return value;
}

function set( name, value ) {
  if( !preferences ) preferences = load();
  preferences[name] = value;
  save();
}

function load() {
  if( !Fs.existsSync( FILENAME ) ) return {};
  
  var content = Fs.readFileSync( FILENAME ).toString();
  try {
    return JSON.parse( content );
  }
  catch( ex ) {
    console.error("Unable to load preferences!");
    console.error(ex);
    return {};
  }
}

function saveNow() {
  Fs.writeFile( FILENAME, JSON.stringify( preferences, null, '  ' ), function() {} );
}

function definePersistentProperty( target, name, defaultValue ) {
  Object.defineProperty( target, name, {
    get: function() {
      return get( "persistent." + name, defaultValue );
    },
    set: function(v) {
      set( "persistent." + name, v );
    },
    configurable: false,
    enumerable: true
  });
}
