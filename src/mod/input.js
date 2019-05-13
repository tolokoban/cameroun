"use strict";

const $ = require( "dom" ),
      PM = require( "tfw.binding.property-manager" ),
      DB = require( "tfw.data-binding" ),
      Text = require( "wdg.text" ),
      Combo = require( "cameroun.view.combo" ),
      Format = require( "format" ),
      TextBox = require( "tfw.view.textbox" ),
      CheckBox = require( "tfw.view.checkbox" ),
      Patients = require( "patients" ),
      Structure = require( "structure" ),
      InputList = require( "input.list" );

/**
 * @param {object} args - Voir ci-dessous.
 * @param {object} args.patient - Patient courant.
 * @param {string} args.def.id - Identifiant unique du champ.
 * @param {string} args.def.type - Identifiant du type.
 * @param {string} args.def.caption - Nom d'affichage.
 * @param {array} args.def.tags - Liste des éventuels tags. Par exemple "OPTIONAL".
 * @param {object} args.def.children - Inputs enfants.
 */
function Input( args ) {
  if ( typeof args.patient === 'undefined' ) {
    throw Error( "[input] Missing mandatory argument: `patient`!" );
  }  
  const elem = $.elem( this, 'div', 'input' ),
        {patient, def} = args,
        visit = Patients.lastVisit( patient );

  addWidget( elem, def, patient, visit );
}

function addWidget( container, def, patient, visit ) {

  /**
   * Il existe trois types d'inputs :
   * * __Simple__ : Texte libre avec suggestions éventuelles.
   * * __Multiple__ : C'est une liste  alimentée par un texte libre avec
   *   suggestions. Les types `multiple` se terminent par un `+`.
   * * __Hiérarchique__  : Plusieurs  textes libres  dont la  suggestion
   *   dépend de la valeur du champ juste au dessus.
   */
  if ( def.type && def.type.charAt( def.type.length - 1 ) === '+' ) {
    $.add( container, newListWidget( def, patient, visit ) );
    return;
  }

  const value = Patients.value( patient, def.id ),
        completion = Format.getCompletion( def.type ),
        wdg = createBestWidget( value, completion, def );
  PM( wdg ).on( "value", _v => {
    if( typeof _v === 'boolean') {
      // For booleans, we take the value only if it is true!
      if( _v === true ) {
        visit.data[ def.id ] = 1;
      } else {
        delete visit.data[ def.id ];
      }
      return;
    }
    if ( typeof _v !== 'string' ) return;
    const v = _v.trim();
    if ( v.length === 0 ) {
      delete visit.data[ def.id ];
    } else {
      // Quand c'est possible, on essaie de stoquer un ID plutôt qu'un texte libre.
      const valueID = completion.map[ v.toLowerCase() ];
      visit.data[ def.id ] = valueID || v;
    }
    Patients.save( patient );
  } );

  $.add( container, $.div( [ $.div( [ wdg ] ) ] ) );

  addHierarchicalWidget( container, wdg, def, patient, visit );
}


function createBestWidget( value, completion, def ) {
  if ( completion.list.length > 1 ) {
    return createComboWidget( value, completion, def );
  }
  if ( hasTag( def, "BOOL" ) ) return createBoolWidget( value, completion, def );
  return createTextWidget( value, completion, def );
}

function createTextWidget( value, completion, def ) {
  const oldValue = Format.expand( value.old, def.type ),
        items = Object.keys( completion.map ).sort(),
        wdg = new TextBox( {
          wide: false,
          label: def.caption,
          placeholder: oldValue,
          list: items,
          value: Format.expand( value.new, def.type )
        } );
  return wdg;
}

function createBoolWidget( value, completion, def ) {
  const lastValue = Format.expand( value.old, def.type );
  console.info("[input] def.caption, lastValue=", def.caption, lastValue);
  const items = Object.keys( completion.map ).sort(),
        wdg = new CheckBox( {
          wide: false,
          content: def.caption,
          icon: lastValue ? "ok" : "",
          list: items,
          value: false
        } );
  return wdg;
}

function createComboWidget( value, completion, def ) {
  const
  oldValue = Format.expand( value.old, def.type ),
  items = Object.keys( completion.map ).sort(),
  keys = items.map( item => completion.map[ item ].trim().toUpperCase() ),
  wdg = new Combo( {
    wide: false,
    label: def.caption,
    oldValue,
    items: surround( "", items, "( Autre... )" ),
    keys: surround( "", keys, "#UNKNOWN" ),
    value: Format.expand( value.new, def.type )
  } );
  return wdg;
}

