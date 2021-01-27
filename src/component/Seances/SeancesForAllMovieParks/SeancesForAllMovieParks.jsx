import React, {Component} from 'react';
import SeancesForOneMoviePark from "../SeancesForOneMoviePark/SeancesForOneMoviePark";
import ApiMethodsUtils from "../../../scripts/API_methods";
import GeneralUtils from "../../../scripts/GeneralUtils";

function log(...args) {
    GeneralUtils.log("SeancesForAllMovieParks", ...args)
}

export class SeancesForAllMovieParks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            movieId: this.props.match.params.movieId,
            activeDate: this.props.match.params.activeDate,
            seanceDict: Object
        }
    }

    componentDidMount() {
        ApiMethodsUtils.getAllSeancesByMovieAndDate(this.state.movieId, this.state.activeDate)
            .then(response => {
                log("response", response.data)
                this.setState({seanceDict: response.data});
            })
            .then(() => log("seanceDict", this.state.seanceDict))
            .catch(error => log("ERROR:", error))
    }

    showHeader() {
        let oneMovieDict = window.moviesPictureDict[this.state.movieId]
        return (
            <h3>Расписание сеансов "{oneMovieDict.name}"</h3>
        )
    }

    showSeancesForOneMoviePark() {
        let seanceDict = this.state.seanceDict
        log("seanceDict", seanceDict)
        let movieParkNames = Object.keys(seanceDict)

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
