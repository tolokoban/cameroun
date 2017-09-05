"use strict";

var $ = require( "dom" );
var Format = require( "format" );
var Patients = require( "patients" );
var Structure = require( "structure" );

var g_patient;


exports.onPage = function () {
  var hash = location.hash.split( '/' );
  var patientId = hash[ 1 ];
  var date = parseInt( hash[ 2 ] );

  Patients.get( patientId ).then( function ( patient ) {
    g_patient = patient;
    document.getElementById( 'visit-summary.title' ).textContent =
      Format.getPatientCaption( patient.data );
    var container = document.getElementById( "visit-summary.data" );
    $.clear( container, $.tag( 'h1', [
      "Consultation du " + Format.date( date )
    ] ) );
    g_patient.admissions.forEach( function ( admission ) {
      admission.visits.forEach( function ( visit ) {
        var enter = visit.enter;
        if ( enter != date ) return;
        var ul = $.tag( 'ul' );
        $.add( container, ul );
        var id, value, type, field;
        for ( id in visit.data ) {
          field = getField( id ) || {
            caption: id,
            type: id
          };
          type = undefined;
          if( field.type ) {
            if ( field.type.charAt( field.type.length - 1 ) === '+' ) {
              type = Structure.value.types[ field.type.substr( 0, field.type.length - 1 ) ];
            } else {
              type = Structure.value.types[ field.type ];
            }
          }
          value = visit.data[ id ];
          if ( !Array.isArray( value ) ) value = [ value ];
          value = value.map( function ( x ) {
            return Format.expand( x, type ? type.id : undefined );
          } );
          var b = $.tag( 'b', [ value.join( ", " ) ] );
          var li = $.tag( 'li', [ field.caption + ": ", b ] );
          $.add( ul, li );
        }
      } );
    } );
  } );
};

exports.onBack = function () {
  location = "#Patient/" + g_patient.id;
};

/**
 * Recherche récursive d'un champ dans le formulaire principal de visite.
 */
function getField( id, dic ) {
  if ( typeof dic === "undefined" ) dic = Structure.value.forms;
  var key, val, result;
  for ( key in dic ) {
    val = dic[ key ];
    if ( key == id ) return val;
    if ( val.children ) {
      result = getField( id, val.children );
      if ( result ) return result;
    }
  }
  return null;
}
