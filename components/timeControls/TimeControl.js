import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import DateRangeSelector from './dateRangeSelector/DateRangeSelector';
import TimeSlider from './TimeSlider';
import TimeValue from './TimeValue';
import { getObservationTime, getLastObservationTime } from '../../utils/time';

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

    componentWillReceiveProps(nextProps) {
        const { dateRange } = nextProps;

        this.setState({
            from: dateRange ? dateRange.from : null,
            to: dateRange ? dateRange.to : null,
        });
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
        const {
            currentValues,
            timeSlot,
            showSlider,
            handleTimeValueChange,
            loading,
            notifyUser,
            timeZone,
        } = this.props;

        const { from, to } = this.state;
        const { from: currFrom, to: currTo, frequency, time, valueDuration } = currentValues;

        const currentFrom = currFrom ? currFrom.unix() : null;
        const currentTo = currTo ? getLastObservationTime(currTo, valueDuration).unix() : null;
        const currentTime = time ? time.unix() : null;

        const sliderStyle = {
            position: 'relative',
            bottom: 'auto',
        };

        return (
            <div>
                <div style={controlPartStyle}>
                    <DateRangeSelector
                        from={from}
                        to={to}
                        timeSlot={timeSlot}
                        timeZone={timeZone}
                        currentValues={currentValues}
                        loading={loading}
                        callback={this.handleDateRangeChange}
                        notifyUser={notifyUser}
                        style={controlPartStyle}
                    />
                </div>

                {showSlider && (
                    <div style={controlPartStyle}>
                        <div style={sliderStyle}>
                            {from && to && (
                                <TimeValue
                                    value={
                                        time
                                            ? getObservationTime(time, valueDuration, frequency)
                                            : null
                                    }
                                />
                            )}
                            <TimeSlider
                                from={currentFrom}
                                to={currentTo}
                                value={currentTime}
                                interval={valueDuration}
                                loading={loading}
                                timeZone={timeZone}
                                frequency={frequency}
                                disabled={currFrom == null || currTo == null}
                                callback={handleTimeValueChange}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

TimeControl.defaultProps = {
    timeSlot: null,
    showSlider: true,
};

TimeControl.propTypes = {
    currentValues: PropTypes.shape({
        from: momentPropTypes.momentObj,
        to: momentPropTypes.momentObj,
        time: momentPropTypes.momentObj,
        frequency: PropTypes.number,
        valueDuration: PropTypes.number,
    }).isRequired,
    dateRange: PropTypes.shape({
        from: momentPropTypes.momentObj,
        to: momentPropTypes.momentObj,
    }).isRequired,
    timeSlot: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    showSlider: PropTypes.bool,
    handleDateRangeChange: PropTypes.func.isRequired,
    handleTimeValueChange: PropTypes.func.isRequired,
    notifyUser: PropTypes.func.isRequired,
    timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TimeControl;
