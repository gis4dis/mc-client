import React from 'react';
import HeaderMenu from './HeaderMenu';
import Map from './Map';
import MapControls from './MapControls';
import NotificationPopup from './NotificationPopup'
import moment from 'moment';
import { Button, Dropdown, Popup, Sidebar } from 'semantic-ui-react';

/************************ styles ***************************************/
const sidebarContentStyle = {
    background: '#000',
    height: '100%',
    overflow: 'auto',
    padding: '16px'
};

const getSidebarContentStyle = (direction) => {
    let style = Object.assign({}, sidebarContentStyle);

    if (direction === 'right') {
        style.marginLeft = '40px';
        style.width = 'calc(100% - 40px)';
    } else if (direction === 'bottom') {
        style.marginTop = '40px';
        style.width = '100%';
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

const propertiesRequestPath = '/api/v1/properties/';
const timeSeriesRequestPath = '/api/v1/timeseries/';
const timeZone = '+01:00'

class MapApp extends React.Component {
    constructor(props) {
        super(props);

        let now = moment().utcOffset(timeZone);

        let from = now.clone().startOf('day').subtract(1, 'months');
        let to = now.clone().startOf('day').subtract(1, 'days');

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
            sidebarDirection: 'right',
            popupOpen: false,
            popupMessage: null
        };

        this.handlePropertyChange = this.handlePropertyChange.bind(this);
        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        this.handleTimeValueChange = this.handleTimeValueChange.bind(this);

        this.notifyUser = this.notifyUser.bind(this);

        this.handleSidebarToggleClick = this.handleSidebarToggleClick.bind(this);
    }

    componentDidMount() {
        moment.locale('en-gb');

        fetch(propertiesRequestPath + '?format=json')
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

        this.updateSidebarDirection();
        window.addEventListener('resize', this.updateSidebarDirection.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSidebarDirection.bind(this));
    }

    /**************************** sidebar handlers *********************************/
    updateSidebarDirection() {
        let direction;

        let width = window.innerWidth;
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

    getSidebarClass() {
        let classes = '';

        if (this.state.sidebarVisible) {
            classes += 'sidebar-visible';
        } else {
            classes += 'sidebar-hidden';
        }

        classes += ' ' + this.state.sidebarDirection;
        return classes;
    }
    /**************************** sidebar handlers *********************************/

    /******************************** app handlers *********************************/
    /**
     * @param params
     * @private
     */
    _sendTimeSeriesRequest(params) {
        let paramParts = [];
        for (let key in params) {
            if (params[key] != null) {
                paramParts.push(key + '=' + params[key]);
            }
        }

        let requestUrl = timeSeriesRequestPath + '?' + paramParts.join('&');
        return fetch(requestUrl);
    }

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
            phenomenon_date_from: options.from.format('YYYY-MM-DD'),
            phenomenon_date_to: options.to.format('YYYY-MM-DD'),
            bbox: options.bbox
        };

        this._sendTimeSeriesRequest(requestParameters)
            .then((response) => {
                if (response.status !== 200) {
                    let message = 'Looks like there was a problem. Status Code: ' +
                        response.status;
                    console.log(message);
                    this.notifyUser({
                        text: message,
                        color: 'red'
                    });

                    this.setState({
                        currentValues: {
                            from: null,
                            to: null,
                            frequency: null
                        },
                        geojsonData: null,
                        isDataValid: false
                    });
                    return;
                }

                response.json().then((data) => {
                    let from = data.phenomenon_time_from ?
                        moment(data.phenomenon_time_from, 'YYYY-MM-DD HH:mm:ssZ').utcOffset(timeZone) :
                        null;
                    let to = data.phenomenon_time_to ?
                        moment(data.phenomenon_time_to, 'YYYY-MM-DD HH:mm:ssZ').utcOffset(timeZone) :
                        null;
                    this.setState({
                        currentValues: {
                            from: from,
                            to: to,
                            frequency: data.value_frequency
                        },
                        geojsonData: data,
                        isDataValid: from && to
                    });
                });
            })
            .catch((error) => console.log(error));
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

    notifyUser(message) {
        this.setState({
            popupOpen: true,
            popupMessage: message.text,
            popupColor: message.color
        });

        setTimeout(function() {
            this.setState({
                popupOpen: false
            });
        }.bind(this), 5000);

    }
    /******************************** app handlers *********************************/

    getPropertyById(propertyId) {
        let property = this.state.properties.find((property) => (property.name_id === propertyId));

        return property;
    }

    render() {
        const sidebarVisible = this.state.sidebarVisible;

        return <div className="content">
            <HeaderMenu activeItem="map" />

            <Sidebar.Pushable className={ this.getSidebarClass() }>
                <Sidebar
                        as="div"
                        animation="overlay"
                        direction={ this.state.sidebarDirection }
                        visible={ this.state.sidebarVisible }
                        width="wide">

                    <div style={ getSidebarContentStyle(this.state.sidebarDirection) }>
                        <MapControls
                                properties={ this.state.properties }
                                selection={ this.state.selection }
                                currentValues={ this.state.currentValues }
                                timeZone={ timeZone }
                                onPropertyChange={ this.handlePropertyChange }
                                onDateRangeChange={ this.handleDateRangeChange }
                                onTimeValueChange={ this.handleTimeValueChange }
                                notifyUser={ this.notifyUser }
                        />
                    </div>

                    { sidebarVisible && <Button
                        icon={ getSidebarToggleIcon(this.state.sidebarDirection, this.state.sidebarVisible) }
                        onClick={ this.handleSidebarToggleClick }
                        style={ getSidebarToggleStyle(this.state.sidebarDirection, this.state.sidebarVisible) }/>
                    }
                </Sidebar>

                <Sidebar.Pusher style={ pusherStyle }>
                    <Map property={ this.getPropertyById(this.state.selection.propertyId) }
                         data={ this.state.geojsonData }
                         isDataValid={ this.state.isDataValid }
                         index={ this.state.selection.timeValueIndex }/>

                    { !sidebarVisible && <Button
                        icon={ getSidebarToggleIcon(this.state.sidebarDirection, this.state.sidebarVisible) }
                        onClick={ this.handleSidebarToggleClick }
                        style={ getSidebarToggleStyle(this.state.sidebarDirection, this.state.sidebarVisible) }/>
                    }
                </Sidebar.Pusher>
            </Sidebar.Pushable>

            <NotificationPopup
                    open={ this.state.popupOpen }
                    message={ this.state.popupMessage }
                    color={ this.state.popupColor } />

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