"use strict";

var $ = require("dom");
var Form = require("form");
var Modal = require("wdg.modal");
var Input = require("input");
var Format = require("format");
var Patients = require("patients");
var ShowHide = require("wdg.showhide");
var DateUtil = require("date");
var Structure = require("structure");



var g_patient;


exports.onPage = function() {
    var hash = location.hash.split('/');
    var patientId = hash[1];
    Patients.get( patientId ).then(function( patient ) {
        g_patient = patient;
        document.getElementById('visit.title').textContent =
            Format.getPatientCaption( patient.data );
        var container = document.getElementById("visit.data");
        $.clear( container );
        addForm( container, Structure.value.forms );
    });
};


exports.onClose = function() {
    var visit = Patients.lastVisit( g_patient );
    visit.exit = DateUtil.now();
    Patients.save( g_patient );
    location.hash = "#Patient/" + g_patient.id;
};

exports.onBack = function() {
    location.hash = "#Patient/" + g_patient.id;
};

/**
 * @param {DOM} parent
 * @param {object} def - Définition des zones de saisie.
 */
function addForm( parent, def ) {
    if( typeof def === 'undefined' ) return;

    var key, val;
    var wdg, div;
    for( key in def ) {
        val = def[key];
        if (key.charAt(0) == '#') {
            // Input
            wdg = new Input({
                def: val,
                patient: g_patient
            });
        } else {
            // Show/Hide
            div = $.div();
            wdg = new ShowHide({
                label: val.caption,
                content: [div],
                simple: true,
                value: false
            });
            addForm( div, val.children );
        }
        $.add( parent, wdg );
    }
}

exports.onNewVisit = function() {
    Patients.createVisit().then(function(visit) {
        var len = g_patient.admissions.length;
        var lastAdmission = g_patient.admissions[len - 1];
        location.hash = "#Visit/" + g_patient.id + "/" + (len - 1) + "/"
            + (lastAdmission.visits.length - 1);
    });
};
