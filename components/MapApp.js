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
};

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
};

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

        let from = moment().startOf('day').subtract(1, 'months');
        let to = moment().endOf('day').subtract(1, 'days');

        this.state = {
            properties: [],
            selection: {
                propertyId: null,
                from: from,
                to: to,
                timeValueIndex: 0,
                bbox: null
            },
            currentValues: {
                from: from,
                to: to,
                frequency: 3600
            },
            geojsonData: null,
            sidebarVisible: props.sidebarVisible,
            sidebarDirection: 'right'
        };

        this.handlePropertyChange = this.handlePropertyChange.bind(this);
        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        this.handleTimeValueChange = this.handleTimeValueChange.bind(this);

        this.handleSidebarToggleClick = this.handleSidebarToggleClick.bind(this);
    }

    componentDidMount() {
        moment.locale('en');

        fetch(serverUrl + '/api/v1/properties/?format=json')
            .then((results) => {
                return results.json();
            }).then((data) => {
                let propertyId = data.length ? data[0].name_id : null;

                this.setState((prevState,props) => {
                    let selection = prevState.selection;
                    selection.propertyId = propertyId;

                    this.handleAppStateChange({
                        propertyId: propertyId,
                        from: selection.from,
                        to: selection.to
                    });

                    return {
                        properties: data,
                        selection: selection
                    };
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
    /**
     * @param options
     * propertyId
     * from
     * to
     * bbox
     */
    handleAppStateChange(options) {
        let requestParameters = {
            name_id: options.propertyId,
            phenomenon_date_from: options.from,
            phenomenon_date_to: options.to,
            bbox: options.bbox
        };

        fetch('/static/data/timeseries.json')
            .then((results) => {
                return results.json();
            }).then((data) => {
                this.setState({
                    currentValues: {
                        from: moment(data.phenomenon_time_from, 'YYYY-MM-DD HH:mm:ss'),
                        to: moment(data.phenomenon_time_to, 'YYYY-MM-DD HH:mm:ss'),
                        frequency: data.value_frequency
                    },
                    geojsonData: data
                });
            });
    }

    handlePropertyChange(event, data) {
        let propertyId = data.value;

        this.setState((prevState, props) => {
            if (prevState.selection.from && prevState.selection.to) {
                this.handleAppStateChange({
                    propertyId: propertyId,
                    from: prevState.selection.from,
                    to: prevState.selection.to
                });
            }

            let selection = prevState.selection;
            selection.propertyId = propertyId;

            return {
                selection: selection
            };
        });
    };

    handleDateRangeChange(from, to) {
        this.setState((prevState, props) => {
            if (prevState.selection.propertyId) {
                this.handleAppStateChange({
                    propertyId: prevState.selection.propertyId,
                    from: from,
                    to: to
                });
            }

            let selection = prevState.selection;
            selection.from = from;
            selection.to = to;

            return {
                selection: selection
            };
        });
    };

    handleTimeValueChange(time) {
        this.setState((prevState, props) => {
            let from = prevState.currentValues.from.unix();
            let index = (time.unix() - from) / prevState.currentValues.frequency;

            let selection = prevState.selection;
            selection.timeValueIndex = index;

            return {
                selection: selection
            };
        });
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
                                currentValues={ this.state.currentValues }
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
                    <Map data={ this.state.geojsonData }
                         index={ this.state.selection.timeValueIndex }/>

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