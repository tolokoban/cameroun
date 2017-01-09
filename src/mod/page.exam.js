"use strict";

var $ = require("dom");
var ShowHide = require("wdg.showhide");
var Checkbox = require("wdg.checkbox");
var Structure = require("structure");


exports.onPage = function() {
    // Page / Section / Exam.
    var div = $('exam.data');
    $.clear( div );
    var pages = Structure.exams || {};
    var page, pageId, pageCaption;
    for( pageId in pages ) {
        page = pages[pageId];
        pageCaption = page.caption;
        $.add( div, $.tag( 'h1', [pageCaption] ) );
        var sections = pages[pageId].children;
        var section, sectionId, sectionCaption;
        for( sectionId in sections ) {
            section = pages[pageId].children[sectionId];
            sectionCaption = section.caption;
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

};
