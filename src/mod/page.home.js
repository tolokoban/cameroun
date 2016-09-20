var $ = require("dom");
var DB = require("tfw.data-binding");
var Form = require("form");
var Data = require("data");
var Format = require("format");
var Button = require("wdg.button");
var Structure = require("structure");
var LocalDownload = require("tfw.local-download");


exports.onPage = function() {
    var defSearchForm = Structure.patient;
    var wdgSearchForm = new Form( defSearchForm );
    var divSearchForm = document.getElementById('search-form');
    $.clear( divSearchForm );
    var divSearchResult = document.getElementById('search-result');
    $.clear( divSearchResult );
    var divSearchButton = document.getElementById('search-button');
    $.clear( divSearchButton );
    
    $.add( divSearchForm, wdgSearchForm );
    wdgSearchForm.focus = true;
    var btnRegister = new Button({
        text: "Enregistrer un nouveau patient",
        enabled: false,
        icon: "plus"
    });
    $.add( 'search-button', btnRegister );

    DB.bind( wdgSearchForm, 'value', function(v) {
        var suggestions = Data.findPatients( v );
        $.clear( divSearchResult );
        if (suggestions.length > 0) {
            suggestions.forEach(function (id) {
                var patient = Data.getPatient(id);
                var btn = new Button({
                    type: 'simple',
                    text: Format.getPatientCaption( patient ),
                    href: "#Patient/" + id,
                    wide: true
                });
                $.add( divSearchResult, $.tag('li', [btn] ) );
            });
        }

        // Pas de suggestions, mais peut-être un nouvel enregistrement.
        var keys = wdgSearchForm.keys;
        var key, val;
        btnRegister.enabled = true;
        btnRegister.visible = true;
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            if (Array.isArray(defSearchForm[key].tags)) {
                if (defSearchForm[key].tags.indexOf('OPTIONAL') > -1) {
                    // Les  champs  optionels  sont  ignorés  pour  le
                    // mécanisme    de    désactivation   du    bouton
                    // d'enregistrement d'un nouveau patient.
                    continue;
                }
            }
            val = v[key];
            if (!val || val.trim().length == 0) {
                btnRegister.enabled = false;
                return;
            }
        }
    });

    btnRegister.on(function() {
        var id = Data.newPatient( wdgSearchForm.value );
        location.hash = "Patient/" + id;
    });
};


exports.onExport = function() {
    var data = Data.export();
    LocalDownload.saveAs( data, "base.json", "application/json" );
};
