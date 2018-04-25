import React from 'react';
import { Button, Form, Input, Label} from 'semantic-ui-react'

const fixSingleCipherNumber= (number) => {
  if (number < 10) {
      return '0' + number;
  }
  return number;
};

const getInputDateValue = (date) => {
    let yyyy = date.getFullYear();
    let mm = fixSingleCipherNumber(date.getMonth() + 1);
    let dd = fixSingleCipherNumber(date.getDate());

    return yyyy + '-' + mm + '-' + dd;

};

class DateRangeSelector extends React.Component {
    constructor(props) {
        super(props);

        let today = getInputDateValue(new Date());

        this.state = {
            fromDate: today,
            toDate: today
        }
    }

    render() {
        return <div>
            <Form>
                <Form.Field>
                    <Label size='small'>From date</Label>
                    <Input type='date' id='dateFrom' value={ this.state.fromDate }/>
                </Form.Field>
                <Form.Field>
                    <Label size='small'>To date</Label>
                    <Input type='date' id='dateTo' value={ this.state.toDate } />
                </Form.Field>
            </Form>
        </div>
    }

};

export default DateRangeSelector;