/** @module guid */require( 'guid', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
    var ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$#";

module.exports = function() {
    var x = Math.floor(Date.now() / 1000);
    var id = '';
    var digit;
    while (x > 0) {
        digit = x & 63;
        id = ALPHABET.charAt(digit) + id;
        x -= digit;
        x >>= 6;
    }
    return id;
};


  
module.exports._ = _;
/**
 * @module guid
 * @see module:$
 * @see module:guid

 */
});