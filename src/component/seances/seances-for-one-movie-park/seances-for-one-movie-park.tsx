import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import css from "./seances-for-one-movie-park.module.css";
import SeanceButton from "../seance-button/seance-button";
import GeneralUtils from "../../../scripts/general-utils";
import {SeanceInfo} from "../../../scripts/api-methods";

function log(...args: any[]) {
    GeneralUtils.log("SeancesForOneMoviePark", ...args)
}

interface ISeancesForOneMovieParkProps {
    seanceList: SeanceInfo[]
    movieParkName: string
}

export class SeancesForOneMoviePark extends
    Component<ISeancesForOneMovieParkProps> {

    showSeanceButton(seanceList: any, row: number) {
        if (seanceList[row] != null) {
            return <SeanceButton seanceInfo={seanceList[row]}/>
        }

        log("empty seance ", row)
        return null
    }

    componentWillMount() {
        log("seancesByDateAndMovie before sort: ", this.props.seanceList)

        function toDate(seanceInfo: SeanceInfo): Date {
            return new Date(`${seanceInfo.seanceDate} ${seanceInfo.startTime}`)
        }

        this.props.seanceList.sort(function (a: any, b: any) {
            let date1 = toDate(a);
            let date2 = toDate(b);
            if (date1 > date2) return 1;
            else if (date1 === date2) return 0;
            else return -1;
        });

        log("seancesByDateAndMovie after sort: ", this.props.seanceList)
    }

    show_seances(seanceList: SeanceInfo[]) {
        let rowsList: number[] = []
        for (let i = 0; i < Math.ceil(seanceList.length / 7); i++) {
            rowsList.push(i)
        }
        if (seanceList.length > 0) {
            return (
                <div className="row" id={"row_" + this.props.movieParkName}>
                    <div className="col-4" id={"leftColumn_" + this.props.movieParkName}>
                        <div className={css.movie_park_text}>{this.props.movieParkName}</div>
                    </div>
                    <div className="col-8" id={"rightColumn_" + this.props.movieParkName}>
                        {rowsList.map(row => {
                                return (
                                    <div className={css.seances_row}>
                                        {this.showSeanceButton(seanceList, 5 * row)}
                                        {this.showSeanceButton(seanceList, 5 * row + 1)}
                                        {this.showSeanceButton(seanceList, 5 * row + 2)}
                                        {this.showSeanceButton(seanceList, 5 * row + 3)}
                                        {this.showSeanceButton(seanceList, 5 * row + 4)}
                                        {this.showSeanceButton(seanceList, 5 * row + 5)}
                                        {this.showSeanceButton(seanceList, 5 * row + 6)}
                                    </div>
                                )
                            }
                        )}
                    </div>
                </div>
            )
        }

        log("empty")
    }

    render() {
        return (
            <>{this.show_seances(this.props.seanceList)}</>
        );
    }
}

export default SeancesForOneMoviePark;
