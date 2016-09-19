"use strict";

/**
 *
 */
var Parser = require("structure.parser");

['types', 'forms', 'patient'].forEach(function (id) {
    try {
        exports[id] = Parser.parse(GLOBAL[id]);
    }
    catch (ex) {
        console.error("Unable to parse `" + id + ".org`:", ex);
    }
});


exports.getForm = function() {
    var path = [];
    var i, arg;
    for (i = 0 ; i < arguments.length ; i++) {
        arg = arguments[i];
        path.push( arg );
    }
    return Parser.get( exports.forms, path );
};
