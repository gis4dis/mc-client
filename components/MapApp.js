import HeaderMenu from './HeaderMenu';
import Map from './Map';
import MapControls from './MapControls';
import moment from 'moment';
import { Button, Container, Dropdown, Sidebar } from 'semantic-ui-react';

const buttonStyle = {
    position: 'absolute',
    right: '.5em',
    top: '.5em',
    zIndex: 1
};

const mainPartStyle = {
    position: 'absolute',
    width: '100%',
    height: 'calc(100% - 40px)',
    top: '40px'
};

const sidebarStyle = {
    background: '#000',
    height: '100%',
    padding: '16px'
};

const processProperty = (property) => {
    return {
        value: property.name_id,
        text: property.name,
        description: property.unit
    };
};

const sidebarToggle = {
    key: 'sidebarToggle',
    name: 'Show settings',
    as: 'span',
    position: 'right'
};

const onPropertyChange = (event, data) => {
    var propertyId = data.value;
    console.log(propertyId);
};

const onDateRangeChange = (from, to) => {
    console.log(from, to);
};

const onTimeValueChange = (time) => {
    console.log(time);
};

class MapApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            properties: [],
            sidebarVisible: props.sidebarVisible
        };

        const handleSidebarToggleClick = () => {
            this.setState({
                sidebarVisible: !this.state.sidebarVisible
            });
        };
        sidebarToggle.onClick = handleSidebarToggleClick;
    }

    componentDidMount() {
        moment.locale('en');

        fetch('/static/data/properties.json')
            .then((results) => {
                return results.json();
            }).then((data) => {
                let properties = data.properties;

                this.setState({
                    properties: properties.map(processProperty)
                });
            });
    }

    render() {
        return <div>
            <HeaderMenu addItems={ [sidebarToggle] } activeItem='map' />

            <Sidebar.Pushable style={ mainPartStyle }>
                <Sidebar
                        as={ Container }
                        animation="overlay"
                        direction="right"
                        visible={ this.state.sidebarVisible }
                        style={ sidebarStyle }>
                    <MapControls
                            properties={ this.state.properties }
                            onPropertyChange={ onPropertyChange }
                            onDateRangeChange={ onDateRangeChange }
                            onTimeValueChange={ onTimeValueChange }
                    />
                </Sidebar>

                <Sidebar.Pusher>
                    <Map />
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    }
}

export default MapApp;