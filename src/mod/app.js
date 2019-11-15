"use strict";

exports.start = prepareStart;
exports.onPage = onPage;

require( "font.josefin" );

const
    $ = require( "dom" ),
    Cfg = require( "$" ),
    Modal = require( "wdg.modal" ),
    Structure = require( "structure" ),
    Preferences = require( "preferences" ),
    PageLoading = require( "page.loading" ),
    PageHome = require( "page.home" ),
    PageList = require( "page.list" ),
    PagePatient = require( "page.patient" ),
    PageVisit = require( "page.visit" ),
    PageVisitsummary = require( "page.visit-summary" ),
    PageExam = require( "page.exam" );


const pages = {
    loading: PageLoading,
    home: PageHome,
    list: PageList,
    patient: PagePatient,
    visit: PageVisit,
    visitsummary: PageVisitsummary,
    exam: PageExam
};


function onPage( pageId ) {
    const page = pages[ pageId.toLowerCase() ];
    if ( typeof page !== 'undefined' ) page.onPage();
}


function prepareStart() {
    const lang = Preferences.get( "lang", "fr" );
    Cfg.lang( lang );
    const manifest = nw.App.manifest;
    if ( manifest && manifest.debug ) {
        nw.Window.get().showDevTools( null, start );
    } else {
        start();
    }
}

function start() {
    $.registerTheme( "soin", {
        white: "#fda",
        black: "#420",
        bg0: "#fee7c1",
        bg1: "#feedd0",
        bg2: "#fef2e0",
        bg3: "#fef8ef",
        bgP: "#961",
        bgS: "#ffa100"
    } );
    $.applyTheme( "soin" );
    $.addClass( document.body, "thm-bg0" );
    location.hash = "#Loading";
    Structure().then( function () {
        location.hash = "#Home";
    } ).catch( function ( err ) {
        err.context = "Loading...";
        console.error( err );
        Modal.alert( _( 'loading-error', JSON.stringify( err, null, '  ' ) ) );
    } );
}
