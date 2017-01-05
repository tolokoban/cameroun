"use strict";

require("polyfill.promise");
var $ = require("dom");
var WS = require("tfw.web-service");
var Parser = require("structure.parser");
var Storage = require("tfw.storage").session;

var promise = WS.get("GetOrg");

exports.load = function() {
    return new Promise(function (resolve, reject) {
        promise.then(function(data) {
            console.info("[structure] data=...", data);
            var key, val;
            for( key in data ) {
                val = data[key];
                if( typeof val !== 'string' ) val = '';
                try {
                    exports[key] = Parser.parse( val );
                }
                catch (ex) {
                    Storage.set('error', {
                        name: key,
                        content: val,
                        line: ex.lineNumber,
                        message: ex.message
                    });
                    location = "error.html";
                }
                resolve();
            }
        }, reject);
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
