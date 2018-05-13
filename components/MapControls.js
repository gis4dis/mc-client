import React from 'react';
import { Button, Container, Dropdown} from 'semantic-ui-react'
import TimeControl from "./TimeControl";

const partStyle = {
    margin: '8px 0'
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
                    options={ this.props.properties }
                    style={ partStyle }/>

            <TimeControl
                    handleDateRangeChange={ this.props.onDateRangeChange }
                    style={ partStyle }/>
        </div>
    }

};

export default MapControls;

