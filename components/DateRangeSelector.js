import React from 'react';
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

    render() {
        return <div>
            <Form>
                <Form.Field>
                    <Label size='small'>From date</Label>
                    <DatePicker
                            selected={ this.state.fromDate }
                            onChange={ this.handleFromChange } />
                </Form.Field>
                <Form.Field>
                    <Label size='small'>To date</Label>
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