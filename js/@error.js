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
require("$",function(n,r,o){o.config={name:'"cameroun"',description:'"Cameroun"',author:'"tolokoban"',version:'"0.0.5"',major:"0",minor:"0",revision:"5",date:"2017-01-05T20:45:33.000Z",consts:{tfw:"http://tolokoban.org/Cameroun"}};var t=null;o.lang=function(n){return void 0===n&&(window.localStorage&&(n=window.localStorage.getItem("Language")),n||(n=window.navigator.language,n||(n=window.navigator.browserLanguage,n||(n="fr"))),n=n.substr(0,2).toLowerCase()),t=n,window.localStorage&&window.localStorage.setItem("Language",n),n},o.intl=function(n,r){var t,a,e,i,g,u,l,s=n[o.lang()],c=r[0];for(l in n)break;if(!l)return c;if(!s&&(s=n[l],!s))return c;if(t=s[c],t||(s=n[l],t=s[c]),!t)return c;if(r.length>1){for(a="",g=0,e=0;e<t.length;e++)i=t.charAt(e),"$"===i?(a+=t.substring(g,e),e++,u=t.charCodeAt(e)-48,a+=u<0||u>=r.length?"$"+t.charAt(e):r[u],g=e+1):"\\"===i&&(a+=t.substring(g,e),e++,a+=t.charAt(e),g=e+1);a+=t.substr(g),t=a}return t}});
//# sourceMappingURL=$.js.map
require("error",function(n,e,r){function t(n,e){document.getElementById(n).textContent=e}var o=function(){function e(){return t(r,arguments)}var r={en:{},fr:{}},t=n("$").intl;return e.all=r,e}(),i=n("tfw.storage").session,u=i.get("error",{});t("error","Erreur dans le fichier '"+u.name+"' à la ligne "+u.line+" !\n\n"+u.message),t("content",(""+u.content).split("\n").map(function(n,e){for(var r=""+(1+e);r.length<4;)r=" "+r;return r+". "+n})),e.exports._=o});
//# sourceMappingURL=error.js.map
require("tfw.storage",function(t,n,e){function r(t){return function(n,e){var r=t.getItem(n);if(null===r)return e;try{r=JSON.parse(r)}catch(t){}return r}}function o(t){return function(n,e){t.setItem(n,JSON.stringify(e))}}var i=function(){function n(){return r(e,arguments)}var e={en:{}},r=t("$").intl;return n.all=e,n}();e.local={get:r(window.localStorage),set:o(window.localStorage)},e.session={get:r(window.sessionStorage),set:o(window.sessionStorage)},n.exports._=i});
//# sourceMappingURL=tfw.storage.js.map
