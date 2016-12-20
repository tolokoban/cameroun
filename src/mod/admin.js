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
require('font.mystery-quest');

var $ = require("dom");
var W = require("x-widget").getById;
var WS = require("tfw.web-service");
var Cfg = require("$");
var Err = require("tfw.message").error;
var Msg = require("tfw.message").info;
var Structure = require("structure");


exports.start = function() {
    location.hash = "#Loading";
    Structure.load().then(function() {
        if( location.hash != "#Loading" ) checkLogin();
        else location.hash = "#Loading";
    });
};


exports.onPage = function( pageId ) {
    console.info("[admin] pageId=...", pageId);
    if( !checkLogin() )  return;
};

exports.onEditData = function( id ) {
    alert( id );
};

exports.onLogin = function() {
    var modal = W('modal.login');
    modal.visible = false;
    var user = W('login').value;
    var password = W('password').value;
    WS.login(user, password).then(function(ret) {
        alert("OK : " + JSON.stringify(ret));
    }, function(err) {
        console.error( err );
        Err( "L'authentification a échoué !" );
        window.setTimeout(function() {
            modal.visible = true;            
        }, 3000);
    });
};


function checkLogin() {
    if( !WS.isLogged() ) {
        W('modal.login').attach();
        W('login').focus = true;
        return false;
    }
    return true;
}
