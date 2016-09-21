/** @module app */require( 'app', function(exports, module) { var _intl_={"en":{"title-home":"Search / Register a patient"},"fr":{"title-home":"Rechercher / Enregistrer un patient"}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
    "use strict";

require("font.josefin");

var $ = require("dom");
var Form = require("form");
var Structure = require("structure");

var pages = {
    home: require("page.home"),
    patient: require("page.patient"),
    visit: require("page.visit")
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


  
module.exports._ = _;
/**
 * @module app
 * @see module:$
 * @see module:app
 * @see module:dom
 * @see module:font.josefin
 * @see module:form
 * @see module:page.home
 * @see module:page.patient
 * @see module:page.visit
 * @see module:structure

 */
});