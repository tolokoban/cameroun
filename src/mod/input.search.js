"use strict";


var $ = require("dom");
var DB = require("tfw.data-binding");
var Text = require("wdg.text");
var Format = require("format");
var Button = require("wdg.button");
var Patients = require("patients");


/**
 * @class Search
 *
 * Arguments:
 * * __visible__ {boolean}: Visibility of the component.
 *
 * @example
 * var Search = require("input.search");
 * var instance = new Search({visible: false});
 */
var Search = function(opts) {
  var input = new Text({
    label: "Rechercher un patient par son nom, prénom, ...",
    wide: true
  });
  var btnUser = new Button({
    text: "Aucune correspondance...", icon: "user", type: "simple", enabled: false, wide: true
  });
  // Pressing Enter will select the current patient.
  DB.bind( input, 'action', function() {
    btnUser.fire();
  });

  var elem = $.elem( this, 'div', [input, btnUser] );
  $.css( elem, { width: '480px' } );

  DB.propRemoveClass( this, 'visible', 'hide' );
  DB.propBoolean( this, 'focus' )(function(v) {
    if( v ) {
      window.setTimeout(function() {
        input.focus = true;
      });
    }
  });

  opts = DB.extend({
    visible: true,
    focus: false
  }, opts, this);

  var reverseLookup = {};
  var list = [];
  Patients.all().then(function( patients ) {
    var id, patientData;
    for( id in patients.records ) {
      patientData = patients.records[id];
      // We want to display the ID  of the patient because they use it
      // to create patient's folders on the hard disk.
      patientData.id = id;
      var name = Format.getPatientCaption( patientData );
      reverseLookup[name.trim().toLowerCase()] = id;
      list.push( name );
    }
    input.list = list;
  });
  DB.bind( input, 'value', function( v ) {
    var key = (v || '').toLowerCase();
    var id = reverseLookup[key];
    btnUser.enabled = false;
    btnUser.text = "Aucune correspondance...";
    if( id ) {
      btnUser.enabled = true;
      btnUser.text = v;
      btnUser.href = "#Patient/" + id;
    }
  });
};


module.exports = Search;
