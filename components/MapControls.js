import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import { Dropdown, Icon, Message } from 'semantic-ui-react';
import TimeControl from './timeControls/TimeControl';
import TimeSlotControl from './TimeSlotControl';

/** ********************** styles ************************************** */
const partStyle = {
    margin: '8px 0',
};
/** ********************** styles ************************************** */

const processProperty = property => {
    return {
        value: property.name_id,
        text: property.name,
        description: property.unit,
    };
};

const MapControls = props => {
    const {
        currentValues,
        loading,
        isFullscreen,
        notifyUser,
        onDateRangeChange,
        onPropertyChange,
        onTimeSlotChange,
        onTimeValueChange,
        properties,
        timeSlots,
        selection,
        switchToMapHandler,
        timeZone,
    } = props;

    return (
        <div>
            <Dropdown
                placeholder="Property"
                fluid
                onChange={onPropertyChange}
                search
                selection
                options={properties.map(processProperty)}
                value={selection.primaryPropertyId}
                style={partStyle}
            />

            <TimeControl
                dateRange={{ from: selection.from, to: selection.to }}
                currentValues={currentValues}
                timeSlot={selection.timeSlotId}
                loading={loading}
                showSlider={!isFullscreen}
                timeZone={timeZone}
                handleDateRangeChange={onDateRangeChange}
                handleTimeValueChange={onTimeValueChange}
                notifyUser={notifyUser}
                style={Object.assign(
                    {
                        padding: '0 16px',
                        width: '100%',
                    },
                    partStyle
                )}
            />

            <TimeSlotControl
                timeSlots={timeSlots}
                selected={selection.timeSlotId}
                handleTimeSlotChange={onTimeSlotChange}
                style={partStyle}
            />

            {isFullscreen && (
                <Message icon onClick={switchToMapHandler}>
                    <Icon name={loading ? 'spinner' : 'map'} loading={loading} />
                    <Message.Content>
                        <Message.Header>
                            {loading ? 'Loading data...' : 'Loading finished.'}
                        </Message.Header>
                        {!loading ? 'Switch to map to see results.' : null}
                    </Message.Content>
                </Message>
            )}
        </div>
    );
};

MapControls.defaultProps = {
    isFullscreen: true,
};

MapControls.propTypes = {
    currentValues: PropTypes.shape({
        from: momentPropTypes.momentObj,
        to: momentPropTypes.momentObj,
        time: momentPropTypes.momentObj,
        frequency: PropTypes.number,
        valueDuration: PropTypes.number,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
    isFullscreen: PropTypes.bool,
    notifyUser: PropTypes.func.isRequired,
    onDateRangeChange: PropTypes.func.isRequired,
    onPropertyChange: PropTypes.func.isRequired,
    onTimeSlotChange: PropTypes.func.isRequired,
    onTimeValueChange: PropTypes.func.isRequired,
    properties: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            name_id: PropTypes.string,
            unit: PropTypes.string,
        })
    ).isRequired,
    timeSlots: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            name_id: PropTypes.string,
        })
    ).isRequired,
    selection: PropTypes.shape({
        primaryPropertyId: PropTypes.string,
        timeSlotId: PropTypes.string,
        from: momentPropTypes.momentObj,
        to: momentPropTypes.momentObj,
        timeValueIndex: PropTypes.number,
        bbox: PropTypes.array,
    }).isRequired,
    switchToMapHandler: PropTypes.func.isRequired,
    timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default MapControls;
