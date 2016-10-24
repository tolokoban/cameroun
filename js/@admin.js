/**********************************************************************
 require( 'require' )
 -----------------------------------------------------------------------
 @example

 var Path = require("node://path");  // Only in NodeJS/NW.js environment.
 var Button = require("tfw.button");

 **********************************************************************/

var require = function() {
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
            body(exports, mod);
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
        APP = require('admin');
setTimeout(function (){if(typeof APP.start==='function')APP.start()});
var I = require('x-intl');
var W = require('x-widget');
        W('wdg.layout-stack9', 'wdg.layout-stack', {
            hash: "^#([a-zA-Z0-9]+)",
            content: [
          W({
              elem: "div",
              attr: {
                key: "Home",
                class: "x-page theme-color-bg-B3"},
              prop: {"$key": "Home"},
              children: [
                W({
                  elem: "header",
                  attr: {"class": "theme-color-bg-B5"},
                  children: [W({
                      elem: "span",
                      attr: {
                        id: "_I1",
                        style: "display:none"}})]}),
                "\n\n",
                W({
                  elem: "div",
                  children: [
                    "\n    ",
                    W({
                      elem: "div",
                      attr: {"id": "search-form"}}),
                    "\n    ",
                    W({
                      elem: "ul",
                      attr: {"id": "search-result"}}),
                    "\n    ",
                    W({
                      elem: "div",
                      attr: {
                        id: "search-button",
                        class: "right"}}),
                    "\n    ",
                    W({
                      elem: "hr"}),
                    "\n    ",
                                        W('wdg.flex10', 'wdg.flex', {"content": [
                                              W('wdg.button11', 'wdg.button', {
                          text: "Exporter la base",
                          icon: "export"}),
                                              W('wdg.button12', 'wdg.button', {
                          text: "Importer la base",
                          icon: "import",
                          type: "warning"})]}),
                    "\n"]}),
                "\n"]}),
          W({
              elem: "div",
              attr: {
                key: "Patient",
                class: "x-page theme-color-bg-B3"},
              prop: {"$key": "Patient"},
              children: [
                W({
                  elem: "header",
                  attr: {
                    id: "patient.title",
                    class: "theme-color-bg-B5"}}),
                "\n\n",
                W({
                  elem: "div",
                  children: [
                    "\n    ",
                    W({
                      elem: "p",
                      attr: {
                        id: "patient.hint",
                        class: "theme-color-bg-B0"}}),
                    "\n    ",
                                        W('wdg.flex13', 'wdg.flex', {"content": [
                                              W('patient.exit', 'wdg.button', {
                          text: "Sortie du patient",
                          icon: "user"}),
                                              W('wdg.button14', 'wdg.button', {
                          text: "Créer une nouvelle rencontre",
                          icon: "plus"})]}),
                    "\n    ",
                    W({
                      elem: "hr"}),
                    "\n    ",
                                        W('wdg.flex15', 'wdg.flex', {"content": [
                                              W('wdg.button16', 'wdg.button', {
                          text: "Retour à l'écran principal",
                          icon: "back",
                          href: "#Home",
                          type: "simple"})]}),
                    "\n"]}),
                "\n"]}),
          W({
              elem: "div",
              attr: {
                key: "Visit",
                class: "x-page theme-color-bg-B3"},
              prop: {"$key": "Visit"},
              children: [
                W({
                  elem: "header",
                  attr: {
                    id: "visit.title",
                    class: "theme-color-bg-B5"}}),
                "\n\n",
                W({
                  elem: "div",
                  children: [
                    "\n    ",
                    W({
                      elem: "div",
                      attr: {"id": "visit.data"}}),
                    "\n    ",
                    W({
                      elem: "hr"}),
                    "\n    ",
                    W({
                      elem: "center",
                      children: [
                        "\n        ",
                                                W('wdg.button17', 'wdg.button', {
                          text: "Terminer la rencontre",
                          icon: "ok"}),
                        "        \n    "]}),
                    "\n"]}),
                "\n"]})]})
        W.bind('wdg.layout-stack9',{"value":{"S":["onPage"]}});
I(1,"title-home")
        W.bind('wdg.button11',{"action":{"S":[["page.home","onExport"]]}});
        W.bind('wdg.button14',{"action":{"S":[["page.patient","onNewVisit"]]}});
        W.bind('wdg.button17',{"action":{"S":[["page.visit","onClose"]]}});
    }
);
