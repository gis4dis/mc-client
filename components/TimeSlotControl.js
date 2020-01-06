import React from 'react';
import PropTypes from 'prop-types';
import { Button, Divider } from 'semantic-ui-react';
import { TIME_SLOTS, TIME_SLOTS_PART_TITLES } from '../appConfiguration';

const controlPartStyle = {
    marginTop: '16px',
    textAlign: 'center',
    width: '100%',
};

const TimeSlotControl = props => {
    const { timeSlots, selected, property, handleTimeSlotChange } = props;

    return (
        <div style={controlPartStyle}>
            <Divider horizontal inverted style={{ marginTop: '18px' }}>
                {TIME_SLOTS_PART_TITLES[property]}
            </Divider>
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
                            {TIME_SLOTS[timeSlot.name_id].title}
                        </Button>
                    );
                })}
            </Button.Group>
        </div>
    );
};

TimeSlotControl.defaultProps = {
    property: null,
    selected: null,
};

TimeSlotControl.propTypes = {
    handleTimeSlotChange: PropTypes.func.isRequired,
    property: PropTypes.string,
    selected: PropTypes.string,
    timeSlots: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            name_id: PropTypes.string,
        })
    ).isRequired,
};

export default TimeSlotControl;
