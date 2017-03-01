"use strict";

//require("offline");
require("font.josefin");

var $ = require("dom");
var Err = require("tfw.message").error;
var Msg = require("tfw.message").info;
var Modal = require("wdg.modal");

var Form = require("form");
var Structure = require("structure");

var pages = {
    loading: require("page.loading"),
    home: require("page.home"),
    list: require("page.list"),
    patient: require("page.patient"),
    visit: require("page.visit"),
    exam: require("page.exam")
};

exports.start = function() {
    //nw.Window.get().showDevTools( null, start );
    start();
};

function start() {
    location.hash = "#Loading";
    Structure.then(function() {
        location.hash = "#Home";
    }, function(err) {
        err.context = "Loading...";
        console.error( err );
        Modal.alert( _('loading-error', JSON.stringify( err, null, '  ' ) ) );
    });
};


exports.onPage = function( pageId ) {
    var page = pages[pageId.toLowerCase()];
    if( typeof page !== 'undefined' ) page.onPage();
};
