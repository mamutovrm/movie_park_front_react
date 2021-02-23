import React, {Component} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import GeneralUtils from "../../../scripts/general-utils";
import {SeanceInfo} from "../../../scripts/api-methods";

function log(...args: any[]) {
    GeneralUtils.log("SeanceButton", ...args)
}

interface ISeanceButtonProps extends RouteComponentProps<any> {
    seanceInfo: SeanceInfo;
}

export class SeanceButton extends Component<ISeanceButtonProps> {
    constructor(props: ISeanceButtonProps) {
        super(props);

        this.goToSeance = this.goToSeance.bind(this);
    }

    goToSeance() {
        this.props.history.push({
            pathname: `/seance/seance_id=${this.props.seanceInfo.seanceId}`,
            state: {seanceInfo: this.props.seanceInfo}
        });
    }

    showTimeHHMMFormat(timeAsString: string) {
        return timeAsString.substring(0, timeAsString.lastIndexOf(":"));
    }

    render() {
        log("seanceInfo: ", this.props.seanceInfo)
        return (
            <button type="button" className="btn btn-warning" onClick={this.goToSeance}>
                {log("seanceInfo", this.props.seanceInfo)}
                {this.showTimeHHMMFormat(this.props.seanceInfo.startTime)}
            </button>
        );
    }
}

export default withRouter(SeanceButton);