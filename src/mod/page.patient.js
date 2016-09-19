"use strict";

var $ = require("dom");
var W = require("x-widget").getById;
var Data = require("data");
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
            hint.textContent = "Ce patient est admis dans ce service depuis "
                + Format.date(admission.enter) + ".";
            btnExit.visible = true;
        } else {
            hint.textContent = "Ce patient a été admis dans ce service du "
                + Format.date(admission.enter) + " au "
                + Format.date(admission.exit) + ".";
        }
    }
};


exports.onNewVisit = function() {
    var currentAdmission = g_patient.$admissions[g_patient.$admissions.length - 1];
    if (!currentAdmission || currentAdmission.exit) {
        currentAdmission = {
            enter: Date.now(),
            visits: [{ enter: Date.now() }]
        };
        g_patient.$admissions.push( currentAdmission );
    }
    else {
        currentAdmission.$visits.push({ enter: Date.now() });
    }
    location.hash = "#Visit/" + g_patient.id;
};
