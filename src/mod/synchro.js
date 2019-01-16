"use strict";

var Timer = require("tfw.timer");

/**
 * Test if the synchro configuration is OK.
 * @param {string} remoteServer -
 * @param {string} secretCode - Code of the care center.
 * @resolve {object} Everything is ok.
 * @reject {number} NETWORK_FAILURE, BAD_SECRET_CODE, SERVER_ERROR
 */
exports.check = getStatus;
/**
 * No param.
 * Initialize the synchro thread.
 * @resolve {object} Structure.
 * @reject {number} NETWORK_FAILURE, BAD_SECRET_CODE, SERVER_ERROR
 */
exports.start = start;
/**
 * No param, no return.
 * Ask to update what must be updated.
 * You can call this function as soon as anything changed because it is debounced and so it will not
 * slow the app.
 */
exports.update = Timer.debounce(update, 5000);
/**
 * Return a promise which resolves into a structure. Or reject with the error.
 */
exports.structure = structure;


exports.NETWORK_FAILURE = -1;
exports.BAD_SECRET_CODE = -2;
exports.SERVER_ERROR = -3;
exports.ALREADY_STARTING = -4;


var Preferences = require("preferences");

Preferences.definePersistentProperty(exports, 'remoteServer', "localhost/www/cameroun-server/");
Preferences.definePersistentProperty(exports, 'secretCode', "");


//############################################################

var Patients = require("patients");
var WebService = require("tfw.web-service");


/**
 * 0: System is completly empty.
 * 1: Waiting for status from server.
 * 2: Status is known. Ready for updates.
 * 3: Update in progress.
 */
var g_state = 0;
/**
 * The status tells us what the server already got.
 * @param {object} g_currentStatus.structure
 * @param {string} g_currentStatus.structure.exams
 * @param {string} g_currentStatus.structure.vaccins
 * @param {string} g_currentStatus.structure.patient
 * @param {string} g_currentStatus.structure.forms
 * @param {string} g_currentStatus.structure.types
 * @param {object} g_currentStatus.patients
 * @param {array} g_currentStatus.patients[id].admissions
 * @param {number} g_currentStatus.patients[id].admissions[].enter
 * @param {number} g_currentStatus.patients[id].admissions[].exit
 * @param {number} g_currentStatus.patients[id].admissions[].visits
 * @param {number} g_currentStatus.patients[id].admissions[].visits[].date
 * @param {number} g_currentStatus.patients[id].created
 * @param {object} g_currentStatus.patients[id].data
 * @param {number} g_currentStatus.patients[id].edited
 */
var g_currentStatus = {};
/**
 * @param {string} g_updatesToSend[].id
 * @param {object} g_updatesToSend[].data
 */
var g_updatesToSend = [];
var g_senderTimeoutId = 0;


function updatePatient(patient) {
    return new Promise(function(resolve, reject) {
        var delta = getPatientDelta(patient);
        if (!delta) return resolve();
        query({ cmd: 'update', patient: delta }).then(
            function() {
                console.log("Patient synchronized: ", delta);
                resolve();
                if (!g_currentStatus.patients) g_currentStatus.patients = {};
                g_currentStatus.patients[patient.id] = patient;
            },
            function(err) {
                console.error("Failed to synchronized: ", delta);
                console.error(err);
                // Failure is not a big issue. We just go on and the patient will be updated later.
                resolve();
            }
        );
    });
}

/**
 * Look in the `g_currentStatus` and find what `patient` has more.
 */
function getPatientDelta(patient) {
    var previousPatient = g_currentStatus.patients[patient.id];
    if (typeof previousPatient === 'undefined') previousPatient = {
        admissions: [{ enter: 0, visits: [{ date: 0 }] }],
        data: {},
        edited: 0
    };

    if (patient.edited <= previousPatient.edited) return null;
    var delta = { id: patient.id, edited: patient.edited };
    var data = getDataDelta(patient.data, previousPatient.data);
    if (data) delta.data = data;
    var admissions = getAdmissionsDelta(patient.admissions, previousPatient.admissions);
    if (admissions) delta.admissions = admissions;

    return delta;
}

