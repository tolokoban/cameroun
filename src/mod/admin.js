"use strict";

/**
 * @module admin
 *
 * @description
 * 
 *
 * @example
 * var mod = require('admin');
 */
var $ = require("dom");
var Cfg = require("$");
var Button = require("wdg.button");


exports.start = function() {
    var btnEditTypes = new Button({ text: "Editer les TYPES", icon: 'edit' });
    var btnEditForms = new Button({ text: "Editer les FORMS", icon: 'edit' });
    var btnEditPatient = new Button({ text: "Editer les PATIENT", icon: 'edit' });

    $.add( document.body, btnEditPatient, btnEditForms, btnEditTypes );

    console.info("[admin] Cfg=...", Cfg);
};
