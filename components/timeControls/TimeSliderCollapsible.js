import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { Accordion, Icon, Segment } from 'semantic-ui-react';
import TimeSlider from './TimeSlider';
import TimeValue from './TimeValue';
import { getLastObservationTime, getObservationTime } from '../../utils/time';

class TimeSliderCollapsible extends React.Component {
    state = { activeIndex: 0 };

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({
            activeIndex: newIndex,
        });

        const { onCollapsedChange } = this.props;
        onCollapsedChange(newIndex === -1);
    };

    render() {
        const { currentValues, loading, onValueChange, timeZone } = this.props;
        const { frequency, from, time, to, valueDuration } = currentValues;

        const currentFrom = from ? from.unix() : null;
        const currentTo = to ? getLastObservationTime(to, valueDuration).unix() : null;
        const currentTime = time ? time.unix() : null;

        const { activeIndex } = this.state;

        return (
            <Segment inverted style={{ padding: '8px 1em' }}>
                <Accordion inverted>
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.handleClick}
                        style={{ padding: 0 }}
                    >
                        {from && currentTo && (
                            <div>
                                <Icon name="dropdown" />
                                <TimeValue value={getObservationTime(time, valueDuration)} />
                            </div>
                        )}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <TimeSlider
                            from={currentFrom}
                            to={currentTo}
                            value={currentTime}
                            interval={valueDuration}
                            loading={loading}
                            timeZone={timeZone}
                            frequency={frequency}
                            disabled={from == null || to == null}
                            callback={onValueChange}
                        />
                    </Accordion.Content>
                </Accordion>
            </Segment>
        );
    }
}

TimeSliderCollapsible.propTypes = {
    currentValues: PropTypes.shape({
        from: momentPropTypes.momentObj,
        to: momentPropTypes.momentObj,
        time: momentPropTypes.momentObj,
        frequency: PropTypes.number,
        valueDuration: PropTypes.number,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
    onValueChange: PropTypes.func.isRequired,
    onCollapsedChange: PropTypes.func.isRequired,
    timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TimeSliderCollapsible;
