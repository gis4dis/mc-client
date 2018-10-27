import React from 'react';
import moment from 'moment';
import range from 'lodash/range';
import DatePicker from 'react-datepicker';
import { Button, Divider, Form, Icon, Input, Label, Segment } from 'semantic-ui-react';

const formStyle = {
    margin: '8px',
    maxWidth: '245px'
};

const presetButtonStyle = {
    display: 'block'
};

const years = range(2000, moment().year() + 1, 1);
const months = moment.months();

class DateRangeSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fromDate: props.from,
            toDate: props.to,
            _nextDisabled: false
        };

        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }

    handleFromChange(date) {
        date.utcOffset(this.props.timeZone);

        this.setState({
            fromDate: date
        });

        let to = this.state.toDate;
        if (this.props.callback && this._isRangeValid(date, to)) {
            this.props.callback(date, this.state.toDate);
        }

        if (!this._isRangeValid(date, to)) {
            this._notifyRangeFix();
            this.setState({
                toDate: date
            });

            if (this.props.callback) {
                this.props.callback(date, date);
            }
        }
    }

    handleToChange(date) {
        date.utcOffset(this.props.timeZone);

        this.setState({
            toDate: date
        });

        if (this.props.callback) {
            this.props.callback(this.state.fromDate, date);
        }
    }

    _isRangeValid(from, to) {
        return from.isSameOrBefore(to);
    }

    _notifyRangeFix() {
        console.log('To date can\'t be before from date.');
        this.props.notifyUser({
            text: '\'To date\' can\'t be before \'from date\'.',
            color: 'orange'
        });
    }

    /****************************** preset options *************************************/
    _getShiftedRange(state, shiftFn) {
        let diff;
        let from;
        let to;
        let fromMonthStart = state.fromDate.clone().startOf('month');
        let toMonthEnd = state.fromDate.clone().startOf('day').endOf('month');

        if (this._isSameDate(state.fromDate, fromMonthStart) &&
                this._isSameDate(state.toDate, toMonthEnd)) {
            diff = state.toDate.diff(state.fromDate, 'month') + 1;
            from = shiftFn.call(state.fromDate, diff, 'month').startOf('month');
            to = shiftFn.call(state.toDate, diff, 'month').endOf('month');
            if (moment().isBefore(to)) {
                to = moment();
            }
        } else {
            diff = state.toDate.diff(state.fromDate, 'days') + 1;
            from = shiftFn.call(state.fromDate, diff, 'days');
            to = shiftFn.call(state.toDate, diff, 'days');
        }
        return {
            from: from,
            to: to
        };
    }

    _setPrevious() {
        this.setState((prevState, props) => {
            let {from, to} = this._getShiftedRange(prevState, moment.prototype.subtract);

            if (this.props.callback) {
                this.props.callback(from, to);
            }

            return {
                fromDate: from,
                toDate: to
            };
        });
    }

    _setNext() {
        this.setState((prevState, props) => {
            let {from, to} = this._getShiftedRange(prevState, moment.prototype.add);

            let nextDisabled = false;
            if (moment().isBefore(to)) {
                to = moment();
                nextDisabled = true;
            }

            if (this.props.callback) {
                this.props.callback(from, to);
            }

            return {
                fromDate: from,
                toDate: to,
                _nextDisabled: nextDisabled
            };
        });
    }

    _setThisWeek() {
        let today = moment();
        let from = today.clone().startOf('week');
        let to = today;

        if (this.props.callback) {
            this.props.callback(from, to);
        }

        this.setState({
            fromDate: from,
            toDate: today,
            _nextDisabled: true
        });
    }

    _setLastWeek() {
        let today = moment();
        let from = today.clone().startOf('week').subtract(1, 'week');
        let to = today.clone().endOf('week').subtract(1, 'week');

        if (this.props.callback) {
            this.props.callback(from, to);
        }

        this.setState({
            fromDate: from,
            toDate: to,
            _nextDisabled: false
        });
    }

    _setThisMonth() {
        let today = moment();
        let from = today.clone().startOf('month');
        let to = today;

        if (this.props.callback) {
            this.props.callback(from, to);
        }

        this.setState({
            fromDate: from,
            toDate: today,
            _nextDisabled: true
        });
    }

    _setLastMonth() {
        let today = moment();
        let from = today.clone().startOf('month').subtract(1, 'month');
        let to = today.clone().endOf('month').subtract(1, 'month');

        if (this.props.callback) {
            this.props.callback(from, to);
        }

        this.setState({
            fromDate: from,
            toDate: to,
            _nextDisabled: false
        });
    }
    /****************************** preset options *************************************/

    _isSameDate(value, currentValue) {
        return value.isSame(currentValue, 'day');
    }

    _getCurrentValueString(value, currentValue) {
        let result;
        if (currentValue && !value.isSame(currentValue, 'second')) {
            if (this._isSameDate(value, currentValue)) {
                result = currentValue.format('LT');
            } else {
                result = currentValue.format('L LT');
            }
        }

        return result;
    }

    _renderCalendarHeader({
         date,
         changeYear,
         changeMonth,
         decreaseMonth,
         increaseMonth,
         prevMonthButtonDisabled,
         nextMonthButtonDisabled
    }) {
        let prevMonthButtonClick = (event) => {
            decreaseMonth(event);
            event.target.blur();
        };

        let nextMonthButtonClick = (event) => {
            increaseMonth(event);
            event.target.blur();
        };

        let onMonthChange = ({target}) => {
            let value = target.value;
            changeMonth(value);
            target.blur();
        };

        let onYearChange = ({target}) => {
            let value = target.value;
            changeYear(value);
            target.blur();
        };

        return <div
            style={{
                margin: '0 12px',
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <button
                className="react-datepicker__navigation react-datepicker__navigation--previous"
                onClick={prevMonthButtonClick}
                disabled={prevMonthButtonDisabled}
                style={{
                    top: '14px'
                }}></button>
            <select
                value={months[date.month()]}
                onChange={onMonthChange}
                style={{
                    fontWeight: 'bold',
                    width: '92px',
                    padding: '.5em .5em'
                }}>
                {months.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <select
                value={date.year()}
                onChange={onYearChange}
                style={{
                    fontWeight: 'bold',
                    width: '60px',
                    padding: '.5em .5em'
                }}>
                {years.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <button
                className="react-datepicker__navigation react-datepicker__navigation--next"
                onClick={nextMonthButtonClick}
                disabled={nextMonthButtonDisabled}
                style={{
                    top: '14px'
                }}></button>
        </div>
    }

    render() {
        let from = this._getCurrentValueString(this.state.fromDate, this.props.currentValues.from);

        let to;
        if (this.props.currentValues.to) {
            let lastPossibleMeasurement = this.state.toDate.clone().add(1, 'days').
            subtract(this.props.currentValues.frequency, 'seconds');
            let lastMeasurement = this.props.currentValues.to.clone().
            subtract(this.props.currentValues.frequency, 'seconds');
            to = this._getCurrentValueString(lastPossibleMeasurement, lastMeasurement);
        }


        return <div style={ {position: "relative"} }>
            <Divider horizontal inverted style={ {marginTop: '18px'} }>Select date</Divider>

            <div style={ {position: 'absolute', right: 0, zIndex: 1} }>
                <Button.Group>
                    <Button
                            inverted
                            icon
                            color="blue"
                            onClick={ this._setPrevious.bind(this) }>
                        <Icon name="caret left"></Icon>
                    </Button>
                    <Button
                            inverted
                            icon
                            color="blue"
                            disabled={ this.state._nextDisabled }
                            onClick={ this._setNext.bind(this) }>
                        <Icon name="caret right"></Icon>
                    </Button>
                </Button.Group>
            </div>

            <Form style={ formStyle }>
                <Form.Field>
                    <Label size='small'>From date</Label>
                    <DatePicker
                        selectsStart
                        selected={ this.state.fromDate }
                        startDate={ this.state.fromDate }
                        endDate={ this.state.toDate }
                        maxDate={ moment() }
                        renderCustomHeader={ this._renderCalendarHeader }
                        previousMonthButtonLabel=''
                        nextMonthButtonLabel=''
                        onChange={ this.handleFromChange }
                        />
                    { from  && <Label attached='bottom right' basic color='red' pointing='left' size='small'>
                        { from }</Label> }
                </Form.Field>
            </Form>
            <Form style={ formStyle }>
                <Form.Field>
                    <Label size='small'>To date</Label>
                    <DatePicker
                            selectsEnd
                            selected={ this.state.toDate }
                            startDate={this.state.fromDate}
                            endDate={ this.state.toDate }
                            minDate={ this.state.fromDate }
                            maxDate={ moment() }
                            renderCustomHeader={ this._renderCalendarHeader }
                            previousMonthButtonLabel=''
                            nextMonthButtonLabel=''
                            onChange={ this.handleToChange } />
                    { to  && <Label attached='bottom right' basic color='red' pointing='left' size='small'>
                        { to }</Label> }
                </Form.Field>
            </Form>

            <Form style={ formStyle }>
                <div className="button-wrapper">
                    <Button
                        className="preset-button"
                        inverted
                        size="mini"
                        color="blue"
                        onClick={ this._setThisWeek.bind(this) }
                        style={ presetButtonStyle }>
                        This Week
                    </Button>
                    <Button
                        className="preset-button"
                        inverted
                        size="mini"
                        color="blue"
                        onClick={ this._setLastWeek.bind(this) }
                        style={ presetButtonStyle }>
                        Last Week
                    </Button>
                </div>
                <div className="button-wrapper">
                    <Button
                        className="preset-button"
                        inverted
                        size="mini"
                        color="blue"
                        onClick={ this._setThisMonth.bind(this) }
                        style={ presetButtonStyle }>
                        This Month
                    </Button>
                    <Button
                        inverted
                        size="mini"
                        color="blue"
                        onClick={ this._setLastMonth.bind(this) }
                        style={ presetButtonStyle }>
                        Last Month
                    </Button>
                </div>
            </Form>

            <Divider horizontal inverted style={ {marginTop: '8px'} }/>

            <style jsx>{`
                .button-wrapper {
                    display: inline-block;
                }

             `}</style>
        </div>
    }

};

export default DateRangeSelector;