var $ = require("dom");
var DB = require("tfw.data-binding");
var Form = require("form");
var Data = require("data");
var Button = require("wdg.button");
var Structure = require("structure");


exports.onPage = function() {
    var defSearchForm = Structure.getForm('@PATIENT');
    var wdgSearchForm = new Form( defSearchForm );
    var divSearchForm = document.getElementById('search-form');
    var divSearchResult = document.getElementById('search-result');
    $.add( divSearchForm, wdgSearchForm );
    $.clear(divSearchResult);
    wdgSearchForm.focus = true;
    var btnRegister = new Button({ 
        text: "Enregistrer un nouveau patient", 
        enabled: false,
        icon: "plus"
    });
    $.add( 'search-button', btnRegister );

    DB.bind( wdgSearchForm, 'value', function(v) {
        var keys = wdgSearchForm.keys;
        var key, val;
        btnRegister.enabled = true;
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            if (key == '#PATIENT-SECONDNAME') continue;
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


