import React, {Component} from 'react';
import SeancesForOneMoviePark from "../seances-for-one-movie-park/seances-for-one-movie-park";
import {MovieInfo, SeanceInfo, getAllSeancesByMovieAndDate} from "../../../scripts/api-methods";
import GeneralUtils from "../../../scripts/general-utils";
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
    movieInfo: MovieInfo;
    movieParkNames: string[]
    seanceDict: Map<string, SeanceInfo[]>
}

export class SeancesForAllMovieParks extends
    Component<ISeancesForAllMovieParksProps, ISeancesForAllMovieParksState> {
    constructor(props: ISeancesForAllMovieParksProps) {
        super(props);

        this.state = {
            movieId: props.match.params.movieId,
            activeDate: props.match.params.activeDate,
            movieInfo: props.location.state.movieInfo,
            movieParkNames: [],
            seanceDict: new Map<string, SeanceInfo[]>()
        }
    }

    async componentWillMount() {
        const seanceDict: Map<string, SeanceInfo[]> = await getAllSeancesByMovieAndDate(this.state.movieId, this.state.activeDate)
        log("seanceDict", seanceDict)
        this.setState({seanceDict: seanceDict});
        this.setState({movieParkNames: Array.from(seanceDict.keys())});
    }

    showHeader() {
        return (
            <h3>Расписание сеансов "{this.state.movieInfo.movieName}"</h3>
        )
    }

    showSeancesForOneMoviePark() {
        if (this.state.movieParkNames.length > 0) {
            return (
                this.state.movieParkNames.map(movieParkName => {
                        log("movieParkName:", movieParkName)
                        log("seanceList:", this.state.seanceDict.get(movieParkName))
                        return (
                            <SeancesForOneMoviePark
                                movieParkName={movieParkName}
                                seanceList={this.state.seanceDict.get(movieParkName) as SeanceInfo[]}
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
