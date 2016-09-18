"use strict";

var Guid = require("guid");
var Storage = require("tfw.storage").local;


var data = Storage.get("cameroun", {});


exports.findPatients = function(criteria, limit) {
    if( typeof limit === 'undefined' ) limit = 5;

    var result = [];
    var key, val;
    for( key in data ) {
        val = data[key];
    }

    return result;
};

exports.newPatient = function(value) {
    var id = Guid();
    var patient = JSON.parse(JSON.stringify(value));
    patient.$id = id;
    patient.$admission = [];
    data[id] = patient;
    exports.save();
    return id;
};

exports.save = function() {
    Storage.set('cameroun', data);
};
