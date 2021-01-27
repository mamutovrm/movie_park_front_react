import React, {Component} from 'react';
import css from './MainContent.module.css';
import Movies from "../Movies/Movies";
import GeneralUtils from "../../scripts/GeneralUtils";
import Calendar from "../Calendar/Calendar";

function log(...args) {
    GeneralUtils.log("MainContent", ...args)
}

export class MainContent extends Component {
    constructor(props) {
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

        this.initCalendarDict()
    }

    initCalendarDict() {
        let activeDate = GeneralUtils.stringToDate(this.state.activeDate, "YYYY-MM-DD", "-")
        for (let i = 0; i <= 7; i++) {
            let currDate = new Date(activeDate.getTime())
            currDate.setDate(currDate.getDate() + i)
            this.setState({activeDateList:
                    this.state.activeDateList.push(GeneralUtils.dateToString(currDate))
            })
        }
    }

    handleMouseMove(event) {
        this.setState({
            X: event.clientX,
            Y: event.clientY
        });
    }

    setActiveDate(_activeDate) {
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