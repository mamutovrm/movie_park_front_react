import React, {Component} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom'
import css from "./movie.module.css";
import GeneralUtils from "../../../scripts/general-utils";
import {moviesPictureDict} from "../../../scripts/constants";

function log(...args: any[]) {
    GeneralUtils.log("Movie", ...args)
}

interface IMovieProps extends RouteComponentProps<any> {
    movieId: number,
    activeDateStr: string,
    history: any
}

interface IMovieState {
    imgIndex: number
}

export class Movie extends Component<IMovieProps, IMovieState> {
    constructor(props: IMovieProps) {
        super(props);

        this.goToSeances = this.goToSeances.bind(this);

        this.state = {
            imgIndex: this.getRandomImgIndex()
        }
    }

    getRandomImgIndex() {
        return Math.floor(Math.random() *
            Math.floor(moviesPictureDict[this.props.movieId].imgNames.length)
        );
    }

    goToSeances() {
        this.props.history.push(
            `/seances/active_date=${this.props.activeDateStr}/movie_id=${this.props.movieId}`);
    }

    show_movie() {
        let moviePictureDict = moviesPictureDict[this.props.movieId]
        let img_path = moviePictureDict.imgPrefix + moviePictureDict.imgNames[this.state.imgIndex]
        return (
            <div className={css.movie_wrapper}>
                <button className={css.movie_img_wrapper_button} onClick={this.goToSeances}>
                    <img className={css.movie_img} src={img_path}/>
                </button>
                <div className={css.movie_name_text}>{moviePictureDict.name}</div>
            </div>
        )
    }

    render() {
        return (
            this.show_movie()
        )
    }
}

export default withRouter(Movie);