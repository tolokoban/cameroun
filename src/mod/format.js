"use strict";

/**
 * @param {object} patientData.
 */
exports.getPatientCaption = getPatientCaption;
/**
 * Quand c'est possible, les données  sont stoquées sous forme de leur
 * identifiant qui  commence par un  dièse `#`. Cette  fonction permet
 * donc de retrouver le texte  associé à l'identifiant, ou à retourner
 * le texte tel quel s'il ne s'agit pas d'un identifiant.
 */
exports.expand = expand;
exports.date = date;
/**
 * @param {string} txt
 * @param {number} size
 * @param {string='0'} prepend
 */
exports.pad = pad;
/**
 * @param {string} typeName
 * @return `{ list: ["Oui", "Non"], map: { oui: "#YES", non: "#NO" } }`
 * The `list` array is always sorted (ascending).
 */
exports.getCompletion = getCompletion;



var Utils = require( "utils" );
var DateUtil = require( "date" );
var Structure = require( "structure" );


function getPatientCaption( patientData ) {
  console.info("[format] patientData=", patientData);
  var lastname = ( patientData[ '#PATIENT-LASTNAME' ] || '' ).trim();
  var firstname = ( patientData[ '#PATIENT-FIRSTNAME' ] || '' ).trim();
  var secondname = ( patientData[ '#PATIENT-SECONDNAME' ] || '' ).trim();
  var birth = patientData[ '#PATIENT-BIRTH' ];
  if ( typeof birth === 'number' ) {
    var dat = DateUtil.toDate( birth );
    birth = dat.getFullYear() + "-" + ( 1 + dat.getMonth() ) + "-" + dat.getDate();
  }
  var name = lastname.toUpperCase() +
    ' ' + Utils.capitalize( firstname );
  if ( secondname.length > 0 ) name += ' ' + Utils.capitalize( secondname );
  name += ' (' + birth + ') @' +
    expand( patientData[ '#PATIENT-COUNTRY' ], '#NATIONALITY' );
  if( patientData.id ) name += "  [" + patientData.id + "]";
  return name;
};


function expand( text, type, level ) {
  if ( typeof text === 'undefined' ) return '';
  if ( typeof type === 'undefined' ) return text;
  if ( typeof level === 'undefined' ) level = 0;

  // Deal with dates, numbers, ...
  if ( typeof text !== 'string' ) return text;

  type = purifyTypeName( type );
  
  var typeDic = type;
  if ( typeof typeDic === 'string' ) typeDic = Structure.value.types[ type ];
  var key = text.trim().toUpperCase();
  var expansion = findExpansion( key, typeDic, level );
  return expansion || text;
};

/**
 * Recherche récursive à un certain niveau de l'arbre des types.
 */
function findExpansion( text, typeDic ) {
  if ( !typeDic ) return undefined;

  var item = typeDic.children[ text ];
  if ( typeof item === 'undefined' ) {
    var k, v;
    for ( k in typeDic.children ) {
      v = typeDic.children[ k ];
      item = findExpansion( text, v );
      if ( item ) return item;
    }
  } else {
    return item.caption;
  }
  return undefined;
}


var WEEK_DAY = [ 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche' ];
var MONTH = [
    'Janvier', 'Février', 'Mars', 'Avril',
    'Mai', 'Juin', 'Juillet', 'Août',
    'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function date( seconds ) {
  var date = new Date( seconds * 1000 );
  return WEEK_DAY[ date.getDay() ] +
    " " + date.getDate() +
    " " + MONTH[ date.getMonth() ] +
    " " + date.getFullYear() +
    " à " + pad( date.getHours() ) +
    ":" + pad( date.getMinutes() );
};


function pad( txt, size, prepend ) {
  if ( typeof size !== 'number' ) size = 2;
  if ( typeof prepend !== 'string' ) prepend = '0';

  txt = "" + txt;
  while ( txt.length < size ) txt = prepend + txt;
  return txt;
};

// Remove potential tailing plus. this is just a marker for lists.
function purifyTypeName( typeName ) {  
  if ( typeof typeName === 'string' && typeName.charAt( typeName.length - 1) === '+' ) {
    typeName = typeName.substr( 0, typeName.length - 1 );
  }
  return typeName;  
}

var NO_COMPLETION = {
  list: [],
  map: {}
};

function getCompletion( typeName ) {
  if ( typeof typeName === 'undefined' ) 
    return NO_COMPLETION;
  typeName = purifyTypeName( typeName );
  var type = Structure.value.types[typeName];
  if ( typeof type === 'undefined' ) 
    return NO_COMPLETION;
  type = type.children;
  if ( typeof type === 'undefined' ) 
    return NO_COMPLETION;
  
  var list = [];
  var map = {};
  var key,
    val;
  for ( key in type ) {
    val = type[key];
    val.caption = val.caption || "";
    list.push( val.caption );
    map[val.caption.toLowerCase( )] = key;
  }
  list.sort( );
  return { list: list, map: map };  
};
