import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import range from 'lodash/range';
import DatePicker from 'react-datepicker';
import { Button, Divider, Form, Icon, Label } from 'semantic-ui-react';
import {
    getEndOfPeriod,
    getStartOfPeriod,
    getLastPossibleObservationTime,
    getLastObservationTime,
} from '../utils/time';

const formStyle = {
    margin: '8px',
    maxWidth: '245px',
};

const presetButtonStyle = {
    display: 'block',
};

const years = range(2010, moment().year() + 1, 1);
const months = moment.months();

const CalendarHeader = ({
    date,
    changeMonth,
    changeYear,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
}) => {
    const prevMonthButtonClick = event => {
        decreaseMonth(event);
        event.target.blur();
    };

    const nextMonthButtonClick = event => {
        increaseMonth(event);
        event.target.blur();
    };

    const onMonthChange = ({ target }) => {
        const { value } = target;
        changeMonth(value);
        target.blur();
    };

    const onYearChange = ({ target }) => {
        const { value } = target;
        changeYear(value);
        target.blur();
    };

    return (
        <div
            style={{
                margin: '0 12px',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <button
                type="button"
                className="react-datepicker__navigation react-datepicker__navigation--previous"
                onClick={prevMonthButtonClick}
                disabled={prevMonthButtonDisabled}
                style={{
                    top: '14px',
                }}
            />
            <select
                value={months[date.month()]}
                onChange={onMonthChange}
                style={{
                    fontWeight: 'bold',
                    width: '92px',
                    padding: '.5em .5em',
                }}
            >
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
                    padding: '.5em .5em',
                }}
            >
                {years.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <button
                type="button"
                className="react-datepicker__navigation react-datepicker__navigation--next"
                onClick={nextMonthButtonClick}
                disabled={nextMonthButtonDisabled}
                style={{
                    top: '14px',
                }}
            />
        </div>
    );
};

CalendarHeader.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    changeMonth: PropTypes.func.isRequired,
    changeYear: PropTypes.func.isRequired,
    decreaseMonth: PropTypes.func.isRequired,
    increaseMonth: PropTypes.func.isRequired,
    prevMonthButtonDisabled: PropTypes.bool.isRequired,
    nextMonthButtonDisabled: PropTypes.bool.isRequired,
};

const isRangeValid = (from, to) => {
    return from.isSameOrBefore(to);
};

const isSameDate = (value, currentValue) => {
    return value.isSame(currentValue, 'day');
};

const getCurrentValueString = (value, currentValue) => {
    let result;
    if (currentValue && !value.isSame(currentValue, 'second')) {
        if (isSameDate(value, currentValue)) {
            result = currentValue.format('LT');
        } else {
            result = currentValue.format('L LT');
        }
    }

    return result;
};

const getShiftedRange = (state, shiftFn, timeZone) => {
    let diff;
    let from;
    let to;

    const { fromDate, toDate } = state;

    const fromMonthStart = getStartOfPeriod(fromDate.clone(), 'month', timeZone);
    const toMonthEnd = getEndOfPeriod(fromDate.clone, 'month', timeZone);

    if (isSameDate(fromDate, fromMonthStart) && isSameDate(toDate, toMonthEnd)) {
        diff = toDate.diff(fromDate, 'month') + 1;
        from = shiftFn.call(fromDate, diff, 'month').startOf('month');
        to = getEndOfPeriod(shiftFn.call(toDate, diff, 'month'), 'month', timeZone);

        const now = moment();
        if (now.isBefore(to)) {
            to = getEndOfPeriod(now, 'day', timeZone);
        }
    } else {
        diff = toDate.diff(fromDate, 'days') + 1;
        from = shiftFn.call(fromDate, diff, 'days');
        to = shiftFn.call(toDate, diff, 'days');
    }
    return {
        from,
        to,
    };
};

class DateRangeSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fromDate: props.from,
            toDate: props.to,
            _nextDisabled: false,
        };

        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);

        this._setPrevious = this._setPrevious.bind(this);
        this._setNext = this._setNext.bind(this);

        this._setLastMonth = this._setLastMonth.bind(this);
        this._setLastWeek = this._setLastWeek.bind(this);
        this._setThisMonth = this._setThisMonth.bind(this);
        this._setThisWeek = this._setThisWeek.bind(this);
    }

    handleFromChange(date) {
        const { timeZone, callback } = this.props;
        date.utcOffset(timeZone);

        this.setState({
            fromDate: date,
        });

        const { toDate } = this.state;
        if (callback && isRangeValid(date, toDate)) {
            callback(date, toDate);
        }

        if (!isRangeValid(date, toDate)) {
            this._notifyRangeFix();
            this.setState({
                toDate: date,
            });

            if (callback) {
                callback(date, date);
            }
        }
    }

    handleToChange(date) {
        const { timeZone, callback } = this.props;
        date.utcOffset(timeZone);

        this.setState({
            toDate: date,
        });

        if (callback) {
            const { fromDate } = this.state;
            callback(fromDate, date);
        }
    }

    _notifyRangeFix() {
        console.log("To date can't be before from date.");
        const { notifyUser } = this.props;
        notifyUser({
            text: "'To date' can't be before 'from date'.",
            color: 'orange',
        });
    }

    /** **************************** preset options ************************************ */
    _setPrevious() {
        this.setState((prevState, props) => {
            const { callback, timeZone } = props;
            const { from, to } = getShiftedRange(prevState, moment.prototype.subtract, timeZone);

            if (callback) {
                callback(from, to);
            }

            return {
                fromDate: from,
                toDate: to,
            };
        });
    }

    _setNext() {
        this.setState((prevState, props) => {
            const { callback, timeZone } = props;
            const shiftedRange = getShiftedRange(prevState, moment.prototype.add, timeZone);
            const { from } = shiftedRange;
            let { to } = shiftedRange;

            let nextDisabled = false;
            if (moment().isBefore(to)) {
                to = getEndOfPeriod(moment(), 'day', timeZone);
                nextDisabled = true;
            }

            if (callback) {
                callback(from, to);
            }

            return {
                fromDate: from,
                toDate: to,
                _nextDisabled: nextDisabled,
            };
        });
    }

    _setThisWeek() {
        const { timeZone } = this.props;
        const now = moment();
        const from = getStartOfPeriod(now.clone(), 'week', timeZone);
        const to = getEndOfPeriod(now.clone(), 'week', timeZone);
        const { callback } = this.props;

        if (callback) {
            callback(from, to);
        }

        this.setState({
            fromDate: from,
            toDate: to,
            _nextDisabled: true,
        });
    }

    _setLastWeek() {
        const { timeZone } = this.props;
        const now = moment();
        const from = getStartOfPeriod(now.clone(), 'week', timeZone).subtract(1, 'weeks');
        const to = getEndOfPeriod(now.clone(), 'week', timeZone).subtract(1, 'weeks');
        const { callback } = this.props;

        if (callback) {
            callback(from, to);
        }

        this.setState({
            fromDate: from,
            toDate: to,
            _nextDisabled: false,
        });
    }

    _setThisMonth() {
        const { timeZone } = this.props;
        const now = moment();
        const from = getStartOfPeriod(now.clone(), 'month', timeZone);
        const to = getEndOfPeriod(now.clone(), 'month', timeZone);
        const { callback } = this.props;

        if (callback) {
            callback(from, to);
        }

        this.setState({
            fromDate: from,
            toDate: to,
            _nextDisabled: true,
        });
    }

    _setLastMonth() {
        const { callback, timeZone } = this.props;

        const now = moment();
        const from = getStartOfPeriod(now.clone(), 'month', timeZone).subtract(1, 'months');
        const to = getEndOfPeriod(now.clone(), 'month', timeZone).subtract(1, 'months');

        if (callback) {
            callback(from, to);
        }

        this.setState({
            fromDate: from,
            toDate: to,
            _nextDisabled: false,
        });
    }
    /** **************************** preset options ************************************ */

    render() {
        const { fromDate, toDate, _nextDisabled } = this.state;
        const { currentValues, loading, timeZone } = this.props;
        const { from: currentFrom, to: currentTo, frequency } = currentValues;
        const from = getCurrentValueString(fromDate, currentFrom);

        let to;
        if (currentTo) {
            const lastPossibleObservation = getLastPossibleObservationTime(
                toDate,
                frequency,
                timeZone
            );
            const lastObservation = getLastObservationTime(currentTo, frequency, timeZone);
            to = getCurrentValueString(lastPossibleObservation, lastObservation);
        }

        const maxDate = getEndOfPeriod(moment(), 'day', timeZone).subtract(1, 'days');

        return (
            <div className="main" style={{ position: 'relative' }}>
                <Divider horizontal inverted style={{ marginTop: '18px' }}>
                    Select date
                </Divider>

                <Form className="date-picker-wrapper column left">
                    <Form.Field className="date-picker-field from">
                        <div className="date-picker-input-labels-wrapper">
                            <Label size="small" style={{ marginTop: '2px' }}>
                                From date
                            </Label>
                            {from && !loading && (
                                <Label basic color="red" pointing="left" size="small">
                                    {from}
                                </Label>
                            )}
                        </div>
                        <div className="date-picker-input-wrapper">
                            <DatePicker
                                selectsStart
                                selected={fromDate}
                                startDate={fromDate}
                                endDate={toDate}
                                maxDate={maxDate}
                                renderCustomHeader={CalendarHeader}
                                previousMonthButtonLabel=""
                                nextMonthButtonLabel=""
                                style={{ width: '105px' }}
                                onChange={this.handleFromChange}
                            />
                        </div>
                    </Form.Field>

                    <Form.Field className="date-picker-field to">
                        <div className="date-picker-input-labels-wrapper">
                            <Label size="small" style={{ marginTop: '2px' }}>
                                To date
                            </Label>
                            {to && !loading && (
                                <Label basic color="red" pointing="left" size="small">
                                    {to}
                                </Label>
                            )}
                        </div>
                        <div className="date-picker-input-wrapper">
                            <DatePicker
                                selectsEnd
                                selected={toDate}
                                startDate={fromDate}
                                endDate={toDate}
                                minDate={fromDate}
                                maxDate={maxDate}
                                renderCustomHeader={CalendarHeader}
                                previousMonthButtonLabel=""
                                nextMonthButtonLabel=""
                                style={{ width: '105px' }}
                                onChange={this.handleToChange}
                            />
                        </div>
                    </Form.Field>
                </Form>

                <div className="column right">
                    <Button.Group>
                        <Button inverted icon color="blue" onClick={this._setPrevious}>
                            <Icon name="caret left" />
                        </Button>
                        <Button
                            inverted
                            icon
                            color="blue"
                            disabled={_nextDisabled}
                            onClick={this._setNext}
                        >
                            <Icon name="caret right" />
                        </Button>
                    </Button.Group>
                </div>

                <Form style={formStyle}>
                    <div className="button-wrapper">
                        <Button
                            className="preset-button"
                            inverted
                            size="mini"
                            color="blue"
                            onClick={this._setThisWeek}
                            style={presetButtonStyle}
                        >
                            This Week
                        </Button>
                        <Button
                            className="preset-button"
                            inverted
                            size="mini"
                            color="blue"
                            onClick={this._setLastWeek}
                            style={presetButtonStyle}
                        >
                            Last Week
                        </Button>
                    </div>
                    <div className="button-wrapper">
                        <Button
                            className="preset-button"
                            inverted
                            size="mini"
                            color="blue"
                            onClick={this._setThisMonth}
                            style={presetButtonStyle}
                        >
                            This Month
                        </Button>
                        <Button
                            inverted
                            size="mini"
                            color="blue"
                            onClick={this._setLastMonth}
                            style={presetButtonStyle}
                        >
                            Last Month
                        </Button>
                    </div>
                </Form>

                <Divider horizontal inverted style={{ marginTop: '8px' }} />

                <style jsx>
                    {`
                        .button-wrapper {
                            display: inline-block;
                        }
                    `}
                </style>
            </div>
        );
    }
}

DateRangeSelector.defaultProps = {
    callback: null,
};

DateRangeSelector.propTypes = {
    from: momentPropTypes.momentObj.isRequired,
    to: momentPropTypes.momentObj.isRequired,
    timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    currentValues: PropTypes.shape({
        from: momentPropTypes.momentObj,
        to: momentPropTypes.momentObj,
        frequency: PropTypes.number,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
    callback: PropTypes.func,
    notifyUser: PropTypes.func.isRequired,
};

export default DateRangeSelector;
