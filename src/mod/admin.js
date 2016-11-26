"use strict";

/**
 * @module admin
 *
 * @description
 *
 *
 * @example
 * var mod = require('admin');
 */
require('font.josefin');

var $ = require("dom");
var W = require("x-widget").getById;
var WS = require("tfw.web-service");
var Cfg = require("$");
var Structure = require("structure");


exports.start = function() {
    location.hash = "#Loading";
    Structure.load().then(function() {
        if( location.hash == "#Admin" ) checkLogin();
        else location.hash = "#Admin";
    });
};


exports.onPage = function( pageId ) {
    console.info("[admin] pageId=...", pageId);
    if( !checkLogin() )  return;
};


function checkLogin() {
    if( !WS.isLogged() ) {
        W('modal.login').attach();
        W('login').focus = true;
        return false;
    }
    return true;
}
