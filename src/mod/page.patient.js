"use strict";

var $ = require("dom");
var W = require("x-widget").getById;
var Data = require("data");
var Modal = require("wdg.modal");
var Format = require("format");


var g_patient;


exports.onPage = function() {
    var hash = location.hash.split('/');
    var patientId = hash[1];
    g_patient = Data.getPatient( patientId );
    document.getElementById('patient.title').textContent = Format.getPatientCaption( g_patient );

    var hint = document.getElementById('patient.hint');
    var btnExit = W('patient.exit');
    btnExit.visible = false;

    if (!Array.isArray(g_patient.$admissions) || g_patient.$admissions.length == 0) {
        hint.textContent = "Ce patient n'a encore jamais été admis dans ce service.";
    } else {
        var admission = g_patient.$admissions[g_patient.$admissions.length - 1];
        if (typeof admission.exit === 'undefined') {
            // Toujours admis dans l'hôpital.
            hint.innerHTML = "Ce patient est admis dans ce service depuis<br/><b>"
                + Format.date(admission.enter) + "</b>.";
            btnExit.visible = true;
        } else {
            hint.innerHTML = "Ce patient a été admis dans ce service du <ul><li><b>"
                + Format.date(admission.enter) + "</b></li><li>au <b>"
                + Format.date(admission.exit) + "</b>.</li></ul>";
        }
    }
};


exports.onNewVisit = function() {
    var visit = Data.getLastVisit( g_patient );
    if (!visit || visit.exit) {
        // Il n'y a pas de visite en cours.
        visit = Data.createVisit( g_patient );
        location.hash = "#Visit/" + g_patient.$id;
    } else {
        var content = $.div([
            "Une visite débutée ",
            $.tag('b', [Format.date(visit.enter)]),
            " n'a pas été cloturée.",
            $.tag('br'),
            "Voulez-vous la poursuivre ?",
            $.tag('hr'),
            $.tag('em', ["Si vous choisissez NON, nous créerons une nouvelle rencontre."])            
        ]);
        Modal.confirm(
            content,
            function() {
                location.hash = "#Visit/" + g_patient.$id;
            },
            function() {
                visit.exit = visit.enter;
                Data.createVisit( g_patient );
                location.hash = "#Visit/" + g_patient.$id;
            }
        );
    }
};
