import { IPatient } from '../types'
import FileSystem from "./file-system"

export default { getAllPatientIds, getPatient }

interface IRecord {
    id: string,
    [key: string]: string
}

interface IPatientsFile {
    count: number,
    records: { [key: string]: IRecord }
}

const PATIENTS_FILENAME = 'data/patients.json'

async function getAllPatientIds(): Promise<string[]> {
    try {
        const patientsFileContent = await FileSystem.readText(PATIENTS_FILENAME)
        const patientsFile = JSON.parse(patientsFileContent) as IPatientsFile
        const listToSort = Object.keys(patientsFile.records)
            .map(key => patientsFile.records[key])
            .map((record: IRecord) => {
                const { id } = record
                const label = `${record["#PATIENT-LASTNAME"]}\t${record["#PATIENT-FIRSTNAME"]}`
                return [id, label]
            })
        const sortedList = listToSort.sort((a: any[], b: any[]) => {
            const [A] = a
            const [B] = b
            if (A < B) return -1
            if (A > B) return +1
            return 0
        })
        return sortedList.map(item => item[0])
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
