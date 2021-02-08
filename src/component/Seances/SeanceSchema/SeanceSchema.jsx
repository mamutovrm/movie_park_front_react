import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import css from './Seance.module.css';
import SeanceSchemaUtils from "./SeanceSchemaUtils";
import ApiMethodsUtils from "../../../scripts/API_methods";
import GeneralUtils from "../../../scripts/GeneralUtils";

function log(...args) {
    GeneralUtils.log("SeanceSchema", ...args)
}

export class SeanceSchema extends Component {
    constructor(props) {
        super(props);

        this.selectThePlace = this.selectThePlace.bind(this);
        this.buyTickets = this.buyTickets.bind(this);

        this.state = {
            seanceId: props.match.params.seanceId,
            seanceInfo: props.location.state.seanceInfo,
            totalPrice: 0,
            selectedPlaceList: new Set(),
            seancePlacesInfoList: Object
        }
    }

    componentDidMount() {
        ApiMethodsUtils.getSeancePlacesInfoById(this.state.seanceId)
            .then(response => {
                log("response", response.data)
                this.setState({seancePlacesInfoList: response.data});
            })
            .then(() => log("seancePlacesInfo", this.state.seancePlacesInfoList))
            .catch(error => log("ERROR:", error))
            .then(() => {
                this.drawAllSeats();
            })
    }

    drawAllSeats() {
        this.totalPrice = 0;
        let basePrice = this.state.seanceInfo.basePrice;
        let vipPrice = this.state.seanceInfo.vipPrice;
        let hallPlacesInfo = window.hallPlacesInfo[this.state.seanceInfo["hallId"]]
        let svgns = "http://www.w3.org/2000/svg";
        let container = document.getElementById('seanceGraphArea');

        Object.keys(this.state.seancePlacesInfoList).forEach(index => {
            let eachPlace = this.state.seancePlacesInfoList[index];
            let placeId = eachPlace.placeId;
            let blocked = eachPlace.blocked;
            //remove old element
            let currentElement = container.getElementById(placeId);
            if (currentElement != null) {
                currentElement.remove();
            }

            //create new element
            let circle = document.createElementNS(svgns, 'circle');
            let placeInfo = hallPlacesInfo[placeId]
            SeanceSchemaUtils.createCircleByParameters(circle, placeId, blocked,
                placeInfo, basePrice, vipPrice);
            container.appendChild(circle);
        })

        let width = container.getBoundingClientRect().width;
        let height = container.getBoundingClientRect().height;
        let curvedLine = document.createElementNS(svgns, 'path');
        SeanceSchemaUtils.createScreen(curvedLine, width, height);
        container.appendChild(curvedLine);
    }

    selectThePlace(event) {
        let element = document.elementsFromPoint(event.clientX, event.clientY)[0];
        if (element == null) {
            return;
        }

        if (element.getAttribute('blocked') === 'true') {
            console.log("Place id = %s is blocked.", element.getAttribute("id"));
            return;
        }

        if (element.classList.contains(css.seat)) {
            let placePrice = SeanceSchemaUtils.getPlacePrice(element);
            const elementId = element.getAttribute("id")
            if (element.getAttribute('selected') === 'true') {
                console.log("Place id = %s was selected. Unselect it.", elementId);
                element.setAttribute('r', "2.5%");
                element.setAttribute('selected', false);
                this.state.selectedPlaceList.delete(element.getAttribute("id"))
                this.setState({totalPrice: this.state.totalPrice - placePrice});
            } else {
                console.log("Place id = %s wasn't selected. Select it.", elementId);
                element.setAttribute('r', "3%");
                element.setAttribute('selected', true);
                this.state.selectedPlaceList.add(element.getAttribute("id"))
                this.setState({totalPrice: this.state.totalPrice + placePrice});
            }
        }
    }

    buyTickets() {
        let blockPlacesRequestBody = SeanceSchemaUtils.prepareBlockUnblockPlacesRequestBody(
            this.state.selectedPlaceList, this.state.seanceId, true)
        this.props.history.push({
            pathname: `/seance/payment`,
            state: {blockPlacesRequestBody: blockPlacesRequestBody}
        });
    }

    render() {
        return (
            <div>
                <div>Seance id: {this.state.seanceId} TOTAL PRICE: {this.state.totalPrice}</div>
                <div>SELECTED: {SeanceSchemaUtils.selectedPlaceListToString(this.state.selectedPlaceList)}</div>
                <button type="button" className="btn btn-primary" onClick={this.buyTickets}>Buy tickets</button>
                <br/>
                <svg
                    id="seanceGraphArea" height="800" width="800"
                    xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                    onClick={this.selectThePlace}>
                </svg>
            </div>
        );
    }
}

export default withRouter(SeanceSchema)