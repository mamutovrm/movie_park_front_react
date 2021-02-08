import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import GeneralUtils from "../../../scripts/GeneralUtils";

function log(...args) {
    GeneralUtils.log("PaymentSuccess", ...args)
}

export class PaymentSuccess extends Component {
    constructor(props) {
        super(props);

        this.goToStartPage = this.goToStartPage.bind(this);
    }

    goToStartPage() {
        log("Go to start page");
        this.props.history.push(`/`);
    };

    render() {
        return (
            <div>
                <h2>Бронирование билетов успешно завершено</h2>
                <button type="button" className="btn btn-success" onClick={this.goToStartPage}>
                    На главную
                </button>
            </div>
        );
    }
}

export default withRouter(PaymentSuccess)