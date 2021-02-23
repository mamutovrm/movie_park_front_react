import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import css from "./seances-for-one-movie-park.module.css";
import SeanceButton from "../seance-button/seance-button";
import GeneralUtils from "../../../scripts/general-utils";

function log(...args: any[]) {
    GeneralUtils.log("SeancesForOneMoviePark", ...args)
}

interface ISeancesForOneMovieParkProps {
    seancesByDateAndMovie: any;
    movieParkName: string;
}

interface ISeancesForOneMovieParkState {
    sortedSeanceList: any;
}

export class SeancesForOneMoviePark extends
    Component<ISeancesForOneMovieParkProps, ISeancesForOneMovieParkState> {

    showSeanceButton(seanceList: any, row: number) {
        if (seanceList[row] != null) {
            return <SeanceButton seanceInfo={seanceList[row]}/>
        }

        log("empty seance ", row)
        return null
    }

    componentWillMount() {
        log("seanceList before sort: ", this.props.seancesByDateAndMovie)

        this.props.seancesByDateAndMovie.sort(function (a: any, b: any) {
            let date1 = new Date(a['seanceDate'] + ' ' + a['startTime']);
            let date2 = new Date(b['seanceDate'] + ' ' + b['startTime']);
            if (date1 > date2) return 1;
            else if (date1 === date2) return 0;
            else return -1;
        });

        log("seanceList after sort: ", this.props.seancesByDateAndMovie)
    }

    show_seances(seanceList: any) {
        let rows_array = []
        for (let i = 0; i < Math.ceil(seanceList.length / 7); i++) {
            rows_array.push(i)
        }
        if (seanceList.length > 0) {
            return (
                <div className="row" id={"row_" + this.props.movieParkName}>
                    <div className="col-4" id={"leftColumn_" + this.props.movieParkName}>
                        <div className={css.movie_park_text}>{this.props.movieParkName}</div>
                    </div>
                    <div className="col-8" id={"rightColumn_" + this.props.movieParkName}>
                        {rows_array.map(row => {
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
        let seanceList = this.props.seancesByDateAndMovie
        log("seanceList: ", seanceList)
        return (
            <>{this.show_seances(seanceList)}</>
        );
    }
}

export default SeancesForOneMoviePark;