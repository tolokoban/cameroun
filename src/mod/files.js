/**
 * Tools for files.
 */
"use strict";

const FS = require("node://fs");
const Fatal = require("fatal");


/**
 * Save a blob to a file.
 * Resolves to the filename.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Blob#Example_for_extracting_data_from_a_Blob
 */
exports.saveBlob = function(filename, blob) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.addEventListener("loadend", function() {
            const data = new Buffer(reader.result);
            FS.writeFile(filename, data, function(err) {
                if (err) reject(err);
                else resolve(filename);
            });
        });
        reader.readAsArrayBuffer(blob);
    });
};

/**
 * Save an JSON representation of an object to a file.
 * Resolves to `data`.
 */
exports.writeJson = function(filename, data) {
    return new Promise(function(resolve, reject) {
        exports.mkdir(dirname(filename)).then(function() {
            const text = JSON.stringify(data);
            FS.writeFile(filename, text, function(err) {
                if (err) Fatal(reject, "Unable to write file `" + filename + "`!", err);
                else resolve(data);
            });
        });
    });
};

/**
 * Load a file and parse it as a JSON.
 * Resolves to the object.
 */
exports.readJson = function(filename) {
    return new Promise(function(resolve, reject) {
        FS.readFile(filename, function(err, data) {
            if (err) Fatal(reject, "Unable to read file `" + filename + "`!", err);
            else {
                try {
                    resolve(JSON.parse(data.toString()));
                } catch (ex) {
                    Fatal(reject, "Unable to parse JSON file `" + filename + "`!", {
                        ex: ex,
                        data: data
                    });
                }
            }
        });
    });
};

exports.copy = function(src, dst) {
    return new Promise(function(resolve, reject) {
        FS.readFile(src, function(err, data) {
            if (err) Fatal(reject, "Unable to read file `" + src + "`!", {
                err: err,
                src: src,
                dst: dst
            });
            else {
                var path = dirname(dst);
                exports.mkdir(path).then(function() {
                    FS.writeFile(dst, data, function(err) {
                        if (err) Fatal(reject, "Unable to write file `" + dst + "`!", {
                            err: err,
                            src: src,
                            dst: dst
                        });
                        else {
                            resolve();
                        }
                    });
                }, reject);
            }
        });
    });
};

/**
 * Create directories recursively.
 * If they are already created, no problem.
 * Resolves in `undefined`.
 */
exports.mkdir = function(folderPath) {
    try {
        const sep = findSeparator(folderPath);
        const folders = folderPath.split(sep);
        let dir = '.';
        const directories = [];
        folders.forEach(function(folder) {
            if (folder.length === 2 && folder.charAt(1) === ':') {
                // dealing with windows drive letter (example: `C:`).
                dir = folder;
            } else {
                dir += sep + folder;
            }
            directories.push(dir);
        });

        return new Promise(function(resolve, reject) {
            const next = function() {
                if (directories.length === 0) {
                    resolve();
                    return;
                }
                const localDir = directories.shift();
                if (FS.existsSync(localDir)) {
                    next();
                } else {
                    FS.mkdir(localDir, function(err) {
                        if (err) reject(err);
                        else next();
                    });
                }
            };

            try {
                next();
            }
            catch (ex) {
                reject(ex)
            }
        });
    } catch (ex) {
        console.error(ex)
        throw ex
    }
};

exports.delete = function(filename) {
    return new Promise(function(resolve, reject) {
        FS.unlink(filename, function(err) {
            if (err) Fatal(reject, "Unable to delete file `" + filename + "`!", err);
            else resolve(filename);
        });
    });
};

exports.read = function(filename) {
    return new Promise(function(resolve, reject) {
        FS.readFile(filename, function(err, data) {
            if (err) Fatal(reject, "Unable to read file `" + filename + "`!", err);
            else resolve(data);
        });
    });
};

exports.write = function(filename, data) {
    return new Promise(function(resolve, reject) {
        exports.mkdir(dirname(filename)).then(function() {
            FS.writeFile(filename, data, function(err) {
                if (err) Fatal(reject, "Unable to write file `" + filename + "`!", {
                    ex: err,
                    data: data
                });
                else resolve(data);
            });
        }, reject);
    });
};

/**
 * Remove the filename at the end of `path`.
 */
function dirname(path) {
    var pos = path.lastIndexOf(findSeparator(path));
    if (pos == -1) return path;
    return path.substr(0, pos);
}

/**
 * Return path separator: `/` or `\`.
 * The better is to avoid unix-like path with `\`.
 */
function findSeparator(path) {
    var backslash = path.split('\\').length;
    var slash = path.split('/').length;
    if (backslash > slash) return '\\';
    return '/';
}
