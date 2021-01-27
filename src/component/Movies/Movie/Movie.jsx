import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import css from "./Movie.module.css";
import GeneralUtils from "../../../scripts/GeneralUtils";


function log(...args) {
    GeneralUtils.log("Movie", ...args)
}

export class Movie extends Component {
    constructor(props) {
        super(props);

        this.goToSeances = this.goToSeances.bind(this);

        this.state = {
            img_index: this.getRandomImgIndex()
        }
    }

    getRandomImgIndex() {
        return Math.floor(Math.random() *
            Math.floor(window.moviesPictureDict[this.props.movieId]["img_names"].length)
        );
    }

    goToSeances() {
        this.props.history.push(
            `/seances/active_date=${this.props.activeDateStr}/movie_id=${this.props.movieId}`);
    }

    show_movie() {
        let oneMovieDict = window.moviesPictureDict[this.props.movieId]
        let img_path = oneMovieDict["img_prefix"] + oneMovieDict["img_names"][this.state.img_index]
        let movieName = oneMovieDict["name"]
        return (
            <div className={css.movie_wrapper}>
                <button className={css.movie_img_wrapper_button} onClick={this.goToSeances}>
                    <img className={css.movie_img} src={img_path}/>
                </button>
                <div className={css.movie_name_text}>{movieName}</div>
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