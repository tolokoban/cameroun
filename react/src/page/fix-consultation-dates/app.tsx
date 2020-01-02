import React from "react"

import Icon from "../../tfw/view/icon"
import Intl from "../../tfw/intl"
import ConsultationService from "../../service/consultation"
import PatientService from "../../service/patient"
import DateService from "../../service/date"
import { IPatient, IConsultation } from '../../types'

import "./app.css"

const _ = Intl.make(require("./app.yaml"))

interface IConsultationToCheck {
    oldDate: Date,
    newDate: Date | boolean,
    // Becomes `true` as soon as the new consultation has been sent to the server
    uploaded: boolean,
    consultation: IConsultation
}

interface ITask {
    patient: IPatient,
    consultations: IConsultationToCheck[]
}

interface IUploadFailure {
    patient: IPatient,
    consultation: IConsultation,
    error: number
}

interface TAppProps { }
interface TAppState {
    patientsCount: number,
    tasks: ITask[],
    progress: number,
    errors: IUploadFailure[]
}

export default class App extends React.Component<TAppProps, TAppState> {
    private isMounted: boolean = false

    constructor(props: TAppProps) {
        super(props)
        this.state = {
            patientsCount: 0,
            tasks: [],
            progress: 0,
            errors: []
        }
    }

    async componentDidMount() {
        this.isMounted = true
        const patientIds = await PatientService.getAllPatientIds()
        this.setState({ patientsCount: patientIds.length })

        document.body.classList.add("start");
        setTimeout(() => {
            const body = document.body;
            const splash1 = document.getElementById("splash1");
            const splash2 = document.getElementById("splash2");
            if (splash1) body.removeChild(splash1);
            if (splash2) body.removeChild(splash2);
            this.uploadPatients()
        }, 1000);

        const patientIdsToCheck = new Set<string>()
        const tasks: ITask[] = []
        let progress = 0

        for (const id of patientIds) {
            const patient = await PatientService.getPatient(id)

            progress++
            this.setState({
                progress: progress / patientIds.length
            })

            if (!patient) continue
            forEachConsultation(patient, (consultation: IConsultation) => {
                if (patientIdsToCheck.has(id)) return
                const date = consultation.data["#CONSULTATION-DATE"]
                if (!date) return
                if (figureOutDate(date) === false) return
                tasks.push({
                    patient,
                    consultations: extractConsultationsToCheck(patient)
                })
                patientIdsToCheck.add(id)
            })
        }

        this.setState({
            tasks: tasks.slice(),
            progress: 1
        })
        console.log("Done!")
    }

    componentWillUnmount() {
        this.isMounted = false
    }

    uploadPatients = async () => {
        while (this.isMounted) {
            const tasks = this.state.tasks.slice()
            while (tasks.length > 0) {
                const task = tasks.shift()
                if (!task) continue
                for (const consultationToCheck of task.consultations) {
                    if (consultationToCheck.newDate === false) continue
                    await this.updateConsultation(task.patient, consultationToCheck)
                }
            }

            await sleep(1000)
        }
    }

    /**
     * Log a new error that occured during upload.
     */
    private addError = (patient: IPatient, consultation: IConsultation, error: number) => {
        const errors = this.state.errors.slice()
        errors.unshift({ patient, consultation, error })
        this.setState({ errors })
    }

    private async updateConsultation(patient: IPatient,
                                     consultationToCheck: IConsultationToCheck) {
        const oldDate = consultationToCheck.oldDate
        const newDate = consultationToCheck.newDate
        if (typeof newDate === 'boolean') return
        const oldDateEpoc = DateService.dateToNumberOfSeconds(oldDate)
        const newDateEpoc = DateService.dateToNumberOfSeconds(newDate)

        const consultationsToUpdate: IConsultation[] = []
        forEachConsultation(patient, (consultation: IConsultation) => {
            if (consultation.enter === oldDateEpoc) {
                consultation.enter = newDateEpoc
                consultationsToUpdate.push(consultation)
            }
        })

        for (const consultationToUpdate of consultationsToUpdate) {
            const result = await ConsultationService.update(
                patient.id,
                DateService.dateToNumberOfSeconds(oldDate), {
                    enter: DateService.dateToNumberOfSeconds(newDate),
                    data: consultationToUpdate.data
                }
            )
            console.info("result=", result);
            if (result !== 0) {
                // Upload failed!
                consultationToUpdate.enter = DateService.dateToNumberOfSeconds(oldDate)
                this.addError(patient, consultationToUpdate, result)
            }
        }

        // Save patient to disk
        PatientService.setPatient(patient)

        window.setTimeout(() => {
            // Remove patient from display after 2 seconds.
            this.setState({
                tasks: this.state.tasks.filter((t: ITask) => (
                    t.patient.id !== patient.id
                ))
            })
        }, 2000)

        consultationToCheck.uploaded = true
        this.setState({
            tasks: this.state.tasks.map((task: ITask) => {
                if (task.patient.id === patient.id) {
                    return task
                }
                return {
                    patient: { ...task.patient },
                    consultations: task.consultations.map(
                        (consult: IConsultationToCheck) => {
                            if (consult.oldDate !== consultationToCheck.oldDate) {
                                return consult
                            }
                            return consultationToCheck
                        }
                    )
                }
            })
        })
    }

