import React from 'react';
import HeaderMenu from './HeaderMenu';
import Map from './Map';
import MapControls from './MapControls';
import moment from 'moment';
import { Button, Container, Dropdown, Sidebar } from 'semantic-ui-react';

/************************ styles ***************************************/
const sidebarContentStyle = {
    background: '#000',
    height: '100%',
    padding: '16px'
};

const getSidebarContentStyle = (direction) => {
    let style = Object.assign({}, sidebarContentStyle);

    if (direction === 'right') {
        style.marginLeft = '40px';
    } else if (direction === 'bottom') {
        style.marginTop = '40px';
    }

    return style;
}

const pusherStyle = {
    height: '100%',
    position: 'relative',
    width: '100%'
};

const sidebarToggleStyle = {
    background: '#000',
    color: '#fff',
    position: 'absolute',
    zIndex: 1
}

const rightVisibleStyle = {
    left: 0,
    top: '50%'
};

const rightHiddenStyle = {
    right: 0,
    top: '50%'
};

const bottomVisibleStyle = {
    left: '50%',
    top: 0
};

const bottomHiddenStyle = {
    left: '50%',
    bottom: 0
};

const getSidebarToggleStyle = (direction, visible) => {
    let style = Object.assign({}, sidebarToggleStyle);

    if (direction === 'right') {
        if (visible) {
            Object.assign(style, rightVisibleStyle);
        } else {
            Object.assign(style, rightHiddenStyle);
        }
    } else if (direction === 'bottom') {
        if (visible) {
            Object.assign(style, bottomVisibleStyle);
        } else {
            Object.assign(style, bottomHiddenStyle);
        }
    }
    return style;
};

const getSidebarToggleIcon = (direction, visible) => {
    if (direction === 'right') {
        return visible ? 'angle double right' : 'angle double left';
    } else if (direction === 'bottom') {
        return visible ? 'angle double down' : 'angle double up';
    }
};
/************************ styles ***************************************/

const serverUrl = 'http://localhost:3000';

class MapApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            properties: [],
            selection: {
                property: null,
                from: moment().startOf('day').subtract(1, 'months'),
                to: moment().endOf('day').subtract(1, 'days'),
                bbox: null
            },
            sidebarVisible: props.sidebarVisible,
            sidebarDirection: 'right'
        };

        this.handlePropertyChange = this.handlePropertyChange.bind(this);
        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        this.handleTimeValueChange = this.handleDateRangeChange.bind(this);

        this.handleSidebarToggleClick = this.handleSidebarToggleClick.bind(this);
    }

    componentDidMount() {
        moment.locale('en');

        fetch(serverUrl + '/api/v1/properties/?format=json')
            .then((results) => {
                return results.json();
            }).then((data) => {
                this.setState({
                    properties: data,
                    selection: {
                        property: data.length ? data[0].name_id : null
                    }
                });
            });

        window.addEventListener('resize', this.updateSidebarDirection.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSidebarDirection.bind(this));
    }

    updateSidebarDirection() {
        let direction;

        if (window.innerWidth <= 700) {
            direction = 'bottom';
        } else {
            direction = 'right';
        }

        this.setState({
            sidebarDirection: direction
        });
    }

    handleSidebarToggleClick() {
        this.setState({
            sidebarVisible: !this.state.sidebarVisible
        });
    }

    /******************************** app handlers *********************************/
    handleAppStateChange(propertyId, from, to, opt_bbox) {
        let requestParameters = {
            name_id: propertyId,
            phenomenon_date_from: from,
            phenomenon_date_to: to,
            bbox: opt_bbox
        };

        fetch('/static/data/timeseries.json')
            .then((results) => {
                return results.json();
            }).then((data) => {
                console.log(data);
            });
    }

    handlePropertyChange(event, data) {
        var propertyId = data.value;

        this.setState((prevState, props) => {
            if (prevState.selection.from && prevState.selection.to) {
                this.handleAppStateChange(propertyId, prevState.selection.from, prevState.selection.to);
            }

            return {
                selectedPropertyId: propertyId
            };
        });
    };

    handleDateRangeChange(from, to) {
        this.setState((prevState, props) => {
            if (prevState.selection.property) {
                this.handleAppStateChange(prevState.selection.property, from, to);
            }

            return {
                selection: {
                    from: from,
                    to: to
                }
            };
        });
    };

    handleTimeValueChange(time) {
        console.log(time);
    };
    /******************************** app handlers *********************************/

    render() {
        const sidebarVisible = this.state.sidebarVisible;

        return <div className="content">
            <HeaderMenu activeItem="map" />

            <Sidebar.Pushable>
                <Sidebar
                        as={ Container }
                        animation="overlay"
                        direction={ this.state.sidebarDirection }
                        visible={ this.state.sidebarVisible }
                        width="wide">

                    <div style={ getSidebarContentStyle(this.state.sidebarDirection) }>
                        <MapControls
                                properties={ this.state.properties }
                                selection={ this.state.selection }
                                onPropertyChange={ this.handlePropertyChange }
                                onDateRangeChange={ this.handleDateRangeChange }
                                onTimeValueChange={ this.handleTimeValueChange }
                        />
                    </div>

                    { sidebarVisible && <Button
                        icon={ getSidebarToggleIcon(this.state.sidebarDirection, this.state.sidebarVisible) }
                        onClick={ this.handleSidebarToggleClick }
                        style={ getSidebarToggleStyle(this.state.sidebarDirection, this.state.sidebarVisible) }/>
                    }
                </Sidebar>

                <Sidebar.Pusher style={ pusherStyle }>
                    <Map />

                    { !sidebarVisible && <Button
                        icon={ getSidebarToggleIcon(this.state.sidebarDirection, this.state.sidebarVisible) }
                        onClick={ this.handleSidebarToggleClick }
                        style={ getSidebarToggleStyle(this.state.sidebarDirection, this.state.sidebarVisible) }/>
                    }
                </Sidebar.Pusher>
            </Sidebar.Pushable>

            <style jsx>{`
                .content {
                    height: calc(100vh - 40px);
                    position: absolute;
                    top: 40px;
                    width: 100%;
                }
            `}</style>
        </div>
    }
}

export default MapApp;