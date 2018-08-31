var $ = require("dom");
var W = require("x-widget").getById;
var DB = require("tfw.data-binding");
var Cfg = require("$").config;
var Err = require("tfw.message").error;
var Msg = require("tfw.message").info;
var Form = require("form");
var Icon = require("wdg.icon");
var Text = require("wdg.text");
var Path = require("node://path");
var Files = require("files");
var Modal = require("wdg.modal");
var Spawn = require('node://child_process').spawn;
var Format = require("format");
var Button = require("wdg.button");
var Synchro = require("synchro");
var Patients = require("patients");
var Structure = require("structure");
var InputSearch = require("input.search");
var Preferences = require("preferences");
var ModalPatient = require("modal.patient");
var LocalDownload = require("tfw.local-download");


exports.onPage = function() {
  var search = new InputSearch();
  $.clear( 'search', search );
  search.focus = true;

  $('version').textContent = "Version " + Cfg.version
    + " - " + Cfg.date.substr(0, 10) + " "
    + Cfg.date.substr(11, 8);
  var patientCount = W('patients-count');
  patientCount.visible = false;
  Patients.count().then(function(count) {
    patientCount.visible = count > 0;
    patientCount.text = count + " patient" + (count < 2 ? "" : "s");
  });
};


exports.onExport = function() {
  var exp = Patients.export();
  var btnBrowse = $.tag( 'input', { type: "file", nwsaveas: "data.tgz" } );
  $.css( btnBrowse, { display: "none" } );
  var btnSelect = new Icon({ button: true, content: "search", size: "1.5rem" });
  btnSelect.on(function() {
    btnBrowse.click();
  });
  var inpSave = new Text({ label: "Enregistrer sous", wide: true,
                           width: "320px",
                           value: Preferences.get( 'saveas', '' ) });
  var btnSave = new Button({ icon: "export", text: "Enregistrer sous" });
  btnBrowse.addEventListener("change", function(evt) {
    inpSave.value = this.value;
  }, false);

  var inpEMail = new Text({ label: "Adresse mail du destinataire", wide: true,
                            value: Preferences.get( 'email', '' ) });
  var btnEMail = new Button({ icon: "mail", text: "Envoyer par mail" });

  var txtRemoteServer = new Text({ label: _('remote-server'), value: Synchro.remoteServer, wide: true });
  var txtSecretCode = new Text({ label: _('secret-code'), value: Synchro.secretCode });
  var btnCheck = new Button({ text: _('check') });
  btnCheck.on(function() {
    Synchro.check( txtRemoteServer.value, txtSecretCode.value ).then(
      function( status ) {
        Synchro.remoteServer = txtRemoteServer.value;
        Synchro.secretCode = txtSecretCode.value;
      }
    );
  });
  
  var modal = Modal.alert($.div([
    $.tag( 'h1', [_('synchro')]),
    txtRemoteServer, txtSecretCode, btnCheck,
    $.tag( 'hr' ),
    btnBrowse,
    $.tag( 'h1', [_('backup')]),
    $.div('table', [
      $.div([ $.div([inpSave]), $.div([btnSelect]), $.div([btnSave]) ]),
      $.div([ $.div([inpEMail]), $.div(), $.div([btnEMail]) ])
    ])
  ]));
  btnSave.on(function() {
    btnSave.wait = true;
    exp.then(function( src ) {
      var dst = inpSave.value;
      Files.copy( src, dst ).then(function() {
        modal.detach();
        Msg("Sauvegarde réussie !");
        Preferences.set( "saveas", dst );
      }, function( err ) {
        btnSave.wait = false;
        Err( err );
      });
    });
  });
  btnEMail.on(function() {
    modal.detach();
    exp.then(function( src ) {
      Preferences.set( "email", inpEMail.value );
      var args = [
        "-compose",
        "to=" + inpEMail.value + ",subject=Sauvegarde de la base des patients"
          + ",format=1"
          + ",attachment=" + src
      ];
      console.info("[page.home] args=", args);
      Spawn( "thunderbird", args );
    });
  });
};


/**
 * To get to the admin page, the current user must be authentificated.
 */
exports.onAdmin = function() {
  location = "admin.html";
};


exports.onNewPatient = function() {
  ModalPatient("Nouveau patient", function(patientData) {
    Patients.create( patientData ).then(function( patient ) {
      location.hash = "Patient/" + patient.id;
    });
  });
};
