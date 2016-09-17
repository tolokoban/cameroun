"use strict";

/**
 *
 */
var Parser = require("structure.parser");

try {
    exports.types = Parser.parse(GLOBAL.types);
}
catch (ex) {
    console.error("Unable to parse `types.org`:", ex);
}

try {
    exports.forms = Parser.parse(GLOBAL.forms);
}
catch (ex) {
    console.error("Unable to parse `patient.org`:", ex);
}


exports.getForm = function() {
    var path = [];
    var i, arg;
    for (i = 0 ; i < arguments.length ; i++) {
        arg = arguments[i];
        path.push( arg );
    }
    return Parser.get( exports.forms, path );
};
