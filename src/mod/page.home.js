var $ = require("dom");
var W = require("x-widget").getById;
var DB = require("tfw.data-binding");
var Cfg = require("$").config;
var Form = require("form");
var Data = require("data");
var Modal = require("wdg.modal");
var Format = require("format");
var Button = require("wdg.button");
var Structure = require("structure");
var InputSearch = require("input.search");
var ModalPatient = require("modal.patient");
var LocalDownload = require("tfw.local-download");


exports.onPage = function() {
    var search = new InputSearch();
    $.clear( 'search', search );
    search.focus = true;
    
    $('version').textContent = "Version " + Cfg.version 
        + " - " + Cfg.date.substr(0, 10) + " "
    + Cfg.date.substr(11, 8);
    var count = Data.countPatients();
    W('patients-count').text = count + " patient" + (count < 2 ? "" : "s");
};


exports.onExport = function() {
    var data = Data.export();
    LocalDownload.saveAs( data, "base.json", "application/json" );
};


/**
 * To get to the admin page, the current user must be authentificated.
 */
exports.onAdmin = function() {
    location = "admin.html";
};


exports.onNewPatient = function() {
    ModalPatient("Nouveau patient", function(patient) {
        var id = Data.newPatient( patient );
        location.hash = "Patient/" + id;
    });
};
