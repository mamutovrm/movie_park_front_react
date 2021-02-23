import React, {Component} from 'react';
import {RouteComponentProps, withRouter} from "react-router-dom";
import GeneralUtils from "../../../scripts/general-utils";

function log(...args: any[]) {
    GeneralUtils.log("PaymentSuccess", ...args)
}

interface IPaymentSuccessProps extends RouteComponentProps<any> {
}

export class PaymentSuccess extends Component<IPaymentSuccessProps> {
    constructor(props: IPaymentSuccessProps) {
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