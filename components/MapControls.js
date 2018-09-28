import React from 'react';
import { Button, Container, Dropdown} from 'semantic-ui-react'
import TimeControl from "./TimeControl";

/************************ styles ***************************************/
const partStyle = {
    margin: '8px 0'
};
/************************ styles ***************************************/

const processProperty = (property) => {
    return {
        value: property.name_id,
        text: property.name,
        description: property.unit
    };
};

class MapControls extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <Dropdown
                    placeholder='Property'
                    fluid
                    onChange={ this.props.onPropertyChange }
                    search
                    selection
                    options={ this.props.properties.map(processProperty) }
                    value={ this.props.selection.primaryPropertyId }
                    style={ partStyle } />

            <TimeControl
                    dateRange={ {from: this.props.selection.from, to: this.props.selection.to} }
                    currentValues={ this.props.currentValues }
                    timeZone={ this.props.timeZone }
                    handleDateRangeChange={ this.props.onDateRangeChange }
                    handleTimeValueChange={ this.props.onTimeValueChange }
                    notifyUser={ this.props.notifyUser }
                    style={ partStyle } />
        </div>
    }

};

export default MapControls;

