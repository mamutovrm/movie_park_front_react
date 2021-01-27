import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import GeneralUtils from "../../../scripts/GeneralUtils";

function log(...args) {
    GeneralUtils.log("SeanceButton", ...args)
}

export class SeanceButton extends Component {
    constructor(props) {
        super(props);

        this.goToSeance = this.goToSeance.bind(this);
    }

    goToSeance() {
        let seanceId = this.props.seanceInfo["seanceId"]
        let hallId = this.props.seanceInfo["hallId"]
        this.props.history.push(`/seance/seance_id=${seanceId}/hall_id=${hallId}`);
    }

    show_time_hhmm_format(time) {
        return time.substring(0, time.lastIndexOf(":"));
    }

    render() {
        log("seanceInfo: ", this.props.seanceInfo)
        return (
            <button type="button" className="btn btn-warning" onClick={this.goToSeance}>
                {log("seanceInfo", this.props.seanceInfo)}
                {this.show_time_hhmm_format(this.props.seanceInfo["startTime"])}
            </button>
        );
    }
}

export default withRouter(SeanceButton);
