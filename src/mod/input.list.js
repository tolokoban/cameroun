"use strict";

"use strict";

var $ = require( "dom" );
var DB = require( "tfw.data-binding" );
var Icon = require( "wdg.icon" );
var Text = require( "wdg.text" );
var Flex = require( "wdg.flex" );
var Modal = require( "wdg.modal" );
var Button = require( "wdg.button" );
var Format = require( "format" );

/**
 * @class InputList
 *
 * Afficher une liste de strings. Permettre d'ajouter des items à partir d'une
 * zone de saisie avec suggestions.
 *
 * @param {object} opts.def - Définition du champ.
 * @param {object} opts.def.caption - Nom d'affichage du champ.
 * @param {object} opts.def.type - Type à utiliser pour la suggestion.
 * @param {boolean} opts.visible - Set the visiblity of the component.
 *
 * @example
 * var InputList = require("InputList");
 * var instance = new InputList({ visible: false });
 */
var InputList = function( opts ) {
  var that = this;
  var title = $.div('theme-label', 'theme-color-bg-1', 'title', [ opts.def.caption ]);
  var list = $.div( 'list' );
  var btnAdd = new Button({ icon: "add", text: "Ajouter" });

  var completion = Format.getCompletion( opts.def.type );
  var inp = new Text({ wide: true, label: opts.def.caption, list: completion.list });
  var btnCancel = Button.Cancel( );
  var btnOK = Button.Ok( );
  DB.bind( inp, 'action', btnOK, 'action' );
  var modal = new Modal({
    content: [
      inp,
      $.tag( 'hr' ),
      new Flex({
        content: [ btnCancel, btnOK ]
      })
    ]
  });
  btnCancel.on(modal.detach.bind( modal ));
  btnOK.on( function( ) {
    var value = inp.value.trim();
    var id = completion.map[value.toLowerCase()];
    if (id) {
      // Always prefer id over descriptive name.
      value = id;
    }
    if ( that.value.indexOf( value ) === -1 ) {
      that.value.push( value );
      DB.fire( that, 'value' );
    }
    modal.detach();
  });
  btnAdd.on( function() {
    modal.attach();
    window.setTimeout(function() {
      inp.value = "";
      inp.focus = true;
    }, 200);
  });

  var elem = $.elem(this, 'div', 'theme-elevation-2', 'theme-color-bg-B0', 'input-list', 
    [ title, $.div( 'body', [list, btnAdd] ) ]);

  DB.propRemoveClass( this, 'visible', 'hide' );
  DB.propStringArray( this, 'value' )( function( v ) {
    $.clear( list );
    v.forEach( function( word ) {
      var readableWord = Format.expand( word, opts.def.type );
      var item = new Button({
        text: readableWord,
        type: 'simple',
        icon: 'close'
      });
      $.add( list, item );
      item.on( function( ) {
        Modal.confirm( _( 'confirm', readableWord ), function( ) {
          that.value = that.value.filter( function( x ) {
            return x != word;
          });
        });
      });
    });
  });

  opts = DB.extend( {
    visible: true,
    def: {},
    value: [ ]
  }, opts, this );
};

module.exports = InputList;