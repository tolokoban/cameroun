"use strict";

var $ = require("dom");
var Storage = require("tfw.storage").session;


var Parser = require("structure.parser");

['types', 'forms', 'patient'].forEach(function (id) {
    try {
        exports[id] = Parser.parse(GLOBAL[id]);
    }
    catch (ex) {
        Storage.set('error', "Erreur dans le fichier `" + id + ".org` à la ligne " + ex.lineNumber
                    + " :\n\n" + ex.message);
        location = "error.html";
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
