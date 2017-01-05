"use strict";

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
    patient: require("page.patient"),
    visit: require("page.visit")
};

exports.start = function() {
    location.hash = "#Loading";
    Structure.load().then(function() {
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