    renderPatientName = (patient: IPatient, index: number) => {
        const { data } = patient

        return <div className="name">
            <span className='lastname'>{
                data["#PATIENT-LASTNAME"]
            }</span>
            <span className='firstname'>{
                data["#PATIENT-FIRSTNAME"]
            }</span>
            <span className='secondname'>{
                data["#PATIENT-SECONDNAME"]
            }</span>
            <span className="count">{
                `(${index + 1} / ${this.state.tasks.length})`
            }</span>
        </div>
    }

    renderTask = (task: ITask, index: number) => {
        const { patient, consultations } = task
        return <div className="patient thm-bg2" key={`patient-${patient.id}`}>
            { this.renderPatientName(patient, index) }
            <ul>{
                consultations.map((consultationToCheck: IConsultationToCheck) => {
                    const newDate = consultationToCheck.newDate
                    if (typeof newDate === 'boolean') return null
                    return <li>
                        <span style={{ opacity: consultationToCheck.uploaded ? .5 : 1 }}>
                            <span>{consultationToCheck.oldDate.toLocaleDateString()}</span>
                            <b> - </b>
                            <span>{newDate.toLocaleDateString()}</span>
                        </span>
                        {
                            <Icon
                                content={
                                    consultationToCheck.uploaded ? "ok" : "wait"
                                }
                                animate={!consultationToCheck.uploaded} />
                        }
                    </li>
                })
            }</ul>
        </div>
    }

    private renderError = (error: IUploadFailure) => {
        return <div>
            <div>Patient: <b>{error.patient.id}</b></div>
            <div>{
                DateService.numberOfSecondsToDate(
                    error.consultation.enter
                ).toLocaleDateString()
            }</div>
            <div>"<code>{error.consultation.data["#CONSULTATION-DATE"]}</code>"</div>
            <div>Error: <b>{error.error}</b></div>
        </div>
    }

    render() {
        const { tasks, progress, errors } = this.state
        const classes = ['App']

        return (<div className={classes.join(' ')}>
            <header className="thm-bgPD">
                <Icon
                    content="back"
                    onClick={() => window.history.back()} />
                <div className='title'>{
                    _('title')
                }</div>
            </header>
            <div className="errors">{
                errors.map(this.renderError)
            }</div>
            {
                tasks.length === 0 &&
                <div className="progress thm-ele-8 thm-bgSL">
                    <div>Analyse en cours:</div>
                    <code>{
                        (0.1 * Math.floor(1000 * progress)).toFixed(1)
                    } %</code>
                </div>
            }
            <div className="patients">{
                tasks.map(this.renderTask)
            }</div>
        </div>)
    }
}

const RX_DATE = /[^0-9]*([0-9]+)[^0-9]+([0-9]+)[^0-9]+([0-9]+)[^0-9]*/g

/**
 * Given a string, try to figure out a date.
 * In case of success, return an instance of Date.
 * Otherwise return `false`.
 */
function figureOutDate(text: string) {
    // Reset regexp
    RX_DATE.lastIndex = -1
    const m = RX_DATE.exec(text)
    if (!m) {
        return false
    }
    const dd = parseInt(m[1], 10)
    const mm = parseInt(m[2], 10)
    let yy = parseInt(m[3], 10)
    if (yy < 100) yy += 2000
    if (yy < 2000) {
        return false
    }
    const date = new Date(yy, mm - 1, dd)
    return date
}


function forEachConsultation(patient: IPatient,
                             callback: (consultation: IConsultation) => void) {
    if (!patient || !Array.isArray(patient.admissions)) return
    for (const admission of patient.admissions) {
        if (!admission || !Array.isArray(admission.visits)) return
        for (const consultation of admission.visits) {
            callback(consultation)
        }
    }
}

function extractConsultationsToCheck(patient: IPatient): IConsultationToCheck[] {
    const consultations: IConsultationToCheck[] = []
    forEachConsultation(patient, (consultation: IConsultation) => {
        const newDateText = (consultation.data["#CONSULTATION-DATE"] || "").trim()
        const newDate = newDateText.length === 0 ? false : figureOutDate(newDateText)
        consultations.push({
            consultation: { ...consultation },
            oldDate: DateService.numberOfSecondsToDate(consultation.enter),
            newDate,
            uploaded: false
        })
    })

    return consultations
}


function sleep(milliseconds: number) {
    return new Promise(resolve => {
        window.setTimeout(resolve, milliseconds)
    })
}
