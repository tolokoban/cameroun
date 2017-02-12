"use strict";

var $ = require("dom");
var Data = require("data");
var Button = require("wdg.button");


exports.onPage = function() {
    $.clear('patients-list');
    var patients = Data.getAllPatients();
    patients.forEach(function (patient) {
        // Patient is an array:
        // [id, lastname, firstname, birthdate]
        var btn = new Button({
            type: 'simple',
            href: '#Patient/' + patient[0],
            text: patient[1].toUpperCase() + " " + patient[2] + " (" + patient[3] + ")"
        });
        $.add('patients-list', $.tag('li', [btn]));
    });
};
