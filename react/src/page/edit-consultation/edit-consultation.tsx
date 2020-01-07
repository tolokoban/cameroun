import React from "react"

import ConsultationService from "../../service/consultation"
import PatientService from "../../service/patient"
import DateService from "../../service/date"
import SplashService from "../../service/splash"
import { IPatient, IConsultation } from '../../types'
import Tfw from "tfw"
import "./edit-consultation.css"

//const Button = Tfw.View.Button
const Icon = Tfw.View.Icon
const Intl = Tfw.Intl

const _ = Intl.make(require("./edit-consultation.yaml"))

interface TEditConsultationProps {}
interface TEditConsultationState {}

export default class EditConsultation extends React.Component<TEditConsultationProps, TEditConsultationState> {
    constructor( props: TEditConsultationProps ) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {
        await SplashService.hide()
    }

    render() {
        const classes = ['page-EditConsultation']

        return (<div className={classes.join(' ')}>
        <header className="thm-bgPD">
            <Icon
                content="back"
                onClick={() => window.history.back()} />
            <div className='title'>{
                _('title')
            }</div>
        </header>
        </div>)
    }
}
