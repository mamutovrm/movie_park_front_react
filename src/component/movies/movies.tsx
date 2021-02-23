import React, {Component, MouseEvent} from 'react';
import ApiMethodsUtils, {MovieInfo} from '../../scripts/api-methods'
import GeneralUtils from "../../scripts/general-utils";
import css from './movies.module.css'
import Movie from "./movie/movie";

function log(...args: any[]) {
    GeneralUtils.log("Movies", ...args)
}

interface IMoviesProps {
    activeDateStr: string
}

interface IMoviesState {
    X: number
    Y: number
    firstDateStr: string
    secondDateStr: string
    seanceInfo: Object
    movieByDateMap: Map<string, Map<number, string>>
    movieIdSet: Set<number>
    activeDateMovies: Map<number, string>
    movieInfoDict: Map<number, MovieInfo>
}

export class Movies extends Component<IMoviesProps, IMoviesState> {
    constructor(props: IMoviesProps) {
        super(props);

        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.state = {
            X: 0,
            Y: 0,
            firstDateStr: '',
            secondDateStr: '',
            seanceInfo: NaN,
            movieByDateMap: new Map<string, Map<number, string>>(),
            movieIdSet: new Set<number>(),
            activeDateMovies: new Map<number, string>(),
            movieInfoDict: new Map<number, MovieInfo>()
        }
    }

    handleMouseMove(event: MouseEvent) {
        this.setState({
            X: event.clientX,
            Y: event.clientY
        });
    }

    componentWillMount() {
        GeneralUtils.stringToDatePromise(this.props.activeDateStr)
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
                return ApiMethodsUtils.getMovieListByPeriod(this.state.firstDateStr, this.state.secondDateStr)
                    .then(response => {
                        this.setState({movieByDateMap: response});
                        this.setState({activeDateMovies:
                                response.get(this.props.activeDateStr) as Map<number, string>});
                    })
            })
            .then(() => {
                const movieIdSet = new Set<number>()
                this.state.movieByDateMap.forEach((movieMap, date) => {
                    log("date", date, "movieMap", movieMap)
                    Object.keys(movieMap).forEach(movieId => {
                        movieIdSet.add(parseInt(movieId));
                    })
                })
                this.setState({movieIdSet: movieIdSet})
                log("movieId set:", movieIdSet)
                return movieIdSet
            })
            .then((movieIdSet) => {
                log("hello")
                return ApiMethodsUtils.getAllMoviesByIdSet(movieIdSet)
            })
            .then(movieInfoDict => {
                log("movieInfoDict", movieInfoDict)
                this.setState({movieInfoDict: movieInfoDict})
            })
    }

    componentWillReceiveProps() {
        this.setState({activeDateMovies:
                this.state.movieByDateMap.get(this.props.activeDateStr) as Map<number, string>});
    }

    showOneMovie(index: number, movieIdList: string[]) {
        if (index + 1 <= movieIdList.length) {
            let movieInfo = this.state.movieInfoDict.get(parseInt(movieIdList[index]))
            if (movieInfo === undefined) {
                return (
                    <h3>Данные ещё не прогрузились</h3>
                )
            } else {
                return (
                    <Movie movieInfo={movieInfo} activeDateStr={this.props.activeDateStr}/>
                )
            }
        }
    }

    showAllMovies() {
        if (this.state.activeDateMovies === undefined) {
            return (
                <div>
                    <h3>Список фильмов пуст. Возможно, проблема в backend части.</h3>
                </div>
            )
        }
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
