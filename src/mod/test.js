"use strict";

var W = require("x-widget").getById;

exports.onFocus = function(v) {
    var w = W("B" + v);
    w.focus = !w.focus;
};
