"use strict";

module.exports = createPromise;

let gStructure = null;
let gSource = null;

Object.defineProperty(module.exports, 'value', {
    get: () => gStructure
});
Object.defineProperty(module.exports, 'source', {
    get: () => gSource
});


require("polyfill.promise");
const $ = require("dom");
const Err = require("tfw.message").error;
const Files = require("files");
const Modal = require("wdg.modal");
const Parser = require("structure.parser");
const Synchro = require("synchro");

const FS = require("node://fs");

// Name of the local backup for structure.
const FILENAME = "data/structure.json";

/**
 * Resolves in the complete structure.
 */
function createPromise() {
    return new Promise(function(resolve, reject) {
        if (gStructure) resolve(gStructure);
        else {
            Synchro.start().then(function() {
                console.log(_('synchro-success'));
            }, function() {
                Err(_('synchro-failure'));
            });
            // Load structure from internet or from local disk if network is unreachable.
            Files
                .mkdir("data")
                .then(function() {
                    return Synchro.structure();
                })
                .then(function(data) {
                    if (!loadStructure(data)) {
                        throw ("Unparsable JSON!");
                    }
                    FS.writeFileSync(FILENAME, JSON.stringify(data, null, '    '));
                    resolve(gStructure);
                })
                .catch(err => {
                    console.error("Unable to get Structure: ", err)
                    // Unable to  retrieve structure from the  network (or
                    // structure is corrupted). We  try to get the locally
                    // stored backup.
                    if (!FS.existsSync(FILENAME)) {
                        reject("No connection and no structure in cache!");
                    } else {
                        FS.readFile(FILENAME, function(err, data) {
                            if (err) {
                                reject("Unable to read backup file for structure!\n" + err);
                            } else {
                                loadStructure(JSON.parse(data.toString()));
                                resolve(gStructure);
                            }
                        });
                    }
                });
        }
    });
}


function loadStructure(data) {
    gStructure = {};
    gSource = {};

    var key, val;
    ['exams', 'vaccins', 'patient', 'forms', 'types'].forEach(function(key) {
        val = data[key];
        if (typeof val !== 'string') val = '';
        try {
            gSource[key] = val;
            gStructure[key] = Parser.parse(val);
        } catch (ex) {
            Modal.alert($.div([
                "Error in structure `" + key + "` at line " + ex.lineNumber,
                $.tag('code', [ex.message])
            ]));
            return false;
        }
    });
    return true;
}
