"use strict";

const $ = require("dom");
const Button = require("wdg.button");
const Format = require("format");
const Patients = require("patients");


exports.onPage = function() {
    $.clear('patients-list');
    Patients.all().then(function(patients) {
        const patientIds = sortPatientIds(patients.records)
        for( const id of patientIds ) {
            const patientData = patients.records[id];
            const btn = new Button({
                type: 'simple',
                href: `#Patient/${id}`,
                text: Format.getPatientCaption( patientData )
            });
            $.add('patients-list', $.tag('li', [btn]));
        }
    });
};


/**
 * @param {
 *     [key: string]: {
 *         "#PATIENT-LASTNAME": string,
 *         "#PATIENT-FIRSTNAME": string,
 *         "#PATIENT-SECONDNAME": string
 *     }
 * } patients [description]
 */
function sortPatientIds(patients) {
    const patientIds = Object.keys(patients)
    const items = patientIds.map(patientId => {
        const patient = patients[patientId]
        if (!patient) return null
        const lastname = (patient['#PATIENT-LASTNAME'] || '').trim().toLowerCase()
        const firstname = (patient['#PATIENT-FIRSTNAME'] || '').trim().toLowerCase()
        const secondname = (patient['#PATIENT-SECONDNAME'] || '').trim().toLowerCase()
        return [patientId, `${lastname} ${firstname} ${secondname}`]
    })
    .filter(item => item !== null)
    .sort((a, b) => {
        const A = a[1]
        const B = b[1]
        if (A < B) return -1
        if (A > B) return +1
        return 0
    })

    return items.map(arr => arr[0])
}
