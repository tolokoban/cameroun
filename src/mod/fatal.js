"use strict";


module.exports = function( reject, msg, ex ) {
    if( typeof reject === 'string' ) {
        ex = msg;
        msg = reject;
        reject = null;
    }
    console.error( msg, ex );
    if( typeof reject === 'function' ) {
        reject( msg );
    }
    return false;
};
