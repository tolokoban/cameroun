"use strict";

require("polyfill.promise");
var $ = require("dom");
var Err = require("tfw.message").error;
var Archive = require("tfw.archive");
var FileAPI = require("tfw.fileapi");
var ShowHide = require("wdg.showhide");
var Checkbox = require("wdg.checkbox");
var Structure = require("structure");

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

exports.onPage = function() {
    // Page / Section / Exam.
    var div = $('exam.data');
    $.clear( div );
    g_pages = [];
    var level1, level2;
    var pages = Structure.exams || {};
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


exports.onPrint = function() {
    var arch = new Archive();
    arch.addText("META-INF/manifest.xml", GLOBAL["META-INF/manifest.xml"])
        .addText("content.xml", buildContent())
        .addText("manifest.rdf", GLOBAL["manifest.rdf"])
        .addText("meta.xml", GLOBAL["meta.xml"])
        .addText("mimetype", GLOBAL["mimetype"])
        .addText("settings.xml", GLOBAL["settings.xml"])
        .addText("styles.xml", GLOBAL["styles.xml"])
        .close("application/vnd.oasis.opendocument.text").then(function(blob) {
            FileAPI.saveAs(blob, "presciption-examens.odt");
        }, function(err) {
            Err( err );
        });
};


function buildContent() {
    var out = GLOBAL['content.head.xml'];
    g_pages.forEach(function (itmTitle) {
        var titlePrinted = false;
        itmTitle[1].forEach(function (itmSection) {
            var sectionPrinted = false;
            itmSection[1].forEach(function (chkbox) {
                if( chkbox.value == false ) return;

                if( !titlePrinted ) {
                    out += tag("text:p", {"text:style-name": "P18"}, itmTitle[0]);
                    titlePrinted = true;
                }
                if( !sectionPrinted ) {
                    out += tag("text:p", {"text:style-name": "Heading_20_2"}, itmTitle[0]);
                    sectionPrinted = true;
                }
                out += tag('text:list', { 'text:style-name': 'L1' },
                           tag('text:list-item',
                               tag('text:p', {'text:style-name': 'P16'},
                                   chkbox.label + " : "
                                   + tag('text:tab'))));
            });
        });
    });

    return out + GLOBAL['content.foot.xml'];
}


function tag(name, attribs, content) {
    if( typeof attribs === 'undefined' ) return "<" + name + "/>";
    if( typeof attribs === 'string' ) return "<" + name + ">" + attribs + "</" + name + ">";
    var out = '<' + name;
    var key, val;
    for( key in attribs ) {
        val = attribs[key];
        out += ' ' + key + "=" + JSON.stringify( val );
    }
    if( typeof content === 'string' ) {
        out += ">" + content + "</" + name + ">";
    } else {
        out += "/>";
    }
    return out;
}
