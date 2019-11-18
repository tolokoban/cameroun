import React from "react"

import Icon from "../tfw/view/icon"
import Intl from "../tfw/intl"
import PatientService from "../service/patient"
import { IPatient } from '../types'

import "./app.css"

const _ = Intl.make(require("./app.yaml"))

interface TAppProps {}
interface TAppState {}

export default class App extends React.Component<TAppProps, TAppState> {
    constructor( props: TAppProps ) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {
        const patientIds = await PatientService.getAllPatientIds()
        console.info("patientIds=", patientIds);

        document.body.classList.add("start");
        setTimeout(() => {
            const body = document.body;
            const splash1 = document.getElementById("splash1");
            const splash2 = document.getElementById("splash2");
            if (splash1) body.removeChild(splash1);
            if (splash2) body.removeChild(splash2);
        }, 1000);

        for( const id of patientIds) {
            const patient = await PatientService.getPatient(id)
            for (const admission of patient.admissions) {
                for (const consultation of admission.visits) {
                    const date = consultation.data["#CONSULTATION-DATE"]
                    if (!date) continue
                    console.log(patient.id, consultation.enter, date)
                }
            }
        }
        console.log("Done!")
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
        </div>)
    }
}
