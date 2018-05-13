import React from "react";
import moment from 'moment';
import DateRangeSelector from './DateRangeSelector';

class TimeControl extends React.Component {
    constructor(props) {
        super(props);

        let today = moment();

        this.state = {
            from: today,
            to: today
        };

        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    }

    handleDateRangeChange(from, to) {
        if (this.props.handleDateRangeChange) {
            this.props.handleDateRangeChange(from, to);
        }

        this.setState({
            from: from,
            to: to
        });
    }

    render() {
        return <div>
            <DateRangeSelector from={ this.state.from } to={ this.state.to } callback={ this.handleDateRangeChange }/>
        </div>
    }
};

export default TimeControl;