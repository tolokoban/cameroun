"use strict";

/**
 * Créer des formulaires génériques.
 */
var $ = require("dom");
var DB = require("tfw.data-binding");
var Text = require("wdg.text");
var Structure = require("structure");


var Form = function( def ) {
    var elem = $.elem(this, 'div', 'form');
    var table = $.div('table');
    $.add( elem, table );
    var inputs = createInputs.call( this, table, def );
};


function createInputs( table, def ) {
    var inputs = [];
    var id, item;
    var row, wdg;
    for( id in def ) {
        item = def[id];
        wdg = new Text({ wide: true, list: getCompletion(item.type) });
        inputs.push( wdg );
        row = $.div([
            $.div([item.caption]),
            $.div([wdg])
        ]);
        $.add( table, row );
    }

    var slotChange = function(v) {
        console.info("[form] v=...", v);
    };

    var i;
    for (i = 0 ; i < inputs.length - 1 ; i++) {
        DB.bind( inputs[i], 'action', inputs[i + 1], 'focus', { value: true } );
        DB.bind( inputs[i], 'value', slotChange );
    }

    return inputs;
}


function getCompletion( type ) {
    if( typeof type === 'undefined' ) return [];
    type = Structure.types[type];
    if( typeof type === 'undefined' ) return [];
    type = type.children;
    if( typeof type === 'undefined' ) return [];

    var list = [];
    var key, val;
    for( key in type ) {
        val = type[key];
        list.push( val.caption );
    }
    list.sort();
    return list;
}


module.exports = Form;
