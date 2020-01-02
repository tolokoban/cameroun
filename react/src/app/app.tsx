import React from "react"
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import FixConsultationDate from "../page/fix-consultation-dates"


export default class App extends React.Component<{}, {}> {
    render() {
        return (<Router>
            <Switch>
                <Route path="/" children={<FixConsultationDate />} />
            </Switch>
        </Router>)
    }
}
