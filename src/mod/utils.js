"use strict";


exports.capitalize = function( text ) {
    text = text.toLowerCase();
    var mode = 0;
    var c;
    var isLetter;
    var out = '';
    for( var i=0; i<text.length; i++ ) {
        c = text.charAt( i );
        if( c >= 'a' && c <= 'z' ) {
            isLetter = true;
        }
        else if ( 'çñßáàâäãéèêëẽíìîïĩóòôöõúùûüũ'.indexOf( c ) > -1 ) {
            isLetter = true;
        }
        else isLetter = false;
        if( mode == 0 ) {
            if( isLetter ) {
                mode = 1;
                c = c.toUpperCase();
            }
        } else {
            if( !isLetter ) {
                mode = 0;
            }
        }
        out += c;
    }

    return out;
};
