"use strict";

const SEC_TO_MS = 1000;
const MS_TO_SEC = 1 / SEC_TO_MS;
const BASE = 10;

exports.now = function() {
    return Math.floor( Date.now() * MS_TO_SEC );
};


/**
 * @param {number} dat - Number of seconds since UNIX epoc (UTC).
 * @return {number} Age in seconds.
 */
exports.age = function( dat ) {
    return exports.now() - dat;
};


exports.toDate = function( datInSeconds ) {
    return new Date( datInSeconds * SEC_TO_MS );
};


exports.toYMD = function( dat ) {
    if( typeof dat !== 'number' ) return null;

    const d = exports.toDate( dat );
    const Y = d.getFullYear();
    let M = d.getMonth() + 1;
    if( M < BASE ) M = `0${M}`;
    let D = d.getDate() + 1;
    if( D < BASE ) D = `0${D}`;

    return `${Y}-${M}-${D}`;
};


exports.fromYMD = function( ymd ) {
    if( typeof ymd !== 'string' ) return null;
    if( ymd.length < "YYYY-MM-DD".length ) return null;

    const Y = parseInt( ymd.substr( 0, "YYYY".length ), BASE );
    const M = parseInt( ymd.substr( "YYYY-".length, "MM".length ), BASE );
    const D = parseInt( ymd.substr( "YYYY-MM-".length, "DD".length ), BASE );
    const objDate = new Date( Y, M - 1, D );

    return objDate.getTime() * MS_TO_SEC;
};
