"use strict";

var Structure = require("structure");


exports.getPatientCaption = function( patient ) {
    return patient['#PATIENT-LASTNAME'].toUpperCase()
        + " " + patient['#PATIENT-FIRSTNAME']
        + " " + exports.expand(patient['#PATIENT-SECONDNAME'])
        + " (" + exports.expand(patient['#PATIENT-COUNTRY'], '#COUNTRY') + ")";
};


/**
 * Quand c'est possible, les données  sont stoquées sous forme de leur
 * identifiant qui  commence par un  dièse `#`. Cette  fonction permet
 * donc de retrouver le texte  associé à l'identifiant, ou à retourner
 * le texte tel quel s'il ne s'agit pas d'un identifiant.
 */
exports.expand = function( text, type, level ) {
    if( typeof text === 'undefined' ) return '';
    if( typeof type === 'undefined' ) return text;
    if( typeof level === 'undefined' ) level = 0;

    var typeDic = Structure.types[type];
    if( typeof typeDic === 'undefined' ) return text;
    var expansion = typeDic.children[text.trim().toUpperCase()];
    if( typeof expansion === 'undefined' ) return text;
    return expansion.caption || '';
};


var WEEK_DAY = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
var MONTH = [
    'Janvier', 'Février', 'Mars', 'Avril',
    'Mai', 'Juin', 'Juillet', 'Août',
    'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

exports.date = function( ms ) {
    var date = new Date( ms );
    return WEEK_DAY[date.getDay()]
        + " " + date.getDate()
        + " " + MONTH[date.getMonth()]
        + " " + date.getFullYear()
        + " à " + exports.pad(date.getHours())
        + ":" + exports.pad(date.getMinutes());
};


exports.pad = function( txt, size, prepend ) {
    if( typeof size !== 'number' ) size = 2;
    if( typeof prepend !== 'string' ) prepend = '0';

    txt = "" + txt;
    while (txt.length < size) txt = prepend + txt;
    return txt;
};
