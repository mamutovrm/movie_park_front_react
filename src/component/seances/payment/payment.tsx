import React, {Component} from 'react';
import GeneralUtils from "../../../scripts/general-utils";
import {blockPlaces} from "../../../scripts/api-methods";
import {RouteComponentProps, withRouter} from "react-router-dom";

function log(...args: any[]) {
    GeneralUtils.log("Payment", ...args)
}

interface IPaymentProps extends RouteComponentProps<any> {
    location: any;
}

export class Payment extends Component<IPaymentProps> {
    constructor(props: IPaymentProps) {
        super(props);

        this.payAndBlockPlaces = this.payAndBlockPlaces.bind(this);
    }

    async payAndBlockPlaces() {
        log("payment processed");
        let requestBody = this.props.location.state.blockPlacesRequestBody
        log("Blocking places", requestBody);
        await blockPlaces(requestBody)
        this.props.history.push(`/seance/payment/success`);
    }

    render() {
        return (
            <div>
                <h3>There would be payment form</h3>
                <button type="button" className="btn btn-success" onClick={this.payAndBlockPlaces}>
                    Оплатить
                </button>
            </div>
        );
    }
}

export default withRouter(Payment);