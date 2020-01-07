import React from "react"
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import EditConsultation from "../page/edit-consultation"
import FixConsultationDate from "../page/fix-consultation-dates"


export default class App extends React.Component<{}, {}> {
    render() {
        return (<Router>
            <Switch>
                <Route path="/consultation/edit/" children={<EditConsultation />} />
                <Route path="/consultation/check" children={<FixConsultationDate />} />
            </Switch>
        </Router>)
    }
}
