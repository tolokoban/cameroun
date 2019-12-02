"use strict"

const $ = require("dom");
const W = require("x-widget").getById;
const Cfg = require("$").config;
const Err = require("tfw.message").error;
const Msg = require("tfw.message").info;
const Icon = require("wdg.icon");
const Text = require("wdg.text");
const Files = require("files");
const Modal = require("wdg.modal");
const Spawn = require('node://child_process').spawn;
const Button = require("wdg.button");
const Synchro = require("synchro");
const Patients = require("patients");
const InputSearch = require("input.search");
const Preferences = require("preferences");
const ModalPatient = require("modal.patient");


exports.onPage = function() {
  const search = new InputSearch();
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
  const exp = Patients.export();
  const btnBrowse = $.tag( 'input', { type: "file", nwsaveas: "data.tgz" } );
  $.css( btnBrowse, { display: "none" } );
  const btnSelect = new Icon({ button: true, content: "search", size: "1.5rem" });
  btnSelect.on(function() {
    btnBrowse.click();
  });
  const inpSave = new Text({
    label: "Enregistrer sous",
    wide: true,
    width: "320px",
    value: Preferences.get( 'saveas', '' )
  });
  const btnSave = new Button({ icon: "export", text: "Enregistrer sous" });
  btnBrowse.addEventListener("change", function(evt) {
    inpSave.value = evt.target.value;
  }, false);

  const inpEMail = new Text({
    label: "Adresse mail du destinataire",
    wide: true,
    value: Preferences.get( 'email', '' )
  });
  const btnEMail = new Button({ icon: "mail", text: "Envoyer par mail" });

  const txtRemoteServer = new Text({ label: _('remote-server'), value: Synchro.remoteServer, wide: true });
  const txtSecretCode = new Text({ label: _('secret-code'), value: Synchro.secretCode });
  const btnCheck = new Button({ text: _('check') });

  const modal = Modal.alert($.div([
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

  btnCheck.on(function() {
    btnCheck.wait = true;
    console.info("txtRemoteServer.value=", txtRemoteServer.value)
    console.info("txtSecretCode.value=", txtSecretCode.value)
    Synchro.check( txtRemoteServer.value, txtSecretCode.value ).then(
      function( status ) {
        console.info("status=", status)
        btnCheck.wait = false;
        Synchro.remoteServer = txtRemoteServer.value;
        Synchro.secretCode = txtSecretCode.value;
        Msg(_('synchro-checked'));
        modal.detach();
      },
      function( errorCode ) {
        btnCheck.wait = false;
        switch( errorCode ) {
        case Synchro.NETWORK_FAILURE:
          Err(_('network-failure'));
          break;
        case Synchro.BAD_SECRET_CODE:
          Err(_('bad-secret-code'));
          txtSecretCode.focus = true;
          break;
        default:
          Err(_('server-error'));
          break;
        }
      }
    );
  });

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
  window.open( Synchro.remoteServer );
  //location = "admin.html";
};


exports.onNewPatient = function() {
  ModalPatient("Nouveau patient", function(patientData) {
    Patients.create( patientData ).then(function( patient ) {
      location.hash = "Patient/" + patient.id;
    });
  });
};
