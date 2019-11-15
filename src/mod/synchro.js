"use strict";

const Timer = require("tfw.timer");

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


const Preferences = require("preferences");

Preferences.definePersistentProperty(exports, 'remoteServer', "localhost/www/web-soins/");
Preferences.definePersistentProperty(exports, 'secretCode', "");


const Patients = require("patients");
const WebService = require("tfw.web-service");


/**
 * 0: System is completly empty.
 * 1: Waiting for status from server.
 * 2: Status is known. Ready for updates.
 * 3: Update in progress.
 */
let gState = 0;

/**
 * The status tells us what the server already got.
 * @param {object} gCurrentStatus.structure
 * @param {string} gCurrentStatus.structure.exams
 * @param {string} gCurrentStatus.structure.vaccins
 * @param {string} gCurrentStatus.structure.patient
 * @param {string} gCurrentStatus.structure.forms
 * @param {string} gCurrentStatus.structure.types
 * @param {object} gCurrentStatus.patients
 * @param {array} gCurrentStatus.patients[id].admissions
 * @param {number} gCurrentStatus.patients[id].admissions[].enter
 * @param {number} gCurrentStatus.patients[id].admissions[].exit
 * @param {number} gCurrentStatus.patients[id].admissions[].visits
 * @param {number} gCurrentStatus.patients[id].admissions[].visits[].date
 * @param {number} gCurrentStatus.patients[id].created
 * @param {object} gCurrentStatus.patients[id].data
 * @param {number} gCurrentStatus.patients[id].edited
 */
let gCurrentStatus = {};


function updatePatient(patient) {
    return new Promise(resolve => {
        if (!patient) {
            resolve();
            return;
        }
        const delta = getPatientDelta(patient);
        if (!delta) {
            resolve();
            return;
        }
        query({ cmd: 'update', patient: delta }).then(
            function() {
                console.log("Patient synchronized: ", delta);
                resolve();
                if (!gCurrentStatus.patients) gCurrentStatus.patients = {};
                gCurrentStatus.patients[patient.id] = patient;
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
 * Look in the `gCurrentStatus` and find what `patient` has more.
 */
function getPatientDelta(patient) {
    console.info("patient=", patient)
    let previousPatient = gCurrentStatus.patients[patient.id];
    if (typeof previousPatient === 'undefined') previousPatient = {
        admissions: [{ enter: 0, visits: [{ date: 0 }] }],
        data: {},
        edited: 0
    };

    if (patient.edited <= previousPatient.edited) return null;
    const delta = { id: patient.id, edited: patient.edited };
    const data = getDataDelta(patient.data, previousPatient.data);
    if (data) delta.data = data;
    const admissions = getAdmissionsDelta(patient.admissions, previousPatient.admissions);
    if (admissions) delta.admissions = admissions;

    return delta;
}

function getDataDelta(current, previous) {
    if (!previous) return current;
    let hasDifferences = false;
    const data = {};
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
    if (previous.length === 0) return current;

    const lastAdmission = previous[previous.length - 1];
    let lastEnter = parseInt(lastAdmission.enter, 10);
    if (isNaN(lastEnter)) lastEnter = 0;

    const admissions = current.filter(admission => admission.enter >= lastEnter);
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
        gState = 2;
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
    const patientIds = Object.keys(patients).slice();
    updateNextPatient(patientIds);
}

function updateStatus() {
    if (gState !== 2) {
        // Updating in progress... Try later.
        exports.update();
        return;
    }
    gState = 3;
    Patients.all().then(function(allPatients) {
        // Adding missing patients.
        const promises = []
        for (const patientId of Object.keys(gCurrentStatus.patients)) {
            if (typeof allPatients.records[patientId] === 'undefined') {
                const patient = { admissions: [] };
                promises.push(Patients.save({
                    id: patientId,
                    admissions: [],
                    vaccins: {},
                    exams: [],
                    picture: null,
                    attachments: {}
                }));
                allPatients.records[patientId] = patient;
            }
        }
        Promise.all(promises).then(() => updatePatients(allPatients.records));
    });
}

function update() {
    start().then(updateStatus, function(errorCode) {
        if (errorCode === exports.NETWORK_FAILURE) {
            // We can ask again later because it may just be a network unavailibility.
            exports.update();
        }
    });
}


function start() {
    return new Promise(function(resolve, reject) {
        if (gState === 0) {
            gState = 1;
            getStatus(exports.remoteServer, exports.secretCode).then(
                function(_status) {
                    const status = _status || {}
                    if (!status.patients || typeof status.patients !== 'object') {
                        status.patients = {};
                    }
                    gCurrentStatus = status;
                    gState = 2;
                    exports.update();
                    resolve(status);
                },
                function(errorCode) {
                    gState = 0;
                    reject(errorCode);
                }
            );
        } else if (gState === 1) {
            reject(exports.ALREADY_STARTING);
        } else {
            resolve(gCurrentStatus);
        }
    });
}


function getStatus(_remoteServer, secretCode) {
    let remoteServer = `${_remoteServer}`.trim();
    if (remoteServer.charAt(remoteServer.length - 1) !== '/') {
        remoteServer += '/';
    }
    remoteServer += "tfw";

    return new Promise(function(resolve, reject) {
        WebService.get("synchro", { cmd: 'status', code: secretCode }, remoteServer).then(
            ret => {
                console.info("[synchro/getStatus] ret=", ret);
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
