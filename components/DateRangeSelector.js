import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { Button, Form, Input, Label } from 'semantic-ui-react';

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
            <Form style={ formStyle }>
                <Form.Field>
                    <Label size='small'>From date</Label>
                    <DatePicker
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
        </div>
    }

};

export default DateRangeSelector;