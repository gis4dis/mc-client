import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { Button, Form, Input, Label} from 'semantic-ui-react';

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
        this.setState({
            fromDate: date
        });

        this._validateRange(date);

        if (this.props.callback) {
            this.props.callback(this.state.fromDate, this.state.toDate);
        }
    }

    handleToChange(date) {
        this.setState({
            toDate: date
        });

        if (this.props.callback) {
            this.props.callback(this.state.fromDate, this.state.toDate);
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
        return moment(value).isSame(currentValue, 'day');
    }

    _getCurrentValueString(value, currentValue) {
        let result;
        if (!moment(value).isSame(currentValue, 'second')) {
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
            <Form>
                <Form.Field>
                    <Label size='small'>From date</Label>
                    { from  && <Label basic color='red' pointing='left' size='small'>{ from }</Label> }
                    <DatePicker
                            selected={ this.state.fromDate }
                            onChange={ this.handleFromChange } />
                </Form.Field>
                <Form.Field>
                    <Label size='small'>To date</Label>
                    { to  && <Label basic color='red' pointing='left' size='small'>{ to }</Label> }
                    <DatePicker
                            selected={ this.state.toDate }
                            minDate={ this.state.fromDate }
                            onChange={ this.handleToChange } />
                </Form.Field>
            </Form>
        </div>
    }

};

export default DateRangeSelector;