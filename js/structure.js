/** @module structure */require( 'structure', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
 var GLOBAL = {
  "forms": "* Géographie\n** #COUNTRY Adresse pays (#COUNTRY)\n*** #REGION Adresse region\n**** #DISTRICT Adresse district\n***** #HEALTH-AREA Aire de santé\n****** #VILLAGE Village de résidence\n* Contact\n** #TO-WARN Personne à prévenir\n** #RELATION Relation de cette personne avec le patient (#RELATIONSHIP)\n* Réseau de soins\n* Sections emboîtées\n** Sous-section I\n*** #BLABLA Quoi de neuf, docteur ?\n** Sous-section II\n*** #ASPIRINE Une bonne aspirine et ça repart !\n* Informations socio-familliales\n** #CHILDREN-COUNT Nombre d'enfants (INTEGER)\n** #PROFESSION Profession (#PROFESSION)\n* Antécédent gynécologique\n** #RAGNANA Age de survenue des premières règles (INTEGER)\n** #ABOND abondance des règles (#ABOND)\n* Allergies\n** #ALLE-DRUG Médicamenteuses (#DRUG+)\n** #ALLE-OTHER Autres (#ALLERGIES+)\n   \n",
  "types": "* #GENDER\n** #H Homme\n** #F Femme\n\n* #ABOND\n** #RARE Rare\n** #NORM Normale\n** #ABON Abondante\n\n* #BOOL\n** #YES Oui\n** #NO Non\n\n* #DRUG\n** #PENI Pénicilline\n** #ALCO Alcool\n\n* #ALLERGIES\n** #BEES Abeilles\n** #COBR Cobras\n** #DUST Poussière\n\n* #COUNTRY\n** Afrique du Sud\n** Algérie\n** Angola\n** Bénin\n** Botswana\n** Burkina Faso\n** Burundi\n** #CA Cameroun\n*** Littoral\n**** #D9 District 9\n***** Aire de santé des pieds plats\n****** La Muraz\n****** Monnetier\n****** Les Houches\n**** Un peu plus loin\n***** Village A\n**** Neufs laxistes\n***** AS 41\n****** Chamonix\n****** Andréa City\n***** AS 43\n****** Lyon\n****** Paris\n****** Marseille\n*** Centre\n**** Pas tout près\n***** Village Toto\n**** Au fin fond du...\n***** Village Alpha\n***** Village Beta\n***** Village Gama\n*** Nord\n**** Il fait froid\n***** Village Glace\n***** Village Eskimo\n**** Il fait pas chaud\n***** Village perdu\n** #CV Cap-Vert\n** #CF République centrafricaine\n** #KM Comores\n** #CG République du Congo\n** #CD République démocratique du Congo\n** #CI Côte d'Ivoire\n** #DJ Djibouti\n** #EG Égypte\n** Érythrée\n** Éthiopie\n** Gabon\n** Gambie\n** Ghana\n** Guinée\n** Guinée-Bissau\n** Kenya\n** Lesotho\n** Liberia\n** Libye\n** Madagascar\n** Malawi\n** Mali\n** Maroc\n** Maurice\n** Mauritanie\n** Mozambique\n** Namibie\n** Niger\n** Nigeria\n** Ouganda\n** Rwanda\n** Sénégal\n** Seychelles\n** Sierra Leone\n** Somalie\n** Soudan\n** Soudan du Sud\n** Swaziland\n** Tanzanie\n** Tchad\n** Togo\n** Tunisie\n** Zambie\n** Zimbabwe\n* #RELATIONSHIP\n** #PARENT Parent\n** #BROHER Fraterie\n** #PARTNER Partenaire / Conjoint\n** Enfant\n** Relation extra familiale\n* #PROFESSION\n** #JOB-1 Agriculteur\n** #JOB-2 Artisans, commerçants, chefs d'entreprise\n** #JOB-3 Enseignant\n** #JOB-4 Cadres\n** #JOB-5 Employés\n** #JOB-6 Retraités\n** #JOB-7 Sans emploi\n** #JOB-8 Etudiant, élève\n",
  "patient": "* #PATIENT-LASTNAME Nom\n* #PATIENT-FIRSTNAME Prénom\n* #PATIENT-SECONDNAME Deuxième nom @OPTIONAL\n* #PATIENT-GENDER Sexe (#GENDER)\n* #PATIENT-COUNTRY Adresse pays (#COUNTRY)\n"};
  "use strict";

var $ = require("dom");
var Storage = require("tfw.storage").session;


var Parser = require("structure.parser");

['types', 'forms', 'patient'].forEach(function (id) {
    try {
        exports[id] = Parser.parse(GLOBAL[id]);
    }
    catch (ex) {
        Storage.set('error', "Erreur dans le fichier `" + id + ".org` à la ligne " + ex.lineNumber
                    + " :\n\n" + ex.message);
        location = "error.html";
    }
});


exports.getForm = function() {
    var path = [];
    var i, arg;
    for (i = 0 ; i < arguments.length ; i++) {
        arg = arguments[i];
        path.push( arg );
    }
    return Parser.get( exports.forms, path );
};


  
module.exports._ = _;
/**
 * @module structure
 * @see module:$
 * @see module:dom
 * @see module:structure
 * @see module:structure.parser
 * @see module:tfw.storage

 */
});