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
exports.update = Timer.debounce( update, 10000 );


exports.NETWORK_FAILURE = -1;
exports.BAD_SECRET_CODE = -2;
exports.SERVER_ERROR = -3;
exports.ALREADY_STARTING = -4;


var Preferences = require("preferences");

Preferences.definePersistentProperty( exports, 'remoteServer', "localhost/www/cameroun-server/" );
Preferences.definePersistentProperty( exports, 'secretCode', "" );


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
 * @param {number} g_currentStatus.patients[id].admissions[].consultations[].date
 */
var g_currentStatus = null;
/**
 * @param {string} g_updatesToSend[].id
 * @param {object} g_updatesToSend[].data
 */
var g_updatesToSend = [];
var g_senderTimeoutId = 0;

function updatePatients( patients ) {
  console.info("[synchro] patients=", patients);
}

function updateStatus() {
  Patients.all().then(updatePatients);
}

function update() {
  start.then(updateStatus, function( errorCode ) {
    if( errorCode == exports.NETWORK_FAILURE ) {
      // We can ask again later because it may just be a network unavailibility.
      exports.update();
    }
  });
}


function start() {
  return new Promise(function (resolve, reject) {
    if( g_state == 0 ) {
      g_state = 1;
      getStatus( exports.remoteServer, exports.secretCode ).then(
        function( status ) {
          g_currentStatus = status;
          g_state = 2;
          exports.update();
          resolve( status );
        },
        function( errorCode ) {
          g_state = 0;
         reject( errorCode );
       }
      );
    }
    else if( g_state == 1 ) {
      reject( exports.ALREADY_STARTING );
    }
    else {
      resolve( g_currentStatus );
    }
  });
}


function getStatus( remoteServer, secretCode ) {
  remoteServer = ("" + remoteServer).trim();
  if( remoteServer.charAt( remoteServer.length - 1 ) !== '/' )
    remoteServer += '/';
  remoteServer += "tfw";

  return new Promise(function (resolve, reject) {
    WebService.get( "synchro", { cmd: 'status', code: secretCode }, remoteServer).then(
      function( ret ) {
        console.info("[synchro] ret=", ret);
        if( typeof ret === 'number' ) {
          console.error("Service 'synchro' failed with error code: ", ret);
          if( ret === -3 ) reject( exports.BAD_SECRET_CODE );
          reject( exports.SERVER_ERROR );
        }
        else {
          resolve( ret );
        }
      },
      function( err ) {
        console.error( "NETWORK_FAILURE: ", err);
        reject( exports.NETWORK_FAILURE );
      }
    );
  });
}
