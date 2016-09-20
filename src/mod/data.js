"use strict";
/**
 * @module data
 *
 * ```
 * visit := {
 *   enter: <number>
 *   exit: <number>
 *   data: {}
 *   prescriptions: []
 * }
 * 
 *
 * @example
 * var mod = require('data');
 */


var Guid = require("guid");
var Storage = require("tfw.storage").local;
var Structure = require("structure");


var data = Storage.get("cameroun", {});
console.info("[data] data=...", data);

/**
 * Retourner une lsite de patients' id.
 */
exports.findPatients = function(criteria, limit) {
    if( typeof limit === 'undefined' ) limit = 5;

    // Mettre les critères en minuscule.
    var critKey, critVal;
    for( critKey in criteria ) {
        criteria[critKey] = criteria[critKey].trim().toLowerCase();
    }
    
    var result = [];
    var patientKey, patientVal, patientAtt, score;
    var percent, pos;
    for( patientKey in data ) {
        patientVal = data[patientKey];
        score = 0;
        for( critKey in criteria ) {
            critVal = criteria[critKey];
            patientAtt = patientVal[critKey].toLowerCase();
            if (patientAtt.length == 0) continue;
            percent = critVal.length / patientAtt.length;
            if (percent > 1) continue;
            pos = patientAtt.indexOf( critVal );
            if (pos < 0) continue;
            score = Math.max( 0, 100 * percent - pos );
            result.push([score, patientKey]);
        }        
    }

    // Trier par score décroissant.
    result.sort(function(a, b) {
        return b[0] - a[0];
    });

    result = result.slice(0, limit);
    result = result.map(function(v) {
        return v[1];
    });
    return result;
};


exports.getPatient = function(id) {
    return data[id];
};


exports.newPatient = function(value) {
    var id = Guid();
    var patient = JSON.parse(JSON.stringify(value));
    patient.$id = id;
    patient.$admissions = [];
    data[id] = patient;
    exports.save();
    return id;
};


/**
 * @return `{ old: '', new: '' }`
 */
exports.getValue = function( patient, id ) {
console.info("[data] patient=...", patient);    
    var visit = exports.getLastVisit( patient );
    var result = {
        new: visit.data[id]
    };
    if (!Array.isArray(patient.$admissions)) patient.$admissions = [];
    patient.$admissions.forEach(function (admission) {
        admission.visits.forEach(function (visit) {
            var value = visit.data;
            if (value === result.new) return;
            var v = value[id];
            if (typeof v !== 'undefined' && v.length > 0 ) {
                result.old = v;
            }
        });
    });

    return result;
};


/**
 * Find the last patient's visit or return `null`.
 */
exports.getLastVisit = function( patient ) {
    if (!Array.isArray(patient.$admissions)) return null;
    var admission = patient.$admissions[patient.$admissions.length - 1];
    if (!admission) return null;
    if (!Array.isArray(admission.visits)) return null;
    if (admission.visits.length == 0) return null;
    return admission.visits[admission.visits.length - 1];
};


exports.createVisit = function( patient ) {
    var admission;
    if (!Array.isArray(patient.$admissions) || patient.$admissions.length == 0) {
        admission = exports.createAdmission( patient );
    } else {
        admission = patient.$admissions[patient.$admissions.length - 1];
    }
    
    var visit = { enter: Date.now(), data: {}, prescriptions: [] };
    admission.visits.push( visit );
    exports.save();
    return visit;
};


exports.closeVisit = function( visit ) {
    visit.exit = Date.now();
};


exports.createAdmission = function( patient ) {
    var admission = { enter: Date.now(), visits: [] };
    if (!Array.isArray(patient.$admissions) || patient.$admissions.length == 0) {
        patient.$admissions = [admission];
    } else {
        patient.$admissions.push( admission );
    }    
    exports.save();
    return admission;
};


exports.save = function() {
    Storage.set('cameroun', data);
};


exports.export = function() {
    var s = JSON.stringify(data, null, '  ');
    return s;
};
