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
            from: props.dateRange ? props.dateRange.from : null,
            to: props.dateRange ? props.dateRange.to : null
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
            <div style={ controlPartStyle }>
                <TimeSlider
                    from={ this.props.currentValues.from.unix() }
                    to={ this.props.currentValues.to.unix() }
                    frequency={ this.props.currentValues.frequency }
                    callback={ this.props.handleTimeValueChange } />
            </div>
            <div style={ controlPartStyle }>
                <DateRangeSelector
                    from={ this.state.from }
                    to={ this.state.to }
                    currentValues={ this.props.currentValues }
                    callback={ this.handleDateRangeChange }
                    style={ controlPartStyle }/>
            </div>
        </div>
    }
};

export default TimeControl;