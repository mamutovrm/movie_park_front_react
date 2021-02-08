import React, {Component} from 'react';
import {VisaCreditCard as VisaCard} from "react-fancy-visa-card";
import GeneralUtils from "../../../scripts/GeneralUtils";
import ApiMethodsUtils from "../../../scripts/API_methods";
import {withRouter} from "react-router-dom";

function log(...args) {
    GeneralUtils.log("Payment", ...args)
}

export class Payment extends Component {
    constructor(props) {
        super(props);

        this.pay = this.pay.bind(this);

        this.state = {
            blockPlacesRequestBody: props.location.state.blockPlacesRequestBody
        }
    }

    pay = (e, data) => {
        log("Payment processed. Card parameters", data);
        log("Blocking places", this.state.blockPlacesRequestBody);
        ApiMethodsUtils.blockPlaces(this.state.blockPlacesRequestBody).then(() => {
            this.props.history.push(`/seance/payment/success`);
        });
    };

    render() {
        return (
            <VisaCard onSubmit={this.pay} />
        );
    }
}

export default withRouter(Payment)