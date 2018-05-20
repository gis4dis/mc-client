import React from 'react';
import MapApp from '../components/MapApp';

class MapPage extends React.PureComponent {
    constructor(props) {
        super(props);
    }


    render() {

        return (
            <div className="root">
                <MapApp sidebarVisible />
            </div>
        );
    }
}

export default MapPage;