"use strict";

var $ = require("dom");
var ShowHide = require("wdg.showhide");
var Checkbox = require("wdg.checkbox");
var Structure = require("structure");


exports.onPage = function() {
    // Page / Section / Exam.
    var div = $('exam.data');
    $.clear( div );
    var pages = Structure.exam || {};
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
            var showhideContent = [];
            var showhide = new ShowHide({
                label: sectionCaption,
                value: false,
                content: showhideContent
            });
            $.add( div, showhide );
            var exams = section.children;
            var exam, examId, examCaption;
            for( examId in exams ) {
                exam = exams[examId];
                examCaption = exam.caption;
                var chkbox = new Checkbox({
                    text: examCaption, value: false, wide: true
                });
                showhideContent.push( chkbox );
            }
        }
    }
};


exports.onPrint = function() {

};
