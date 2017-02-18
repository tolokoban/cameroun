/**
 * Tools for files.
 */
"use strict";

var FS = require("node://fs");


/**
 * Save a blob to a file.
 * Resolves to the filename.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Blob#Example_for_extracting_data_from_a_Blob
 */
exports.saveBlob = function( filename, blob ) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.addEventListener("loadend", function() {
            var data = new Buffer( reader.result );
            FS.writeFile( filename, data, function( err ) {
                if( err ) reject( err );
                else resolve( filename );
            });
        });
        reader.readAsArrayBuffer( blob );
    });
};

/**
 * Save an JSON representation of an object to a file.
 * Resolves to the filename.
 */
exports.saveJson = function( filename, data ) {
    return new Promise(function (resolve, reject) {
        exports.mkdir( dirname( filename ) ).then(function() {
            var text = JSON.stringify( data );
            FS.writeFile( filename, text, function( err ) {
                if( err ) reject( err );
                else resolve( filename );
            });
        });
    });
};

/**
 * Load a file and parse it as a JSON.
 * Resolves to the object.
 */
exports.loadJson = function( filename, data ) {
    return new Promise(function (resolve, reject) {
        var text = JSON.stringify( data );
        FS.readFile( filename, text, function( err, data ) {
            if( err ) reject( err );
            else resolve( JSON.parse( data.toString() ) );
        });
    });
};

/**
 * Create directories recursively.
 * If they are already created, no problem.
 * Resolves in `undefined`.
 */
exports.mkdir = function(folder) {
    var sep = findSeparator(folder);
    var folders = folder.split( sep );
    var dir = '.';
    var directories = [];
    folders.forEach(function (folder) {
        if( folder.length == 2 && folder.charAt(1) == ':' ) {
            // dealing with windows drive letter (example: `C:`).
            dir = folder;
        } else {
            dir += sep + folder;
        }
        directories.push( dir );
    });

    return new Promise(function (resolve, reject) {
        var next = function() {
            if( directories.length == 0 ) {
                resolve();
                return;
            }
            var dir = directories.shift();
            if( FS.existsSync( dir ) ) {
                next();
            } else {
                FS.mkdir( dir, function( err ) {
                    if( err ) reject( err );
                    else next();
                });
            }
        };

        next();
    });
};

/**
 * Remove the filename at the end of `path`.
 */
function dirname( path ) {
    var pos = path.lastIndexOf( findSeparator(path) );
    if( pos == -1 ) return path;
    return path.substr(0, pos);
}

/**
 * Return path separator: `/` or `\`.
 * The better is to avoid unix-like path with `\`.
 */
function findSeparator( path ) {
    var backslash = path.split('\\').length;
    var slash = path.split('/').length;
    if( backslash > slash ) return '\\';
    return '/';
}
