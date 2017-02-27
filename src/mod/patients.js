/**
 * Patients are stored locally on hard disk.
 * The list of patients is in `data/patients.json`:
 * ```
 * {
 *   "count": 13,
 *   "records": {
 *     "c14D5": {
 *       // Patient identity taken from `patient.org`
 *     },
 *     ...
 *   }
 * }
 * ```
 *
 * There is a folder for each patient. For instance: `data/c14D5`.
 * It owns  all the attachments  files for  this patient and  the file
 * `patient.json` which has this format:
 * ```
 * {
 *   "data": {
 *     // Patient identity taken from `patient.org`
 *   },
 *   "admissions": [
 *     {
 *       "enter": <seconds since UNIX epoc (UTC)>,
 *       "exit": <seconds since UNIX epoc (UTC)>,
 *       "visits": [
 *         {
 *           "date": <seconds since UNIX epoc (UTC)>,
 *           "data": <forms.org>,
 *         },
 *         ...
 *       ]
 *     },
 *     ...
 *   ],
 *   "vaccins": {
 *     "HA": {
 *       "date": <seconds since UNIX epoc (UTC)>,
 *       "lot": <numéro de lot {string}>
 *     },
 *     ...
 *   },
 *   "exams": {
 *     "date": ...,
 *     "done": <{boolean}>  // If not done, we are still waiting for results.
 *     "data": [
 *       ["Prescription d'examen biologique", [
 *           ["Biologie sanguine", {
 *               "CL": <result or null>
 *               "K": <result or null>
 *               ...
 *             }
 *           ]
 *         ]
 *       ]
 *     ]
 *   },
 *   "picture": "4HG1.jpg"  // Identity picture 256x256.
 *   "attachments": {
 *     "32JK.pdf": {
 *       "caption": "Radiographie"
 *     }
 *   }
 * }
 * ```
 */
"use strict";

var FS = require("node://fs");
var GUID = require("guid");
var Files = require("files");

var g_patients = null;


module.exports = {
    all: getAllPatients,
    create: createPatient
};


function getAllPatients() {
    return new Promise(function (resolve, reject) {
        if( g_patients ) resolve( g_patients );
        else {
            Files.mkdir( 'data' ).then(function() {
                FS.readFile( 'data/patients.json', function( err, data ) {
                    if( err ) reject( err );
                    else {
                        g_patients = JSON.parse( data.toString() );
                        resolve( g_patients );
                    }
                });
            });
        }
    });
}


function createPatient() {
    return new Promise(function (resolve, reject) {
        var id = GUID();
        
    });
}
