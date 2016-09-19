"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var Data = require("data");
var Text = require("wdg.text");
var Structure = require("structure");


var Input = function( args ) {
    var that = this;
    var visit;

    var elem = $.elem(this, 'div', 'input');
    var divCaption = $.div();
    var divInput = $.div();
    $.add( elem, $.div([divCaption, divInput]) );

    if (typeof args.patient === 'undefined') {
        throw Error("[input] Missing mandatory argument: `patient`!");
    }
    var patient = args.patient;
    visit = Data.getLastVisit( patient );

    var def = args.def;
    divCaption.textContent = def.caption;
    var wdg = createWidget( def, patient, visit );
    $.add( divInput, wdg );
    
    
};


function createWidget( def, patient, visit ) {
    var value = Data.getValue( patient, def.id );
    var completion = getCompletion( def.type );
    var wdg = new Text({
        wide: true,
        list: completion.list,
        placeholder: value.old,
        value: value.new
    });
    DB.bind( wdg, 'value', function(v) {
        if (typeof v !== 'string') return;
        v = v.trim();
        if (v.length == 0) {
            delete visit.value[def.id];
        } else {
            visit.value[def.id] = v;
        }
console.info("[input] visit=...", visit);        
        Data.save();
    });
    return wdg;
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
