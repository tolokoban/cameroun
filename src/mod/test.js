"use strict";

var W = require("x-widget").getById;

exports.onFocus = function(v) {
    console.info("[test] W('dte').value=...", W('dte').value);
};
