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
    visitsummary: require("page.visit-summary"),
    exam: require("page.exam")
};

exports.start = function() {
  var manifest = nw.App.manifest;
  if (manifest && manifest.debug) {
    nw.Window.get().showDevTools( null, start );
  } else {
    start();
  }
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
  console.info("pageId=", pageId);
    var page = pages[pageId.toLowerCase()];
console.info("page=", page)    ;
    if( typeof page !== 'undefined' ) page.onPage();
};
