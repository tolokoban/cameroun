"use strict";

exports.start = prepareStart;
exports.onPage = onPage;

require( "font.josefin" );

const
    $ = require( "dom" ),
    Cfg = require( "$" ),
    Err = require( "tfw.message" ).error,
    Msg = require( "tfw.message" ).info,
    Form = require( "form" ),
    Modal = require( "wdg.modal" ),
    Structure = require( "structure" ),
    Preferences = require( "preferences" );


var pages = {
    loading: require( "page.loading" ),
    home: require( "page.home" ),
    list: require( "page.list" ),
    patient: require( "page.patient" ),
    visit: require( "page.visit" ),
    visitsummary: require( "page.visit-summary" ),
    exam: require( "page.exam" )
};


function onPage( pageId ) {
    console.info( "pageId=", pageId );
    var page = pages[ pageId.toLowerCase() ];
    console.info( "page=", page );
    if ( typeof page !== 'undefined' ) page.onPage();
};


function prepareStart() {
    var lang = Preferences.get( "lang", "fr" );
    Cfg.lang( lang );

    var manifest = nw.App.manifest;
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
