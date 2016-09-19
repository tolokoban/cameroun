"use strict";

var $ = require("dom");
var Form = require("form");
var Structure = require("structure");

var pages = {
    home: require("page.home"),
    patient: require("page.patient")
};

exports.start = function() {
    console.info("[app] Structure.types=...", Structure.types);
    console.info("[app] Structure.forms=...", Structure.forms);

    location.hash = "Home";
};


exports.onPage = function( pageId ) {
    var page = pages[pageId.toLowerCase()];
    if( typeof page !== 'undefined' ) page.onPage();
};
