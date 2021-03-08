import React, {Component, MouseEvent} from 'react';
import {MovieInfo, getMovieListByPeriod, getAllMoviesByIdSet} from '../../scripts/api-methods'
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

    async componentWillMount() {
        this.setState({firstDateStr: this.props.activeDateStr});
        const activeDate = GeneralUtils.stringToDate(this.props.activeDateStr)
        let secondDate = new Date(activeDate.getTime());
        secondDate.setDate(secondDate.getDate() + 7)
        this.setState({secondDateStr: await GeneralUtils.dateToStringPromise(secondDate)});
        log(`firstDateStr: ${this.state.firstDateStr} secondDateStr ${this.state.secondDateStr} activeDateStr ${this.props.activeDateStr}`)

        const movieByDateMap: Map<string, Map<number, string>> =
            await getMovieListByPeriod(this.state.firstDateStr, this.state.secondDateStr)
        this.setState({movieByDateMap: movieByDateMap});
        this.setState({
            activeDateMovies: movieByDateMap.get(this.props.activeDateStr) as Map<number, string>
        })

        const movieIdSet = new Set<number>()
        this.state.movieByDateMap.forEach((movieMap, date) => {
            log("date", date, "movieMap", movieMap)
            Object.keys(movieMap).forEach(movieId => {
                movieIdSet.add(parseInt(movieId));
            })
        })

        this.setState({movieIdSet: movieIdSet})
        log("movieId set:", movieIdSet)

        const movieInfoDict = await getAllMoviesByIdSet(movieIdSet)
        log("movieInfoDict", movieInfoDict)
        this.setState({movieInfoDict: movieInfoDict})
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
