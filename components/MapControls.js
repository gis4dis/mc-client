import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Dropdown } from 'semantic-ui-react';
import TimeControl from './TimeControl';

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

class MapControls extends React.PureComponent {
    render() {
        const {
            currentValues,
            notifyUser,
            onDateRangeChange,
            onPropertyChange,
            onTimeValueChange,
            properties,
            selection,
            timeZone,
        } = this.props;

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
                    timeZone={timeZone}
                    handleDateRangeChange={onDateRangeChange}
                    handleTimeValueChange={onTimeValueChange}
                    notifyUser={notifyUser}
                    style={partStyle}
                />
            </div>
        );
    }
}

MapControls.propTypes = {
    currentValues: PropTypes.shape({
        from: PropTypes.instanceOf(moment.Moment),
        to: PropTypes.instanceOf(moment.Moment),
        frequency: PropTypes.number,
    }).isRequired,
    notifyUser: PropTypes.func.isRequired,
    onDateRangeChange: PropTypes.func.isRequired,
    onPropertyChange: PropTypes.func.isRequired,
    onTimeValueChange: PropTypes.func.isRequired,
    properties: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            name_id: PropTypes.string,
            unit: PropTypes.string,
        })
    ).isRequired,
    selection: PropTypes.shape({
        primaryPropertyId: PropTypes.string,
        from: PropTypes.instanceOf(moment.Moment),
        to: PropTypes.instanceOf(moment.Moment),
        timeValueIndex: PropTypes.number,
        bbox: PropTypes.array,
    }).isRequired,
    timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default MapControls;
