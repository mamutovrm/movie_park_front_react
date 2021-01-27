import React, {Component} from 'react';
import ApiMethodsUtils from '../../scripts/API_methods'
import GeneralUtils from "../../scripts/GeneralUtils";
import css from './Movies.module.css'
import Movie from "./Movie/Movie";

function log(...args) {
    GeneralUtils.log("Movies", ...args)
}

export class Movies extends Component {
    constructor(props) {
        super(props);

        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.state = {
            X: 0,
            Y: 0,
            firstDateStr: '',
            secondDateStr: '',
            seanceInfo: Object,
            movies: Object,
            activeDateMovies: Object
        }
    }

    handleMouseMove(event) {
        this.setState({
            X: event.clientX,
            Y: event.clientY
        });
    }

    componentDidMount() {
        GeneralUtils.stringToDatePromise(this.props.activeDateStr, "YYYY-MM-DD", "-")
            .then(activeDate => {
                let secondDate = new Date(activeDate.getTime());
                secondDate.setDate(secondDate.getDate() + 7)
                this.setState({firstDateStr: this.props.activeDateStr});
                this.setState({secondDateStr: GeneralUtils.dateToString(secondDate)});
                log("firstDateStr:", this.state.firstDateStr)
                log("secondDateStr:", this.state.secondDateStr)
                log("activeDateStr:", this.props.activeDateStr)
            })
            .then(() => {
                ApiMethodsUtils.getTodayMovieList(this.state.firstDateStr, this.state.secondDateStr)
                    .then(response => {
                        log("response.data:", response.data)
                        this.setState({movies: response.data});
                        this.setState({activeDateMovies: response.data[this.props.activeDateStr]});
                    })
                    .catch(error => log("ERROR:" + error))
            })
    }

    componentWillReceiveProps() {
        this.setState({activeDateMovies: this.state.movies[this.props.activeDateStr]});
    }

    showOneMovie(index, movieIdList) {
        if (index + 1 <= movieIdList.length) {
            return (
                <Movie movieId={movieIdList[index]} activeDateStr={this.props.activeDateStr}/>
            )
        }
    }

    showAllMovies() {
        let movieIdList = Object.keys(this.state.activeDateMovies)
        let rows_array = []
        for (let i = 0; i < Math.ceil(movieIdList.length / 3); i++) {
            rows_array.push(i)
        }

        if (movieIdList.length > 0) {
            return (
                rows_array.map(row => {
                        let baseIndex = 3 * row;
                        return (
                            <div className={css.movies_row}>
                                {this.showOneMovie(baseIndex, movieIdList)}
                                {this.showOneMovie(baseIndex + 1, movieIdList)}
                                {this.showOneMovie(baseIndex + 2, movieIdList)}
                            </div>
                        )
                    }
                )
            )
        }

        console.log("empty movies")
    }

    render() {
        return (
            <div onMouseMove={this.handleMouseMove}>
                <div>
                    <b>MyMovies. Coordinates X: {this.state.X} Y: {this.state.Y}</b>
                </div>
                {this.showAllMovies()}
            </div>
        );
    }
}

export default Movies;
