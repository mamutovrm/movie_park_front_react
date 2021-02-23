import React, {Component} from 'react';
import SeancesForOneMoviePark from "../seances-for-one-movie-park/seances-for-one-movie-park";
import ApiMethodsUtils, {SeanceInfo} from "../../../scripts/api-methods";
import GeneralUtils from "../../../scripts/general-utils";
import {moviesPictureDict} from "../../../scripts/constants";
import {RouteComponentProps} from "react-router-dom";

function log(...args: any[]) {
    GeneralUtils.log("SeancesForAllMovieParks", ...args)
}

interface ISeancesForAllMovieParksProps extends RouteComponentProps<any> {
    location: any;
}

interface ISeancesForAllMovieParksState {
    movieId: number;
    activeDate: string;
    seanceDict: Record<string, SeanceInfo[]>
}

export class SeancesForAllMovieParks extends
    Component<ISeancesForAllMovieParksProps, ISeancesForAllMovieParksState> {
    constructor(props: ISeancesForAllMovieParksProps) {
        super(props);

        this.state = {
            movieId: props.match.params.movieId,
            activeDate: props.match.params.activeDate,
            seanceDict: {}
        }
    }

    componentWillMount() {
        ApiMethodsUtils.getAllSeancesByMovieAndDate(this.state.movieId, this.state.activeDate)
            .then(response => {
                log("seanceDict", response)
                this.setState({seanceDict: response});
            })
            .catch(error => log("ERROR:", error))
    }

    showHeader() {
        return (
            <h3>Расписание сеансов "{moviesPictureDict[this.state.movieId].name}"</h3>
        )
    }

    showSeancesForOneMoviePark() {
        log("seanceDict", this.state.seanceDict)
        let movieParkNames = Object.keys(this.state.seanceDict)

        if (movieParkNames.length > 0) {
            return (
                movieParkNames.map(movieParkName => {
                        log("movieParkName:", movieParkName)
                        log("seanceList:", this.state.seanceDict[movieParkName])
                        return (
                            <SeancesForOneMoviePark
                                movieParkName={movieParkName}
                                seancesByDateAndMovie={this.state.seanceDict[movieParkName]}
                            />
                        )
                    }
                )
            )
        }

        log("empty")
    }

    render() {
        return (
            <div>
                {this.showHeader()}
                <br/>
                {this.showSeancesForOneMoviePark()}
            </div>
        );
    }
}

export default SeancesForAllMovieParks;
