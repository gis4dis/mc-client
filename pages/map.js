import React from 'react';
import MapLayout from '../components/MapLayout';

class MapPage extends React.PureComponent {
    constructor(props) {
        super(props);
    }


    render() {

        return (
            <div className="root">
                <MapLayout sidebarVisible />
            </div>
        );
    }
}

export default MapPage;