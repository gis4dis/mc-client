import React from 'react';
import moment from 'moment';
import DateRangeSelector from './DateRangeSelector';
import TimeSlider from './TimeSlider';

const controlPartStyle = {
    marginTop: '16px',
};

class TimeControl extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            from: props.dateRange ? props.dateRange.from : null,
            to: props.dateRange ? props.dateRange.to : null,
        };

        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    }

    handleDateRangeChange(from, to) {
        if (this.props.handleDateRangeChange) {
            this.props.handleDateRangeChange(from, to);
        }

        this.setState({
            from,
            to,
        });
    }

    render() {
        const currentTo = this.props.currentValues.to ?
            this.props.currentValues.to
                  .clone()
                  .subtract(this.props.currentValues.frequency, 'seconds')
                  .unix() :
            null;

        return (
            <div>
                <div style={controlPartStyle}>
                    <TimeSlider
                        from={
                            this.props.currentValues.from ?
                                this.props.currentValues.from.unix() :
                                null
                        }
                        to={currentTo}
                        interval={this.props.valueDuration}
                        timeZone={this.props.timeZone}
                        frequency={this.props.currentValues.frequency}
                        disabled={
                            this.props.currentValues.from == null ||
                            this.props.currentValues.to == null
                        }
                        callback={this.props.handleTimeValueChange}
                    />
                </div>
                <div style={controlPartStyle}>
                    <DateRangeSelector
                        from={this.state.from}
                        to={this.state.to}
                        timeZone={this.props.timeZone}
                        currentValues={this.props.currentValues}
                        callback={this.handleDateRangeChange}
                        notifyUser={this.props.notifyUser}
                        style={controlPartStyle}
                    />
                </div>
            </div>
        );
    }
}

export default TimeControl;
