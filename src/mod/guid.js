var ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
var DATE_BASE = (new Date(2017, 0, 1).getTime()) >> 10;

var lastId = null;
var counter = 0;

module.exports = function() {
    var x = (Date.now() >> 10) - DATE_BASE;
    var id = b64( x );
    if( lastId == id ){
        counter++;
        id += '.' + b64(counter);
    }
    lastId = id;
    return id;
};


function b64( x ) {
    var id = '', digit;
    while (x > 0) {
        digit = x & 63;
        id = ALPHABET.charAt(digit) + id;
        x -= digit;
        x >>= 6;
    }
    return id;
}