function newListWidget( def, patient, visit ) {
  const value = Patients.value( patient, def.id );
  const inp = new InputList( {
    value: value.old,
    def
  } );
  DB.bind( inp, 'value', function ( v ) {
    visit.data[ def.id ] = v;
    Patients.save( patient );
  } );

  return inp;
}

function addHierarchicalWidget( container, _parentWidget, def, patient, visit ) {
  // Gérer les hiérarchies.
  let parentWidget = _parentWidget;
  let parent = def;
  let level = 0;

  const mapValueToID = {};
  const completion = findHierarchicalCompletion( Structure.value.types[ def.type ], mapValueToID );

  let child = def;
  while ( ( child = getFirstChild( parent ) ) !== null ) {
    parentWidget = createHierarchicalWidget({
      container, visit, mapValueToID, parentWidget, patient, def, child, level, completion
    });
    level++;
    parent = child;
  }
}

function findHierarchicalCompletion( typeDic, map, _level, _result, parentKey ) {

  /**
   * Recherche récursive des complétions par niveau.
   * ```
   * result: [
   *   { "Europe": ["France", "Italie"], "Afrique": ["Cameroun", "Mali"] },
   *   {
   *     "France": ["Paris", "Marseille"],
   *     "Italie": ["Padova", "Milano"],
   *     "Cameroun": ["Yaoundé"],
   *     "Mali": ["Bamako"]
   *   }
   * ]
   * ```
   */
  if ( typeof typeDic === 'undefined' ) return [];
  const level = typeof _level !== 'undefined' ? _level : 0;
  const result = typeof _result !== 'undefined' ? _result : [];
  if ( result.length <= level ) result.push( {} );

  for ( const key of Object.keys(typeDic.children) ) {
    const child = typeDic.children[ key ];
    // On mémorise un dictionaires  de clefs en fonction des valeurs. Cela va  nous servir à stoquer
    // la clef en base et nom la valeur qui peut dépendre de la langue.
    map[ child.caption.trim().toUpperCase() ] = key;
    if ( level > 0 ) {
      if ( !result[ level - 1 ][ parentKey ] ) result[ level - 1 ][ parentKey ] = [ child.caption ];
      else result[ level - 1 ][ parentKey ].push( child.caption );
    }
    findHierarchicalCompletion( child, map, level + 1, result, key );
  }

  return result;
}

function createHierarchicalWidget({
  container, visit, mapValueToID, parentWidget, patient,
  def, child, level, completion
}) {
  const type = Structure.value.types[ def.type ];
  const value = Patients.value( patient, child.id );
  const wdg = new Text( {
    wide: true,
    label: child.caption,
    placeholder: Format.expand( value.old, type, level ),
    value: Format.expand( value.new, type, level )
  } );
  $.css( wdg, {
    "margin-left": `${1 + level}rem`
  } );
  DB.bind( wdg, 'focus', function ( v ) {
    if ( v ) {
      const parentValue = parentWidget.value.trim().toUpperCase();
      const key = mapValueToID[ parentValue ];
      wdg.list = completion[ level ][ key || parentValue ] || [];
    }
  } );
  DB.bind( wdg, 'value', function ( val ) {
    if ( typeof val !== 'string' ) return;
    const v = val.trim();
    if ( v.length === 0 ) {
      delete visit.data[ child.id ];
    } else {
      // Quand c'est possible, on essaie de stoquer un ID plutôt qu'un texte libre.
      const valueID = mapValueToID[ v.trim().toUpperCase() ];
      visit.data[ child.id ] = valueID || v;
    }
    Patients.save( patient );
  } );
  $.add( container, wdg );

  return wdg;
}

/**
 *
 * @param   {object} def - `{ children: [] }`
 * @returns {object} First item of `def.children`.
 */
function getFirstChild( def ) {
  if ( typeof def.children === 'undefined' ) return null;
  for ( const k of Object.keys( def.children ) ) {
    return def.children[ k ];
  }
  return null;
}

/**
 * Add a item as the head of the array and another at the tail.
 *
 * @param {string} prefix -
 * @param {array} arr -
 * @param {stirng} postfix -
 *
 * @return {array} Copy of the given array with a "" as first element.
 */
function surround( prefix, arr, postfix ) {
  const output = [ prefix ];
  output.push( ...arr );
  output.push( postfix );
  return output;
}

/**
 * Look if there is a given tag in the given def.
 *
 * @param   {object}  def - `{ tags: [...] }`
 * @param   {string}  tag - Tag name.
 * @returns {Boolean} -
 */
function hasTag( def, tag ) {
  if ( !Array.isArray( def.tags ) ) return false;
  const NOT_FOUND = -1;
  return def.tags.indexOf( tag.toUpperCase() ) !== NOT_FOUND;
}

module.exports = Input;
