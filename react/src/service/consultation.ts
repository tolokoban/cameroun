import WebService from '../tfw/web-service'
import { IConsultation } from '../types'

export default { update }

async function update(patientKey: string, oldDate: number, consultation: IConsultation) {
    const input = {
        patientKey,
        oldDate,
        newDate: consultation.enter,
        data: consultation.data
    }
    console.log(input)
    const result = await WebService.exec(
        "consultation.update", input
    )
    return result
}
