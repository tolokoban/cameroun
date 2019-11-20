import React from "react"

import Icon from "../tfw/view/icon"
import Intl from "../tfw/intl"
import PatientService from "../service/patient"
import { IPatient, IConsultation } from '../types'

import "./app.css"

const _ = Intl.make(require("./app.yaml"))

interface ITask {
    patient: IPatient
}

interface IDateMap {
    current: Date,
    candidate: string,
    consultation: IConsultation
}

interface TAppProps {}
interface TAppState {
    patientsCount: number,
    tasks: ITask[]
}

export default class App extends React.Component<TAppProps, TAppState> {
    constructor( props: TAppProps ) {
        super(props)
        this.state = {
            patientsCount: 0,
            tasks: []
        }
    }

    async componentDidMount() {
        const patientIds = await PatientService.getAllPatientIds()
        this.setState({ patientsCount: patientIds.length })

        document.body.classList.add("start");
        setTimeout(() => {
            const body = document.body;
            const splash1 = document.getElementById("splash1");
            const splash2 = document.getElementById("splash2");
            if (splash1) body.removeChild(splash1);
            if (splash2) body.removeChild(splash2);
        }, 1000);

        const patientIdsToCheck = new Set<string>()
        const tasks: ITask[] = []

        for( const id of patientIds) {
            const patient = await PatientService.getPatient(id)
            if (!patient) continue
            if (!patient || !Array.isArray(patient.admissions)) continue
            for (const admission of patient.admissions) {
                if (!admission || !Array.isArray(admission.visits)) continue
                for (const consultation of admission.visits) {
                    const date = consultation.data["#CONSULTATION-DATE"]
                    if (!date) continue
                    if (patientIdsToCheck.has(id)) continue
                    patientIdsToCheck.add(id)
                    tasks.push({
                        patient
                    })
                    this.setState({
                        tasks: tasks.slice()
                    })
                }
            }
        }

        console.log("Done!")
    }

    renderPatientName = (patient: IPatient, index: number) => {
        const { data } = patient

        const datesMap: IDateMap[] = []

        for (const admission of patient.admissions) {
            if (!admission || !Array.isArray(admission.visits)) continue
            for (const consultation of admission.visits) {
                const date = consultation.data["#CONSULTATION-DATE"]
                if (!date) continue

                datesMap.push({
                    consultation,
                    current: new Date(consultation.enter * 1000),
                    candidate: date
                })
            }
        }

        return <div className="patient thm-bg2">
            <div className="name">
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
                    `(${index} / ${this.state.patientsCount})`
                }</span>
            </div>
            <ul className="consultations">{
                datesMap.map(item => (
                    <li>
                        <span>{item.current.toUTCString()}</span>
                        <span> : </span>
                        <code>{item.candidate}</code>
                        <span> / </span>
                        {figureOutDate(item.candidate)}
                    </li>
                ))
            }</ul>
        </div>
    }

    render() {
        const classes = ['App']

        return (<div className={classes.join(' ')}>
            <header className="thm-bgPD">
                <Icon
                    content="back"
                    onClick={() => window.history.back()}/>
                <div className='title'>{
                    _('title')
                }</div>
            </header>
            <div className="patients">{
                this.state.tasks
                    .map(task => task.patient)
                    .map(this.renderPatientName)
            }</div>
        </div>)
    }
}

const RX_DATE = /[^0-9]*([0-9]+)[^0-9]+([0-9]+)[^0-9]+([0-9]+)[^0-9]*/g

function figureOutDate(text: string) {
    RX_DATE.lastIndex = -1
    const m = RX_DATE.exec(text)
    if (!m) {
        console.info(JSON.stringify(text), "BAD")
        return <span className="error">### BAD DATE ###</span>
    }
    const dd = parseInt(m[1], 10)
    const mm = parseInt(m[2], 10)
    let yy = parseInt(m[3], 10)
    if (yy < 100) yy += 2000
    if (yy < 2000) {
        console.info(JSON.stringify(text), "BAD YEAR")
        return <span className="error">{`### BAD YEAR ${m[3]} ###`}</span>
    }
    const date = new Date(yy, mm - 1, dd)
    console.log(text, m[1], m[2], m[3])
    return <span>{date.toLocaleString()}</span>
}
