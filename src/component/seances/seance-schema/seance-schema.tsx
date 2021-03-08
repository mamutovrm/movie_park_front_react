import React, {Component} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import css from './seance-schema.module.css';
import SeanceSchemaUtils from "./seance-schema-utils";
import {SeanceInfo, SeancePlace, getSeancePlacesInfoById} from "../../../scripts/api-methods";
import GeneralUtils from "../../../scripts/general-utils";
import {hallsPlacesInfo} from "../../../scripts/constants";

function log(...args: any[]) {
    GeneralUtils.log("SeanceSchema", ...args)
}

interface ISeanceSchemaProps extends RouteComponentProps<any> {
    location: any;
}

interface ISeanceSchemaState {
    seanceId: number;
    seanceInfo: SeanceInfo;
    totalPrice: number;
    selectedPlaceList: Set<number>;
    seancePlacesInfoList: SeancePlace[];
}

export class SeanceSchema extends Component<ISeanceSchemaProps, ISeanceSchemaState> {
    constructor(props: ISeanceSchemaProps) {
        super(props);

        this.selectThePlace = this.selectThePlace.bind(this);
        this.buyTickets = this.buyTickets.bind(this);

        this.state = {
            seanceId: props.match.params.seanceId,
            seanceInfo: props.location.state.seanceInfo,
            totalPrice: 0,
            selectedPlaceList: new Set(),
            seancePlacesInfoList: []
        }
    }

    async componentWillMount() {
        let seancePlacesInfoList = await getSeancePlacesInfoById(this.state.seanceId)
        this.setState({seancePlacesInfoList: seancePlacesInfoList});
        this.drawAllSeats();
    }

    drawAllSeats() {
        let basePrice = this.state.seanceInfo.basePrice;
        let vipPrice = this.state.seanceInfo.vipPrice;
        let hallPlacesInfo = hallsPlacesInfo[this.state.seanceInfo.hallId]
        let svgns = "http://www.w3.org/2000/svg";
        let container: any = document.getElementById('seanceGraphArea');

        this.state.seancePlacesInfoList.forEach((eachPlace: SeancePlace) => {
            let placeId: number = eachPlace.placeId;
            let blocked: boolean = eachPlace.blocked;
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

    selectThePlace(event: any): void {
        function _changeCircle(_element: Element, _radius: string, _selected: boolean){
            _element.setAttribute('r', _radius);
            _element.setAttribute('selected', _selected + "");
        }

        let element: any = document.elementsFromPoint(event.clientX, event.clientY)[0];
        if (element == null) {
            return;
        }

        const elementId = element.getAttribute("id")
        if (element.getAttribute('blocked') === 'true') {
            log(`Place id = ${elementId} is blocked.`);
            return;
        }

        if (element.classList.contains(css.seat)) {
            let placePrice = parseInt(element.getAttribute('price'), 10);
            if (element.getAttribute('selected') === 'true') {
                log(`Place id = ${elementId} was selected. Unselect it.`);
                _changeCircle(element, "2.5%", false)
                this.state.selectedPlaceList.delete(elementId)
                this.setState({totalPrice: this.state.totalPrice - placePrice});
            } else {
                log(`Place id = ${elementId} wasn't selected. Select it.`);
                _changeCircle(element, "3.0%", true)
                this.state.selectedPlaceList.add(elementId)
                this.setState({totalPrice: this.state.totalPrice + placePrice});
            }
        }
    }

    buyTickets() {
        let blockPlacesRequestBody = SeanceSchemaUtils.prepareBlockUnblockPlacesRequestBody(
            this.state.selectedPlaceList, this.state.seanceId)
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