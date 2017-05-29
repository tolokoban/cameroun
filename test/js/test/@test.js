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
        APP = require('test');
setTimeout(function (){if(typeof APP.start==='function')APP.start()});
var W = require('x-widget');
        W('B1', 'wdg.showhide', {
            label: "Premier bloc",
            value: "false",
            content: [
          W({
              elem: "p",
              children: ["Salut les Mickeys ! Ça roule ?"]})]})
        W('B2', 'wdg.showhide', {
            label: "Deuxième bloc",
            focus: "true",
            content: [
          W({
              elem: "p",
              children: ["Est-ce que le focusable fonctionne ?"]})]})
        W('wdg.button32', 'wdg.button', {
            text: "Focus 1",
            value: "1"})
        W('wdg.button33', 'wdg.button', {
            text: "Focus 2",
            value: "2"})
        W.bind('wdg.button32',{"action":{"S":["onFocus"]}});
        W.bind('wdg.button33',{"action":{"S":["onFocus"]}});
    }
);
