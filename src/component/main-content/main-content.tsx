import React, {Component} from 'react';
import css from './main-content.module.css';
import Movies from "../movies/movies";
import GeneralUtils from "../../scripts/general-utils";
import Calendar from "../calendar/calendar";
import {RouteComponentProps} from "react-router-dom";

function log(...args: any[]) {
    GeneralUtils.log("MainContent", ...args)
}

interface IMainContentProps extends RouteComponentProps<any> {
    location: any;
}

interface IMainContentState {
    X: number;
    Y: number;
    activeDate: string;
    activeDateList: string[]
}

export class MainContent extends Component<IMainContentProps, IMainContentState> {
    constructor(props: IMainContentProps) {
        super(props);

        this.setActiveDate = this.setActiveDate.bind(this)

        this.state = {
            X: 0,
            Y: 0,
            activeDate: this.props.match != null
                ? this.props.match.params.activeDate
                : GeneralUtils.dateToString(new Date()),
            activeDateList: []
        }
    }

    componentWillMount() {
        let activeDate = GeneralUtils.stringToDate(this.state.activeDate)
        for (let i = 0; i <= 7; i++) {
            let currDate = new Date(activeDate.getTime())
            currDate.setDate(currDate.getDate() + i)
            this.state.activeDateList.push(GeneralUtils.dateToString(currDate));
        }
    }

    handleMouseMove(event: any) {
        this.setState({
            X: event.clientX,
            Y: event.clientY
        });
    }

    setActiveDate(_activeDate: string) {
        log("setActiveDate", _activeDate)
        this.setState({activeDate: _activeDate})
        this.forceUpdate()
    }

    showCalendar() {
        return (
            <Calendar setActiveDate={this.setActiveDate.bind(this)}
                      activeDate={this.state.activeDate}
                      activeDateList={this.state.activeDateList}/>
        )
    }

    showContent() {
        if (this.state.activeDate === undefined) {
            return null;
        }

        log(`RENDER MOVIES for ${this.state.activeDate}`)
        return (
            <Movies activeDateStr={this.state.activeDate}/>
        )
    }

    render() {
        return (
            <div className={css.content} onMouseMove={this.handleMouseMove.bind(this)}>
                {this.showCalendar()}
                <br/>
                <b>MyMainContent. Coordinates X: {this.state.X} Y: {this.state.Y}</b>
                {this.showContent()}
            </div>
        )
    }
}

export default MainContent;