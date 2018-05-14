import React from 'react';
import moment from 'moment';
import DateRangeSelector from './DateRangeSelector';
import TimeSlider from './TimeSlider';

const controlPartStyle = {
    marginTop: '16px'
};

class TimeControl extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            from: moment().startOf('day').subtract(1, 'days'),
            to: moment().startOf('day')
        };

        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        // this.handleTimeValueChange = this.handleTimeValueChange.bind(this);
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
            <div style={ controlPartStyle }>
                <TimeSlider from={ this.state.from } to={ this.state.to } frequency={ this.props.frequency } callback={ this.props.handleTimeValueChange } />
            </div>
            <div style={ controlPartStyle }>
                <DateRangeSelector from={ this.state.from } to={ this.state.to } callback={ this.handleDateRangeChange } style={ controlPartStyle }/>
            </div>
        </div>
    }
};

export default TimeControl;