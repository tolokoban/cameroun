"use strict";

require("font.josefin");

var $ = require("dom");
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
    });
};


exports.onPage = function( pageId ) {
    var page = pages[pageId.toLowerCase()];
    if( typeof page !== 'undefined' ) page.onPage();
};
