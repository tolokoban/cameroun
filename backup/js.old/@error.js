/**********************************************************************
 require( 'require' )
 -----------------------------------------------------------------------
 @example

 var Path = require("node://path");  // Only in NodeJS/NW.js environment.
 var Button = require("tfw.button");

 **********************************************************************/

window.require = function() {
  var mocks = {};
  var modules = {};
  var definitions = {};
  var nodejs_require = typeof window.require === 'function' ? window.require : null;

  var f = function(id, body) {
    var mock = mocks[id];
    if( mock ) return mock;
    
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
    }
    return mod;
  };

  f.mock = function( moduleName, module ) {
    mocks[moduleName] = module;
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
require("$",function(n,r,o){o.config={name:'"cameroun"',description:'"Cameroun"',author:'"tolokoban"',version:'"0.4.12"',major:"0",minor:"4",revision:"12",date:"2018-09-22T11:56:18.000Z",consts:{tfw:"http://tolokoban.org/Cameroun/tfw"}};var t=null;o.lang=function(n){return void 0===n&&(window.localStorage&&(n=window.localStorage.getItem("Language")),n||(n=window.navigator.language)||(n=window.navigator.browserLanguage)||(n="fr"),n=n.substr(0,2).toLowerCase()),t=n,window.localStorage&&window.localStorage.setItem("Language",n),n},o.intl=function(n,r){var t,a,e,i,g,u,l,s=n[o.lang()],w=r[0];for(l in n)break;if(!l)return w;if(!s&&!(s=n[l]))return w;if(t=s[w],t||(s=n[l],t=s[w]),!t)return w;if(r.length>1){for(a="",g=0,e=0;e<t.length;e++)i=t.charAt(e),"$"===i?(a+=t.substring(g,e),e++,u=t.charCodeAt(e)-48,u<0||u>=r.length?a+="$"+t.charAt(e):a+=r[u],g=e+1):"\\"===i&&(a+=t.substring(g,e),e++,a+=t.charAt(e),g=e+1);a+=t.substr(g),t=a}return t}});
//# sourceMappingURL=$.js.map
require("error",function(n,e,r){function t(n,e){document.getElementById(n).textContent=e}var o=function(){function e(){return t(r,arguments)}var r={en:{},fr:{}},t=n("$").intl;return e.all=r,e}(),i=n("tfw.storage").session,u=i.get("error",{});t("error","Erreur dans le fichier '"+u.name+"' à la ligne "+u.line+" !\n\n"+u.message),t("content",(""+u.content).split("\n").map(function(n,e){for(var r=""+(1+e);r.length<4;)r=" "+r;return r+". "+n})),e.exports._=o});
//# sourceMappingURL=error.js.map
require("tfw.storage",function(t,n,o){function e(t){return function(n,o){var e=t.getItem(n);if(null===e)return o;try{e=JSON.parse(e)}catch(t){}return e}}function r(t){return function(n,o){t.setItem(n,JSON.stringify(o))}}function i(){this._data={}}var a=function(){function n(){return e(o,arguments)}var o={en:{}},e=t("$").intl;return n.all=o,n}();window.localStorage?window.sessionStorage||(window.sessionStorage=window.localStorage):(window.localStorage=new i,window.sessionStorage=new i),o.local={get:e(window.localStorage),set:r(window.localStorage)},o.session={get:e(window.sessionStorage),set:r(window.sessionStorage)},i.prototype.getItem=function(t,n){var o=this._data[t];return void 0===o?n:o},i.prototype.setItem=function(t,n){this._data[t]=n},n.exports._=a});
//# sourceMappingURL=tfw.storage.js.map
