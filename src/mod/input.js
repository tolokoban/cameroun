"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var Data = require("data");
var Text = require("wdg.text");
var Format = require("format");
var Structure = require("structure");


var Input = function( args ) {
    var that = this;
    var visit;

    var elem = $.elem(this, 'div', 'input');

    if (typeof args.patient === 'undefined') {
        throw Error("[input] Missing mandatory argument: `patient`!");
    }
    var patient = args.patient;
    visit = Data.getLastVisit( patient );

    var def = args.def;
    addWidget( elem, def, patient, visit );
};


/**
 * Il existe trois types d'inputs :
 * * __Simple__ : Texte libre avec suggestions éventuelles.
 * * __Multiple__ : C'est une liste  alimentée par un texte libre avec
 *   suggestions. Les types `multiple` terminent par un `+`.
 * * __Hiérarchique__  : Plusieurs  textes libres  dont la  suggestion
 *   dépend de la valeur du champ juste au dessus.
 */
function addWidget( container, def, patient, visit ) {
    if (def.type && def.type.charAt(def.type.length - 1) == '+') {
        addWidgetMultiple( def, patient, visit );
        return;
    }

    var value = Data.getValue( patient, def.id );
    var completion = getCompletion( def.type );
    var wdg = new Text({
        wide: true,
        list: completion.list,
        placeholder: Format.expand(value.old, def.type),
        value: Format.expand(value.new, def.type)
    });
    DB.bind( wdg, 'value', function(v) {
        if (typeof v !== 'string') return;
        v = v.trim();
        if (v.length == 0) {
            delete visit.data[def.id];
        } else {
            // Quand c'est possible, on essaie de stoquer un ID plutôt qu'un texte libre.
            var valueID = completion.map[v.toLowerCase()];
            visit.data[def.id] = valueID || v;
        }
        Data.save();
    });

    $.add( container, $.div([
        $.div([def.caption]),
        $.div([wdg])
    ]));

    addWidgetMultiple( container, def, patient, visit );
}

function addWidgetMultiple( container, def, patient, visit ) {
    // Gérer les hiérarchies.
    var wdg;
    var parent = def;
    var child = def;
    var level = 0;
    while (null != (child = getFirstChild(parent))) {
        level++;
        createHierarchicalWidget( container, patient, def, child, level );
        parent = child;
    }
}

function createHierarchicalWidget( container, patient, def, child, level ) {
    var type = Structure.types[def.type];
    var value = Data.getValue( patient, child.id );
    var wdg = new Text({
        wide: true,
        placeholder: Format.expand(value.old, type, level),
        value: Format.expand(value.new, type, level)
    });
    $.add( container, $.div([
        $.div([child.caption]),
        $.div([wdg])
    ]));
}


function getFirstChild( def ) {
    if (typeof def.children === 'undefined' ) return null;
    var k;
    for( k in def.children ) {
        return def.children[k];
    }
    return null;
}


var NO_COMPLETION = { list: [], map: {} };

function getCompletion( type ) {
    if( typeof type === 'undefined' ) return NO_COMPLETION;
    type = Structure.types[type];
    if( typeof type === 'undefined' ) return NO_COMPLETION;
    type = type.children;
    if( typeof type === 'undefined' ) return NO_COMPLETION;

    var list = [];
    var map = {};
    var key, val;
    for( key in type ) {
        val = type[key];
        list.push( val.caption );
        map[val.caption.toLowerCase()] = key;
    }
    list.sort();
    return {list: list, map: map};
}

module.exports = Input;
