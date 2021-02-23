import React, {Component} from 'react';
import GeneralUtils from "../../scripts/general-utils";

function log(...args: any[]) {
    GeneralUtils.log("Calendar", ...args)
}

interface ICalendarProps {
    setActiveDate: Function
    activeDate: string,
    activeDateList: string[]
}

interface ICalendarState {
    showCalendarMenu: boolean,
    activeDateList: string[]
}

export class Calendar extends Component<ICalendarProps, ICalendarState> {
    constructor(props: ICalendarProps) {
        super(props);

        this.changeState = this.changeState.bind(this)

        this.state = {
            showCalendarMenu: false,
            activeDateList: this.props.activeDateList
        }
    }

    changeState() {
        let value = true;
        if (this.state.showCalendarMenu) {
            value = false;
        }
        log(`this.state.showCalendarMenu from:${this.state.showCalendarMenu}\tto:${value}`)
        this.setState({showCalendarMenu: value});
    }

    setActiveDate(_activeDate: string) {
        log("hide calendarMenu and setActiveDate", _activeDate)
        this.setState({showCalendarMenu: false});
        this.props.setActiveDate(_activeDate)
    }

    showCalendarMenu() {
        if (this.state.showCalendarMenu) {
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
                <button type="button" className="btn btn-success" onClick={this.changeState}>
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