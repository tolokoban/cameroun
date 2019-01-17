"use strict";

const
    $ = require( "dom" ),
    PM = require( "tfw.binding.property-manager" ),
    DB = require( "tfw.data-binding" ),
    Text = require( "wdg.text" ),
    Combo = require( "cameroun.view.combo" ),
    TextBox = require( "tfw.view.textbox" ),
    Format = require( "format" ),
    Patients = require( "patients" ),
    Structure = require( "structure" ),
    InputList = require( "input.list" );

/**
@param {object} args.patient - Patient courant.

@param {string} args.def.id - Identifiant unique du champ.
@param {string} args.def.type - Identifiant du type.
@param {string} args.def.caption - Nom d'affichage.
@param {array} args.def.tags - Liste des éventuels tags. Par exemple "OPTIONAL".
@param {object} args.def.children - Types enfants.
 */
var Input = function ( args ) {
    var that = this;
    var visit;

    var elem = $.elem( this, 'div', 'input' );

    if ( typeof args.patient === 'undefined' ) {
        throw Error( "[input] Missing mandatory argument: `patient`!" );
    }
    var patient = args.patient;
    visit = Patients.lastVisit( patient );

    var def = args.def;
    addWidget( elem, def, patient, visit );
};

function createBestWidget( value, completion, def ) {
    if ( completion.list.length > 1 ) {
        return createComboWidget( value, completion, def );
    }
    return createTextWidget( value, completion, def );
}

function createTextWidget( value, completion, def ) {
    console.info( "def=", def );
    const
        oldValue = Format.expand( value.old, def.type ),
        items = Object.keys( completion.map ).sort(),
        keys = items.map( item => completion.map[ item ].trim().toUpperCase() ),
        wdg = new TextBox( {
            wide: false,
            label: def.caption,
            placeholder: oldValue,
            list: items,
            value: Format.expand( value.new, def.type )
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

/**
 * Il existe trois types d'inputs :
 * * __Simple__ : Texte libre avec suggestions éventuelles.
 * * __Multiple__ : C'est une liste  alimentée par un texte libre avec
 *   suggestions. Les types `multiple` se terminent par un `+`.
 * * __Hiérarchique__  : Plusieurs  textes libres  dont la  suggestion
 *   dépend de la valeur du champ juste au dessus.
 */
function addWidget( container, def, patient, visit ) {
    if ( def.type && def.type.charAt( def.type.length - 1 ) === '+' ) {
        $.add( container, newListWidget( def, patient, visit ) );
        return;
    }

    const
        value = Patients.value( patient, def.id ),
        completion = Format.getCompletion( def.type ),
        wdg = createBestWidget( value, completion, def );
    PM( wdg ).on( "value", _v => {
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

function newListWidget( def, patient, visit ) {
    var value = Patients.value( patient, def.id );
    var inp = new InputList( {
        value: value.old,
        def: def
    } );
    DB.bind( inp, 'value', function ( v ) {
        visit.data[ def.id ] = v;
        Patients.save( patient );
    } );

    return inp;
}

function addHierarchicalWidget( container, parentWidget, def, patient, visit ) {
    // Gérer les hiérarchies.
    var wdg;
    var parent = def;
    var child = def;
    var level = 0;

    var mapValueToID = {};
    var completion = findHierarchicalCompletion( Structure.value.types[ def.type ], mapValueToID );

    while ( null !== ( child = getFirstChild( parent ) ) ) {
        parentWidget = createHierarchicalWidget( container, visit, mapValueToID, parentWidget, patient, def, child, level, completion );
        level++;
        parent = child;
    }
}

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
function findHierarchicalCompletion( typeDic, map, level, result, parentKey ) {
    if ( typeof typeDic === 'undefined' )
        return [];
    if ( typeof level === 'undefined' )
        level = 0;
    if ( typeof result === 'undefined' )
        result = [];

    if ( result.length <= level )
        result.push( {} );

    var key,
        child;
    for ( key in typeDic.children ) {
        child = typeDic.children[ key ];
        // On mémorise un dictionaires de clefs en fonction des valeurs. Cela va  nous servir à  stoquer la clef  en base et nom
        // la valeur qui peut dépendre de la langue.
        map[ child.caption.trim().toUpperCase() ] = key;
        if ( level > 0 ) {
            if ( !result[ level - 1 ][ parentKey ] )
                result[ level - 1 ][ parentKey ] = [ child.caption ];
            else
                result[ level - 1 ][ parentKey ].push( child.caption );
        }
        findHierarchicalCompletion( child, map, level + 1, result, key );
    }

    return result;
}

function createHierarchicalWidget( container, visit, mapValueToID, parentWidget, patient, def, child, level, completion ) {
    var type = Structure.value.types[ def.type ];
    var value = Patients.value( patient, child.id );
    var wdg = new Text( {
        wide: true,
        label: child.caption,
        placeholder: Format.expand( value.old, type, level ),
        value: Format.expand( value.new, type, level )
    } );
    $.css( wdg, {
        "margin-left": ( 1 + level ) + "rem"
    } );
    DB.bind( wdg, 'focus', function ( v ) {
        if ( v ) {
            var parentValue = parentWidget.value.trim().toUpperCase();
            var key = mapValueToID[ parentValue ];
            wdg.list = completion[ level ][ key || parentValue ] || [];
        }
    } );
    DB.bind( wdg, 'value', function ( v ) {
        if ( typeof v !== 'string' )
            return;
        v = v.trim();
        if ( v.length == 0 ) {
            delete visit.data[ child.id ];
        } else {
            // Quand c'est possible, on essaie de stoquer un ID plutôt qu'un texte libre.
            var valueID = mapValueToID[ v.trim().toUpperCase() ];
            visit.data[ child.id ] = valueID || v;
        }
        Patients.save( patient );
    } );
    $.add( container, wdg );

    return wdg;
}

function getFirstChild( def ) {
    if ( typeof def.children === 'undefined' )
        return null;
    var k;
    for ( k in def.children ) {
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

module.exports = Input;