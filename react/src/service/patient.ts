import { IPatient } from '../types'
import FileSystem from "./file-system"

export default { getAllPatientIds, getPatient }

interface IPatientsFile {
    count: number,
    records: {
        id: string,
        [key: string]: string
    }[]
}

const PATIENTS_FILENAME = 'data/patients.json'

async function getAllPatientIds(): Promise<string[]> {
    try {
        const patientsFileContent = await FileSystem.readText(PATIENTS_FILENAME)
        const patientsFile = JSON.parse(patientsFileContent) as IPatientsFile

        return Object.keys(patientsFile.records)
    }
    catch (ex) {
        console.error(`Unable to load "${PATIENTS_FILENAME}"!`, ex)
        return []
    }
}


async function getPatient(id: string): Promise<IPatient> {
    try {
        const patientContent = await FileSystem.readText(`data/${id}/patient.json`)
        const patient = JSON.parse(patientContent) as IPatient
        return patient
    }
    catch (ex) {
        console.error(`Unable to load patient #${id}!`, ex)
        throw ex
    }
}