function getDataDelta(current, previous) {
    if (!previous) return current;
    var hasDifferences = false;
    var data = {};
    Object.keys(current).forEach(function(key) {
        if (current[key] !== previous[key]) {
            data[key] = current[key];
            hasDifferences = true;
        }
    });
    return hasDifferences ? data : null;
}

function getAdmissionsDelta(current, previous) {
    if (!previous) return current;
    if (!Array.isArray(previous)) return current;
    if (previous.length == 0) return current;

    var lastAdmission = previous[previous.length - 1];
    var lastEnter = parseInt(lastAdmission.enter);
    if (isNaN(lastEnter)) lastEnter = 0;

    var admissions = current.filter(function(admission) {
        return admission.enter >= lastEnter;
    });
    return admissions.length > 0 ? admissions : null;
}

/**
 * Take next patient id  and process it. As soon as the process  ends, call updateNextPatient again,
 * until `patientIds` is empty.
 * @param {array} patientIds - Array of patient ids.
 */
function updateNextPatient(patientIds) {
    if (patientIds.length === 0) {
        // Updating is done.
        g_state = 2;
        return;
    }
    var patientId = patientIds.shift();
    Patients.get(patientId).then(
        function(patient) {
            updatePatient(patient).then(function() {
                updateNextPatient(patientIds);
            });
        },
        function(errorMessage) {
            console.error("Unable to load patient " + patientId + ": ", errorMessage);
            updateNextPatient(patientIds);
        }
    );
}

function updatePatients(patients) {
    var patientIds = Object.keys(patients).slice();
    updateNextPatient(patientIds);
}

function updateStatus() {
    if (g_state != 2) {
        // Updating in progress... Try later.
        exports.update();
        return;
    }
    g_state = 3;
    Patients.all().then(function(allPatients) {
        updatePatients(allPatients.records);
    });
}

function update() {
    start().then(updateStatus, function(errorCode) {
        if (errorCode == exports.NETWORK_FAILURE) {
            // We can ask again later because it may just be a network unavailibility.
            exports.update();
        }
    });
}


function start() {
    return new Promise(function(resolve, reject) {
        if (g_state === 0) {
            g_state = 1;
            getStatus(exports.remoteServer, exports.secretCode).then(
                function(status) {
                    if (!status) status = {};
                    if (!status.patients || typeof status.patients !== 'object') status.patients = {};

                    g_currentStatus = status;
                    g_state = 2;
                    exports.update();
                    resolve(status);
                },
                function(errorCode) {
                    g_state = 0;
                    reject(errorCode);
                }
            );
        } else if (g_state === 1) {
            reject(exports.ALREADY_STARTING);
        } else {
            resolve(g_currentStatus);
        }
    });
}


function getStatus(remoteServer, secretCode) {
    remoteServer = ("" + remoteServer).trim();
    if (remoteServer.charAt(remoteServer.length - 1) !== '/')
        remoteServer += '/';
    remoteServer += "tfw";

    return new Promise(function(resolve, reject) {
        WebService.get("synchro", { cmd: 'status', code: secretCode }, remoteServer).then(
            function(ret) {
                console.info("[synchro] ret=", ret);
                if (typeof ret === 'number') {
                    console.error("Service 'synchro' failed with error code: ", ret);
                    if (ret === -3) reject(exports.BAD_SECRET_CODE);
                    reject(exports.SERVER_ERROR);
                } else {
                    resolve(ret);
                }
            },
            function(err) {
                console.error("NETWORK_FAILURE: ", err);
                reject(exports.NETWORK_FAILURE);
            }
        );
    });
}


function structure(carecenterId) {
    return new Promise(function(resolve, reject) {
        query({ cmd: 'structure' }).then(function(data) {
            console.info("[synchro.structure] Received: ", data);
            resolve(data);
        }, function(err) {
            console.error("Unable to query structure for " + carecenterId + "!");
            console.error(err);
            reject(err);
        });
    });
}

function query(args) {
    var remoteServer = ("" + exports.remoteServer).trim();
    if (remoteServer.charAt(remoteServer.length - 1) !== '/')
        remoteServer += '/';
    remoteServer += "tfw";

    args.code = exports.secretCode;
    return WebService.get("synchro", args, remoteServer);
}