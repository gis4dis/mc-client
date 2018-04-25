import React from 'react';
import { Button, Container, Dropdown} from 'semantic-ui-react'



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
                    options={ this.props.properties } />
        </div>
    }

};

export default MapControls;

