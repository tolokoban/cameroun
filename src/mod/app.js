"use strict";

var $ = require("dom");
var Form = require("form");
var Structure = require("structure");


exports.start = function() {
    console.info("[app] Structure.types=...", Structure.types);
    console.info("[app] Structure.forms=...", Structure.forms);

    var defSearchForm = Structure.getForm('@PATIENT', '@SEARCH');
    var wdgSearchForm = new Form( defSearchForm );
    var divSearchForm = document.getElementById('search-form');
    $.add( divSearchForm, wdgSearchForm );
};


exports.onPage = function( pageId ) {

};
