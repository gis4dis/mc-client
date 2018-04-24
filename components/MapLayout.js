import HeaderMenu from './HeaderMenu'
import Map from './Map'
import MapControls from './MapControls'
import { Button, Container, Dropdown, Sidebar } from 'semantic-ui-react'

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

class MapLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            properties: [
                {key: 'temp', value:'temp', 'text': 'temperature'},
                {key: 'hum', value: 'hum', 'text': 'humidity'},
                {key: 'traf', value: 'traf', text: 'trafic'}
            ],
            sidebarVisible: props.sidebarVisible
        };
    }


    render() {
        const callback = () => this.setState({ sidebarVisible: !this.state.sidebarVisible });

        const sidebarToggle = {
            key: 'sidebarToggle',
            name: 'Show settings',
            as: 'span',
            position: 'right',
            onClick: callback
        };

        const onPropertyChange = (event, data) => {
            var propertyId = data.value;
        }

        return <div>
            <HeaderMenu addItems={ [sidebarToggle] }/>

            <Sidebar.Pushable style={ mainPartStyle }>
                <Sidebar
                        as={ Container }
                        animation="overlay"
                        direction="right"
                        visible={ this.state.sidebarVisible }
                        style={ sidebarStyle }>
                    <MapControls properties={ this.state.properties } onPropertyChange={ onPropertyChange }/>
                </Sidebar>

                <Sidebar.Pusher>
                    <Map />
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    }
}

export default MapLayout;