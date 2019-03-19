import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import DateRangeSelector from './DateRangeSelector';
import TimeSlider from './TimeSlider';

const controlPartStyle = {
    marginTop: '16px',
};

class TimeControl extends React.Component {
    constructor(props) {
        super(props);

        const { dateRange } = props;

        this.state = {
            from: dateRange ? dateRange.from : null,
            to: dateRange ? dateRange.to : null,
        };

        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
    }

    handleDateRangeChange(from, to) {
        const { handleDateRangeChange } = this.props;
        if (handleDateRangeChange) {
            handleDateRangeChange(from, to);
        }

        this.setState({
            from,
            to,
        });
    }

    render() {
        const { currentValues, handleTimeValueChange, loading, notifyUser, timeZone } = this.props;

        const { from, to } = this.state;

        const currentTo = currentValues.to
            ? currentValues.to
                  .clone()
                  .subtract(currentValues.frequency, 'seconds')
                  .unix()
            : null;

        return (
            <div>
                <div style={controlPartStyle}>
                    <TimeSlider
                        from={currentValues.from ? currentValues.from.unix() : null}
                        to={currentTo}
                        interval={currentValues.valueDuration}
                        loading={loading}
                        timeZone={timeZone}
                        frequency={currentValues.frequency}
                        disabled={currentValues.from == null || currentValues.to == null}
                        callback={handleTimeValueChange}
                    />
                </div>
                <div style={controlPartStyle}>
                    <DateRangeSelector
                        from={from}
                        to={to}
                        timeZone={timeZone}
                        currentValues={currentValues}
                        callback={this.handleDateRangeChange}
                        notifyUser={notifyUser}
                        style={controlPartStyle}
                    />
                </div>
            </div>
        );
    }
}

TimeControl.propTypes = {
    currentValues: PropTypes.shape({
        from: momentPropTypes.momentObj,
        to: momentPropTypes.momentObj,
        frequency: PropTypes.number,
        valueDuration: PropTypes.number,
    }).isRequired,
    dateRange: PropTypes.shape({
        from: momentPropTypes.momentObj,
        to: momentPropTypes.momentObj,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
    handleDateRangeChange: PropTypes.func.isRequired,
    handleTimeValueChange: PropTypes.func.isRequired,
    notifyUser: PropTypes.func.isRequired,
    timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TimeControl;
