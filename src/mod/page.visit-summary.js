"use strict";

const $ = require( "dom" );
const Format = require( "format" );
const Patients = require( "patients" );
const Structure = require( "structure" );
const Button = require("tfw.view.button")

let g_patient = null;


exports.onPage = function () {
  const hash = location.hash.split( '/' );
  const patientId = hash[ 1 ];
  const date = parseInt( hash[ 2 ], 10 );

  Patients.get( patientId ).then( function ( patient ) {
    g_patient = patient;
    document.getElementById( 'visit-summary.title' ).textContent =
      Format.getPatientCaption( patient.data );
    const container = document.getElementById( "visit-summary.data" );
    $.clear( container, $.tag( 'h1', [
      `Consultation du ${Format.date( date )}`
    ] ) );
    g_patient.admissions.forEach( function ( admission ) {
      admission.visits.forEach( function ( visit ) {
        const enter = visit.enter;
        if ( enter !== date ) return;
        const ul = $.tag( 'ul' );
        $.add( container, ul );
        for ( const id of Object.keys(visit.data) ) {
          const field = getField( id ) || {
            caption: id,
            type: id
          };
          let type
          if( field.type ) {
            if ( field.type.charAt( field.type.length - 1 ) === '+' ) {
              type = Structure.value.types[ field.type.substr( 0, field.type.length - 1 ) ];
            } else {
              type = Structure.value.types[ field.type ];
            }
          }
          let value = visit.data[ id ];
          if ( !Array.isArray( value ) ) value = [ value ];
          value = value.map( function ( x ) {
            return Format.expand( x, type ? type.id : undefined );
          } );
          const b = $.tag( 'b', [ value.join( ", " ) ] );
          const li = $.tag( 'li', [ field.caption + ": ", b ] );
          $.add( ul, li );
        }
      } );
    } );
    $.add( container, new Button({
        href: `react.html#consultation/edit/${patientId}/${date}`,
        icon: 'edit'
    }))
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
