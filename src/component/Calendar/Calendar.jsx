import React, {Component} from 'react';
import GeneralUtils from "../../scripts/GeneralUtils";

function log(...args) {
    GeneralUtils.log("Calendar", ...args)
}

export class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCalendarMenu: false,
            activeDateList: this.props.activeDateList
        }
    }

    changeState() {
        let value = true;
        if (this.state.showCalendarMenu === true) {
            value = false;
        }
        log(`this.state.showCalendarMenu from:${this.state.showCalendarMenu}\tto:${value}`)
        this.setState({showCalendarMenu: value});
    }

    setActiveDate(_activeDate) {
        log("hide calendarMenu and setActiveDate", _activeDate)
        this.setState({showCalendarMenu: false});
        this.props.setActiveDate(_activeDate)
    }

    showCalendarMenu() {
        if (this.state.showCalendarMenu === true) {
            return (
                this.state.activeDateList.map(date => {
                    return (
                        <div>
                            <button className='btn btn-success menu-item'
                                    onClick={this.setActiveDate.bind(this, date)}>
                                {date}
                            </button>
                        </div>
                    )
                })
            )
        }
    }

    render() {
        return (
            <div>
                <button type="button" className="btn btn-success"
                        onClick={this.changeState.bind(this)}>
                    {this.props.activeDate}
                </button>
                <div className='menu'>
                    {this.showCalendarMenu()}
                </div>
            </div>
        )
    }
}

export default Calendar;