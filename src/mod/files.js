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
exports.saveBlobAs = function( blob, filename ) {
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
