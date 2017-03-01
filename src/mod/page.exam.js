"use strict";

require("polyfill.promise");
var $ = require("dom");
var W = require("x-widget").getById;
var Err = require("tfw.message").error;
var Msg = require("tfw.message").info;
var Files = require("files");
var Archive = require("tfw.archive");
var ShowHide = require("wdg.showhide");
var Patients = require("patients");
var Checkbox = require("wdg.checkbox");
var Structure = require("structure");

var FS = require("node://fs");
var Path = require("node://path");

/**
 * [
 *   ["Prescription d'examen biologique", [
 *     ["Numération formul sanguine", [chkbox1, chkbox2, ...]],
 *     ...
 *   ]],
 *   ...
 * ]
 */
var g_pages;

var g_patientId;

var MONTHES = [
    'Janvier', 'Février', 'Mars', 'Avril',
    'Mai', 'Juin', 'Juillet', 'Août',
    'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

exports.onPage = function() {
    var hash = location.hash.split('/');
    g_patientId = hash[1];
    // Page / Section / Exam.
    var div = $('exam.data');
    $.clear( div );
    g_pages = [];
    var level1, level2;
    var pages = Structure.value.exams || {};
    var page, pageId, pageCaption;
    for( pageId in pages ) {
        page = pages[pageId];
        pageCaption = page.caption;
        level1 = [];
        g_pages.push( [pageCaption, level1] );
        $.add( div, $.tag( 'h1', [pageCaption] ) );
        var sections = pages[pageId].children;
        var section, sectionId, sectionCaption;
        for( sectionId in sections ) {
            section = pages[pageId].children[sectionId];
            sectionCaption = section.caption;
            level2 = [];
            level1.push( [sectionCaption, level2] );
            var exams = section.children;
            var exam, examId, examCaption;
            var showhideContent = [];
            for( examId in exams ) {
                exam = exams[examId];
                examCaption = exam.caption;
                var chkbox = new Checkbox({
                    text: examCaption, value: false, wide: true
                });
                showhideContent.push( chkbox );
                level2.push( chkbox );
            }
            var showhide = new ShowHide({
                label: sectionCaption,
                value: false,
                content: showhideContent
            });
            $.add( div, showhide );
        }
    }
};

exports.onBack = function() {
    location = "#Patient/" + g_patientId;
};

exports.onPrint = function() {
    Msg( "Création du document de prescription d'examen en cours..." );
    var arch = new Archive();
    buildContent().then(function( content ) {
        arch.addText("META-INF/manifest.xml", GLOBAL["META-INF/manifest.xml"])
            .addText("content.xml", content)
            .addText("manifest.rdf", GLOBAL["manifest.rdf"])
            .addText("meta.xml", GLOBAL["meta.xml"])
            .addText("mimetype", GLOBAL["mimetype"])
            .addText("settings.xml", GLOBAL["settings.xml"])
            .addText("styles.xml", GLOBAL["styles.xml"])
            .close("application/vnd.oasis.opendocument.text").then(function(blob) {
                console.info("[page.exam] blob=...", blob);
                debugger;
                Files.saveBlob( "presciption-examens.odt", blob ).then(function(filename) {
                    var path = Path.resolve( filename );
                    Msg( "LibreOffice est en cours d'affichage..." );
                    Patients.get( g_patientId ).then(function(patient) {
                        Patients.attach( patient, path, "Examen prescrit" ).then(function( dst ) {
                            console.info("[page.exam] dst=", dst);
                            nw.Shell.openItem( dst );
                        }, function( err ) {
                            Msg( err );
                        });
                    });
                });
            }, function(err) {
                Err( err );
            });
    });
};


function buildContent() {
    return new Promise(function (resolve, reject) {
        Patients.get( g_patientId ).then(function(patient) {
            var data = patient.data;
            var info = {
                lastname: data["#PATIENT-LASTNAME"],
                firstname: data["#PATIENT-FIRSTNAME"],
                birthdate: data["#PATIENT-BIRTH"]
            };
            var out = GLOBAL['content.head.xml'];
            g_pages.forEach(function (itmTitle) {
                var titlePrinted = false;
                itmTitle[1].forEach(function (itmSection) {
                    var sectionPrinted = false;
                    itmSection[1].forEach(function (chkbox) {
                        if( chkbox.value == false ) return;

                        if( !titlePrinted ) {
                            var today = new Date();
                            out += tag("text:p", {"text:style-name": "P18"}, itmTitle[0]);
                            out += tag('text:p', {'text:style-name': 'P2'},
                                       tag('text:span', {'text:style-name': 'T5'}, "Nom du patient : "),
                                       tag('text:span', {'text:style-name': 'T3'}, info.lastname),
                                       tag('text:span', {'text:style-name': 'T6'}, tag('text:tab')),
                                       tag('text:span', {'text:style-name': 'T5'}, "Prénom : "),
                                       tag('text:span', {'text:style-name': 'T3'}, info.firstname));
                            out += tag('text:p', {'text:style-name': 'P1'},
                                       tag('text:span', {'text:style-name': 'T5'}, "Date de naissance : "),
                                       tag('text:span', {'text:style-name': 'T3'}, info.birthdate));
                            out += tag('text:p', {'text:style-name': 'P4'});
                            out += tag('text:p', {'text:style-name': 'P15'},
                                       tag('text:span', {'text:style-name': 'T5'},
                                           "Date de demande de l'examen : ",
                                           tag('text:span', {'text:style-name': 'T3'},
                                               today.getDate() + " "
                                               + MONTHES[today.getMonth()] + " "
                                               + today.getFullYear())));
                            out += tag('text:p', {'text:style-name': 'P15'},
                                       tag('text:span', {'text:style-name': 'T5'},
                                           "Nom du prescripteur : ",
                                           tag('text:tab')));
                            out += tag('text:p', {'text:style-name': 'P15'},
                                       tag('text:span', {'text:style-name': 'T5'},
                                           "Nom du service prescripteur de l'examen : ",
                                           tag('text:tab')));
                            out += tag('text:p', {'text:style-name': "Heading_20_2"});
                            titlePrinted = true;
                        }
                        if( !sectionPrinted ) {
                            out += tag("text:p", {"text:style-name": "Heading_20_2"}, itmSection[0]);
                            sectionPrinted = true;
                        }
                        out += tag('text:list', { 'text:style-name': 'L1' },
                                   tag('text:list-item',
                                       tag('text:p', {'text:style-name': 'P16'},
                                           chkbox.text + " : "
                                           + tag('text:tab'))));
                    });
                });
            });

            resolve( out + GLOBAL['content.foot.xml'] );
        });
    });
}


function tag(name, args) {
    if( typeof args === 'undefined' ) return "<" + name + "/>";
    if( typeof args === 'string' ) return "<" + name + ">" + args + "</" + name + ">";
    var out = '<' + name;
    var attribs = {};
    var content = '';
    var i, arg;
    for (i = 1 ; i < arguments.length ; i++) {
        arg = arguments[i];
        if( typeof arg === 'string' ) content += arg;
        else attribs = arg;
    }

    var key, val;
    for( key in attribs ) {
        val = attribs[key];
        out += ' ' + key + "=" + JSON.stringify( val );
    }
    if( content.length > 0 ) {
        out += ">" + content + "</" + name + ">";
    } else {
        out += "/>";
    }
    return out;
}
