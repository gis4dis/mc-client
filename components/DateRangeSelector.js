import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { Button, Divider, Form, Input, Label } from 'semantic-ui-react';

const formStyle = {
    margin: '8px',
    maxWidth: '245px'
};


class DateRangeSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fromDate: props.from,
            toDate: props.to
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

    _setPrevious() {
        this.setState((prevState, props) => {
            let diff = prevState.toDate.diff(prevState.fromDate, 'days');
            let from = prevState.fromDate.subtract(diff, 'days');
            let to = prevState.toDate.subtract(diff, 'days');

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
            let diff = prevState.toDate.diff(prevState.fromDate, 'days');
            let from = prevState.fromDate.add(diff, 'days');
            let to = prevState.toDate.add(diff, 'days');

            if (this.props.callback) {
                this.props.callback(from, to);
            }

            return {
                fromDate: from,
                toDate: to
            };
        });
    }

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


        return <div>
            <Divider horizontal inverted style={ {marginTop: '10px'} }>Select date</Divider>
            <Form style={ formStyle }>
                <Form.Field>
                    <Label size='small'>From date</Label>
                    <DatePicker
                        selectsStart
                        selected={ this.state.fromDate }
                        previousMonthButtonLabel=''
                        nextMonthButtonLabel=''
                        maxDate={ moment() }
                        onChange={ this.handleFromChange } />
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
                            minDate={ this.state.fromDate }
                            maxDate={ moment() }
                            previousMonthButtonLabel=''
                            nextMonthButtonLabel=''
                            onChange={ this.handleToChange } />
                    { to  && <Label attached='bottom right' basic color='red' pointing='left' size='small'>
                        { to }</Label> }
                </Form.Field>
            </Form>
            <Form style={ formStyle }>
                <Form.Field>
                    <Button
                        inverted
                        color="blue"
                        onClick={ this._setPrevious.bind(this) }>
                        Previous
                    </Button>
                    <Button
                        inverted
                        color="blue"
                        onClick={ this._setNext.bind(this) }>
                        Next
                    </Button>
                </Form.Field>
            </Form>
        </div>
    }

};

export default DateRangeSelector;