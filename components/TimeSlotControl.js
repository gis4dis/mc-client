import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { TIME_SLOTS_TITLES } from '../appConfiguration';

const controlPartStyle = {
    marginTop: '16px',
    textAlign: 'center',
    width: '100%',
};

const TimeSlotControl = props => {
    const { timeSlots, selected, handleTimeSlotChange } = props;

    return (
        <div style={controlPartStyle}>
            <Button.Group inverted size="mini">
                {timeSlots.map(timeSlot => {
                    const handleClick = () => {
                        handleTimeSlotChange(timeSlot.name_id);
                    };

                    return (
                        <Button
                            key={timeSlot.name_id}
                            inverted
                            size="mini"
                            color="teal"
                            active={selected === timeSlot.name_id}
                            onClick={handleClick}
                        >
                            {TIME_SLOTS_TITLES[timeSlot.name_id]}
                        </Button>
                    );
                })}
            </Button.Group>
        </div>
    );
};

TimeSlotControl.defaultProps = {
    selected: null,
};

TimeSlotControl.propTypes = {
    handleTimeSlotChange: PropTypes.func.isRequired,
    selected: PropTypes.string,
    timeSlots: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            name_id: PropTypes.string,
        })
    ).isRequired,
};

export default TimeSlotControl;
