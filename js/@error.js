/**********************************************************************
 require( 'require' )
 -----------------------------------------------------------------------
 @example

 var Path = require("node://path");  // Only in NodeJS/NW.js environment.
 var Button = require("tfw.button");

 **********************************************************************/

window.require = function() {
    var modules = {};
    var definitions = {};
    var nodejs_require = typeof window.require === 'function' ? window.require : null;

    var f = function(id, body) {
        if( id.substr( 0, 7 ) == 'node://' ) {
            // Calling for a NodeJS module.
            if( !nodejs_require ) {
                throw Error( "[require] NodeJS is not available to load module `" + id + "`!" );
            }
            return nodejs_require( id.substr( 7 ) );
        }

        if( typeof body === 'function' ) {
            definitions[id] = body;
            return;
        }
        var mod;
        body = definitions[id];
        if (typeof body === 'undefined') {
            var err = new Error("Required module is missing: " + id);   
            console.error(err.stack);
            throw err;
        }
        mod = modules[id];
        if (typeof mod === 'undefined') {
            mod = {exports: {}};
            var exports = mod.exports;
            body(f, mod, exports);
            modules[id] = mod.exports;
            mod = mod.exports;
            //console.log("Module initialized: " + id);
        }
        return mod;
    };
    return f;
}();
function addListener(e,l) {
    if (window.addEventListener) {
        window.addEventListener(e,l,false);
    } else {
        window.attachEvent('on' + e, l);
    }
};

addListener(
    'DOMContentLoaded',
    function() {
        document.body.parentNode.$data = {};
        // Attach controllers.
        APP = require('error');
setTimeout(function (){if(typeof APP.start==='function')APP.start()});

    }
);
require("$",function(n,o,r){r.config={name:'"cameroun"',description:'"Cameroun"',author:'"tolokoban"',version:'"0.0.4"',major:"0",minor:"0",revision:"4",date:"2016-11-25T19:02:38.000Z",consts:{tfw:"http://tolokoban.org/Cameroun/"}};var t=null;r.lang=function(n){return void 0===n&&(window.localStorage&&(n=window.localStorage.getItem("Language")),n||(n=window.navigator.language,n||(n=window.navigator.browserLanguage,n||(n="fr"))),n=n.substr(0,2).toLowerCase()),t=n,window.localStorage&&window.localStorage.setItem("Language",n),n},r.intl=function(n,o){var t,a,e,i,g,u,l=n[r.lang()],s=o[0];if(!l)return s;if(t=l[s],!t)return s;if(o.length>1){for(a="",g=0,e=0;e<t.length;e++)i=t.charAt(e),"$"===i?(a+=t.substring(g,e),e++,u=t.charCodeAt(e)-48,a+=u<0||u>=o.length?"$"+t.charAt(e):o[u],g=e+1):"\\"===i&&(a+=t.substring(g,e),e++,a+=t.charAt(e),g=e+1);a+=t.substr(g),t=a}return t}});
//# sourceMappingURL=$.js.map
require("error",function(e,r,t){function n(){return i(o,arguments)}var o={en:{},fr:{}},i=e("$").intl,s=e("tfw.storage").session;document.getElementById("error").textContent=s.get("error","..."),r.exports._=n});
//# sourceMappingURL=error.js.map
require("tfw.storage",function(t,n,e){function r(){return u(s,arguments)}function o(t){return function(n,e){var r=t.getItem(n);if(null===r)return e;try{r=JSON.parse(r)}catch(t){}return r}}function i(t){return function(n,e){t.setItem(n,JSON.stringify(e))}}var s={en:{}},u=t("$").intl;e.local={get:o(window.localStorage),set:i(window.localStorage)},e.session={get:o(window.sessionStorage),set:i(window.sessionStorage)},n.exports._=r});
//# sourceMappingURL=tfw.storage.js.map
