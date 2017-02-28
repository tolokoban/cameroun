"use strict";

var $ = require("dom");
var Button = require("wdg.button");
var Format = require("format");
var Patients = require("patients");


exports.onPage = function() {
    $.clear('patients-list');
    Patients.all().then(function(patients) {
        var id, patientData;
        for( id in patients.records ) {
            patientData = patients.records[id];
            var btn = new Button({
                type: 'simple',
                href: '#Patient/' + id,
                text: Format.getPatientCaption( patientData )
            });
            $.add('patients-list', $.tag('li', [btn]));
        }
    });
};
