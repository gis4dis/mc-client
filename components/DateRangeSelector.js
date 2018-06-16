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

        this._validateRange(date);

        if (this.props.callback) {
            this.props.callback(date, this.state.toDate);
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

    _validateRange(date) {
        let to = this.state.toDate;

        if (to.isBefore(date)) {
            console.log('To date can\'t be before from date.');
            this.setState({
                toDate: date
            });
        }
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
        let to = this._getCurrentValueString(this.state.toDate, this.props.currentValues.to);

        return <div>
            <Form style={ formStyle }>
                <Form.Field>
                    <Label size='small'>From date</Label>
                    <DatePicker
                        selected={ this.state.fromDate }
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
                            onChange={ this.handleToChange } />
                    { to  && <Label attached='bottom right' basic color='red' pointing='left' size='small'>
                        { to }</Label> }
                </Form.Field>
            </Form>
        </div>
    }

};

export default DateRangeSelector;