import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';

import DatePicker from 'react-datepicker';
import { Button, Divider, Form, Icon, Label } from 'semantic-ui-react';

import CalendarHeader from './CalendarHeader';
import { TIME_SLOTS } from '../../../appConfiguration';
import { getObservationTime } from '../../../utils/time';

const formStyle = {
    margin: '8px',
    maxWidth: '245px',
};

const presetButtonStyle = {
    display: 'block',
    margin: '2px',
    width: 'calc(100% - 4px)',
};

const observationTimeLabelStyle = {
    paddingLeft: '12px',
    paddingRight: '8px',
    cursor: 'default',
};

const isRangeValid = (from, to) => {
    return from.isSameOrBefore(to);
};

const isSameDate = (value, currentValue) => {
    return value.isSame(currentValue, 'day');
};

const getShiftedRange = (state, shiftFn) => {
    let diff;
    let from;
    let to;

    const { fromDate, toDate, maxDate } = state;

    const fromMonthStart = fromDate.clone().startOf('month');
    const toMonthEnd = fromDate.clone().endOf('month');

    if (isSameDate(fromDate, fromMonthStart) && isSameDate(toDate, toMonthEnd)) {
        diff = toDate.diff(fromDate, 'month') + 1;
        from = shiftFn.call(fromDate, diff, 'month').startOf('month');
        to = shiftFn.call(toDate, diff, 'month').endOf('month');

        if (maxDate.isSameOrBefore(to)) {
            to = maxDate.clone();
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

        const maxDate = moment(`00${props.timeZone}`, 'HHZ')
            .endOf('day')
            .subtract(1, 'days');

        this.state = {
            fromDate: props.from,
            toDate: props.to,
            maxDate,
            _nextDisabled: maxDate.isSameOrBefore(props.to),
        };

        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);

        this._setPrevious = this._setPrevious.bind(this);
        this._setNext = this._setNext.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { fromDate, toDate } = this.state;
        if (!fromDate || !toDate) {
            this.setState({
                fromDate: nextProps.from,
                toDate: nextProps.to,
                _nextDisabled: this._getNextDisabled(nextProps.to),
            });
        }

        const { timeSlot } = this.props;
        if (nextProps.timeSlot !== timeSlot) {
            this.setState({
                fromDate: nextProps.from,
            });
        }
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
            _nextDisabled: this._getNextDisabled(date),
        });

        if (callback) {
            const { fromDate } = this.state;
            callback(fromDate, date);
        }
    }

    _notifyRangeFix() {
        console.warn("To date can't be before from date.");
        const { notifyUser } = this.props;
        notifyUser({
            text: "'To date' can't be before 'from date'.",
            color: 'orange',
        });
    }

    /** **************************** preset options ************************************ */
    _getNextDisabled(to) {
        const { maxDate } = this.state;

        let nextDisabled = false;
        if (maxDate.isSameOrBefore(to)) {
            nextDisabled = true;
        }

        return nextDisabled;
    }

    _setPrevious(event) {
        event.target.blur();

        this.setState((prevState, props) => {
            const { callback, timeZone } = props;
            const { from, to } = getShiftedRange(prevState, moment.prototype.subtract, timeZone);

            if (callback) {
                callback(from, to);
            }

            return {
                fromDate: from,
                toDate: to,
                _nextDisabled: false,
            };
        });
    }

    _setNext(event) {
        event.target.blur();

        this.setState((prevState, props) => {
            const { callback, timeZone } = props;
            const shiftedRange = getShiftedRange(prevState, moment.prototype.add, timeZone);
            const { from } = shiftedRange;
            let { to } = shiftedRange;

            let nextDisabled = false;
            const { maxDate } = this.state;
            if (maxDate.isSameOrBefore(to)) {
                to = maxDate.clone();
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

    _setPreset(preset) {
        const { unit, subtract } = preset;
        const { callback, timeZone } = this.props;

        const now = moment(`00${timeZone}`, 'HHZ');
        const from = now
            .clone()
            .startOf(unit)
            .subtract(subtract, `${unit}s`);
        const to = now
            .clone()
            .endOf(unit)
            .subtract(subtract, `${unit}s`);

        if (callback) {
            callback(from, to);
        }

        this.setState({
            fromDate: from,
            toDate: to,
            _nextDisabled: this._getNextDisabled(to),
        });
    }
    /** **************************** preset options ************************************ */

    render() {
        const { fromDate, toDate, maxDate, _nextDisabled } = this.state;
        const { currentValues, loading, timeSlot } = this.props;
        const { from: currentFrom, to: currentTo, valueDuration } = currentValues;

        if (fromDate && toDate) {
            const timeSlotConfig = TIME_SLOTS[timeSlot];

            let presetGroups;
            if (timeSlotConfig) {
                ({ presetGroups } = timeSlotConfig);
            }

            let fromLabelColor = 'grey';
            if (currentFrom && fromDate.isBefore(currentFrom)) {
                fromLabelColor = 'red';
            }

            let toLabelColor = 'grey';
            if (
                currentTo &&
                currentTo.isBefore(
                    toDate
                        .clone()
                        .add(1, 'days')
                        .startOf('day')
                )
            ) {
                toLabelColor = 'red';
            }

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
                                {currentFrom && !loading && (
                                    <Label
                                        tag
                                        color={fromLabelColor}
                                        size="small"
                                        style={observationTimeLabelStyle}
                                        title="End of the first observation"
                                    >
                                        {getObservationTime(currentFrom, valueDuration).format(
                                            'L LT'
                                        )}
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
                                {currentTo && !loading && (
                                    <Label
                                        tag
                                        color={toLabelColor}
                                        size="small"
                                        style={observationTimeLabelStyle}
                                        title="End of the last observation"
                                    >
                                        {currentTo.format('L LT')}
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
                            <Button inverted icon color="teal" onClick={this._setPrevious}>
                                <Icon name="angle left" />
                            </Button>
                            <Button
                                inverted
                                icon
                                color="teal"
                                disabled={_nextDisabled}
                                onClick={this._setNext}
                            >
                                <Icon name="angle right" />
                            </Button>
                        </Button.Group>
                    </div>

                    <Form style={formStyle}>
                        {presetGroups &&
                            presetGroups.map((group, index) => {
                                const groupId = `group${index}`;
                                return (
                                    <div className="button-wrapper" key={groupId}>
                                        {group.map(preset => {
                                            return (
                                                <Button
                                                    className="preset-button"
                                                    key={preset.title}
                                                    inverted
                                                    size="mini"
                                                    color="teal"
                                                    onClick={e => this._setPreset(preset)}
                                                    style={presetButtonStyle}
                                                >
                                                    {preset.title}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
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

        return '';
    }
}

DateRangeSelector.defaultProps = {
    callback: null,
    from: null,
    to: null,
    timeSlot: null,
};

DateRangeSelector.propTypes = {
    from: momentPropTypes.momentObj,
    to: momentPropTypes.momentObj,
    timeSlot: PropTypes.string,
    timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    currentValues: PropTypes.shape({
        from: momentPropTypes.momentObj,
        to: momentPropTypes.momentObj,
        frequency: PropTypes.number,
        valueDuration: PropTypes.number,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
    callback: PropTypes.func,
    notifyUser: PropTypes.func.isRequired,
};

export default DateRangeSelector;
