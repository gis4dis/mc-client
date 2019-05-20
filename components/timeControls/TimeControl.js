import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import DateRangeSelector from '../DateRangeSelector';
import TimeSlider from './TimeSlider';
import TimeValue from './TimeValue';
import { getLastObservationTime } from '../../utils/time';

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
        const {
            currentValues,
            showSlider,
            handleTimeValueChange,
            loading,
            notifyUser,
            timeZone,
        } = this.props;

        const { from, to } = this.state;

        const currentFrom = currentValues.from ? currentValues.from.unix() : null;
        const currentTo = currentValues.to ? getLastObservationTime(currentValues.to).unix() : null;
        const currentTime = currentValues.time ? currentValues.time.unix() : null;

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
                            {from && to && <TimeValue value={currentValues.time} />}
                            <TimeSlider
                                from={currentFrom}
                                to={currentTo}
                                value={currentTime}
                                interval={currentValues.valueDuration}
                                loading={loading}
                                timeZone={timeZone}
                                frequency={currentValues.frequency}
                                disabled={currentValues.from == null || currentValues.to == null}
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
    loading: PropTypes.bool.isRequired,
    showSlider: PropTypes.bool,
    handleDateRangeChange: PropTypes.func.isRequired,
    handleTimeValueChange: PropTypes.func.isRequired,
    notifyUser: PropTypes.func.isRequired,
    timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TimeControl;
