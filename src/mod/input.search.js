"use strict";


"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var Text = require("wdg.text");
var Data = require("data");
var Button = require("wdg.button");


/**
 * @class Search
 *
 * Arguments:
 * * __visible__ {boolean}: Visibility of the component.
 *
 * @example
 * var Search = require("input.search");
 * var instance = new Search({visible: false});
 */
var Search = function(opts) {
    var input = new Text({
        label: "Rechercher un patient par son nom, prénom, ...",
        wide: true
    });
    var btnUser = new Button({
        text: "Aucune correspondance...", icon: "user", type: "simple", enabled: false, wide: true
    });
    var elem = $.elem( this, 'div', [input, btnUser] );

    DB.propRemoveClass( this, 'visible', 'hide' );
    DB.propBoolean( this, 'focus' )(function(v) {
        if( v ) {
            window.setTimeout(function() {
                input.focus = true;
            });
        }
    });

    opts = DB.extend({
        visible: true,
        focus: false
    }, opts, this);

    var reverseLookup = {};
    var list = [];
    var patients = Data.getAllPatients();
    patients.forEach(function (patient) {
        var id = patient[0];
        var name = patient[1].toUpperCase() + " " + patient[2] + " (" + patient[3] + ")";
        reverseLookup[name.trim().toLowerCase()] = id;
        list.push( name );
    });
    input.list = list;
    DB.bind( input, 'value', function( v ) {
        var key = (v || '').toLowerCase();
        var id = reverseLookup[key];
        btnUser.enabled = false;
        btnUser.text = "Aucune correspondance...";
        if( id ) {
            btnUser.enabled = true;
            btnUser.text = v;
            btnUser.href = "#Patient/" + id;
        }
    });
};


module.exports = Search;
