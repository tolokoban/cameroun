/** @module error */require( 'error', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
    "use strict";

var Storage = require("tfw.storage").session;


document.getElementById("error").textContent = Storage.get("error", "...");


  
module.exports._ = _;
/**
 * @module error
 * @see module:$
 * @see module:error
 * @see module:tfw.storage

 */
});