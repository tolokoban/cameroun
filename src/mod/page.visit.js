"use strict";

const $ = require( "dom" ),
      Input = require( "input" ),
      Widget = require("x-widget"),
      Format = require( "format" ),
      Patients = require( "patients" ),
      Expand = require( "tfw.view.expand" ),
      ShowHide = require( "wdg.showhide" ),
      DateUtil = require( "date" ),
      Structure = require( "structure" );


let g_patient = null;
let g_wdgVisitDate = null;

exports.onPage = onPage;
exports.onClose = onClose;
exports.onBack = onBack;
exports.onNewVisit = onNewVisit;


function onPage() {
    const hash = location.hash.split( '/' );
    const patientId = hash[ 1 ];
    Patients.get( patientId ).then( function ( patient ) {
        g_patient = patient;
        patient.data.id = patientId;
        document.getElementById( 'visit.title' ).textContent =
            Format.getPatientCaption( patient.data );
        const container = document.getElementById( "visit.data" );
        $.clear( container );
        addForm( container, Structure.value.forms );
        g_wdgVisitDate = Widget.getById("visit.date");
        console.info("[page.visit] g_wdgVisitDate=", g_wdgVisitDate);
        g_wdgVisitDate.value = DateUtil.now();
    } );
}

function onClose() {
    const visit = Patients.lastVisit( g_patient );
    visit.enter = g_wdgVisitDate.value;
    visit.exit = g_wdgVisitDate.value;
    console.info("[page.visit] g_wdgVisitDate.value, DateUtil.now()=", g_wdgVisitDate.value, DateUtil.now());
    // visit.exit = DateUtil.now();
    Patients.save( g_patient );
    location.hash = `#Patient/${g_patient.id}`;
}

function onBack() {
    location.hash = `#Patient/${g_patient.id}`;
}

function onNewVisit() {
    Patients.createVisit().then( function () {
        const len = g_patient.admissions.length;
        const lastAdmission = g_patient.admissions[ len - 1 ];
        location.hash = `#Visit/${g_patient.id}/${len - 1}/${
             lastAdmission.visits.length - 1}`;
    } );
}


/**
 * @param {DOM} parent
 * @param {object} def - Définition des zones de saisie.
 *
 * Si un nom d'attribut de `def` commence par un `#`, il s'agit d'une zone
 * de saisie. Sinon, c'est une boîte qui affiche/cache son contenu.
 */
function addForm( parent, def ) {
    if ( typeof def === 'undefined' ) return;

    let key, val;
    let wdg, div;
    for ( key in def ) {
        val = def[ key ];
        if ( key.charAt( 0 ) == '#' ) {
            // Input
            wdg = new Input( {
                def: val,
                patient: g_patient
            } );
        } else {
            // Show/Hide
            div = $.div();
            wdg = new Expand( {
                label: val.caption,
                content: [ div ],
                simple: true,
                whide: false,
                value: false
            } );
            addForm( div, val.children );
        }
        $.add( parent, wdg );
    }
}
