import React from 'react';
import HeaderMenu from './HeaderMenu';
import Map from './Map';
import MapControls from './MapControls';
import NotificationPopup from './NotificationPopup'
import moment from 'moment';
import { Button, Sidebar } from 'semantic-ui-react';

/************************ styles ***************************************/
const narrowWidth = 700;

const sidebarContentStyle = {
    background: '#000',
    height: '100%',
    overflow: 'auto',
    padding: '16px'
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

const getSidebarToggleStyle = (direction, visible) => {
    let style = Object.assign({}, sidebarToggleStyle);

    if (direction === 'right') {
        Object.assign(style, {
            right: 0,
            top: '50%'
        });
    } else if (direction === 'bottom') {
        Object.assign(style, {
            bottom: 0,
            left: '50%'
        });
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

const defaultTopic_ = 'drought';

const propertiesRequestPath = '/api/v2/properties/';
const timeSeriesRequestPath = '/api/v2/timeseries/';

const timeZone = '+01:00';

class MapApp extends React.Component {
    constructor(props) {
        super(props);

        let now = moment().utcOffset(timeZone);

        let from = now.clone().startOf('day').subtract(1, 'months');
        let to = now.clone().startOf('day').subtract(1, 'days');

        this.state = {
            isSmall: false,
            topic: props.topic || defaultTopic_,
            properties: [],
            selection: {
                primaryPropertyId: null,
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
            loading: false,
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

        this.mapRef = React.createRef();
    }

    componentDidMount() {
        moment.locale('en-gb');

        let propertiesRequestUrl = propertiesRequestPath +
                '?topic=' + this.state.topic + '&format=json';
        fetch(propertiesRequestUrl)
            .then((results) => {
                return results.json();
            }).then((data) => {
                let primaryPropertyId = data.length ? data[0].name_id : null;

                this.setState((prevState,props) => {
                    let selection = prevState.selection;
                    selection.primaryPropertyId = primaryPropertyId;

                    this.handleAppStateChange({
                        from: selection.from,
                        to: selection.to,
                        properties: data
                    });

                    return {
                        loading: true,
                        properties: data,
                        selection: selection
                    };
                });
            });

        this.resizeApp();
        window.addEventListener('resize', this.resizeApp.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeApp.bind(this));
    }

    /**************************** sidebar handlers *********************************/
    updateSidebarDirection() {
        let direction;

        if (window.innerWidth <= narrowWidth) {
            direction = 'bottom';
        } else {
            direction = 'right';
        }

        this.setState({
            sidebarDirection: direction
        });

        setTimeout(() => { this.mapRef.current.updateMapSize(); }, 100);
    }

    handleSidebarToggleClick() {
        this.setState({
            sidebarVisible: !this.state.sidebarVisible
        });

        setTimeout(() => { this.mapRef.current.updateMapSize(); }, 100);
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
    resizeApp() {
        this.updateSidebarDirection();

        this.setState({
           isSmall: window.innerWidth <= narrowWidth ? true : false
        });
    }

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
            topic: this.state.topic,
            phenomenon_date_from: options.from.format('YYYY-MM-DD'),
            phenomenon_date_to: options.to.format('YYYY-MM-DD'),
            bbox: options.bbox
        };

        let properties = options.properties || this.state.properties;
        if (properties.length) {
            let nameIds = properties.map((property) => property.name_id);
            requestParameters.properties = nameIds.join(',');
        }

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
                        isDataValid: false,
                        loading: false
                    });
                    return;
                }

                response.json().then((data) => {
                    let from = data.phenomenon_time_from ?
                        moment(data.phenomenon_time_from).utcOffset(timeZone) :
                        null;
                    let to = data.phenomenon_time_to ?
                        moment(data.phenomenon_time_to).utcOffset(timeZone) :
                        null;

                    this.setState({
                        currentValues: {
                            from: from,
                            to: to,
                            frequency: data.value_frequency,
                            valueDuration: data.value_duration
                        },
                        geojsonData: data,
                        isDataValid: from && to,
                        loading: false
                    });
                });
            })
            .catch((error) => console.log(error));
    }

    handlePropertyChange(event, data) {
        let primaryPropertyId = data.value;

        this.setState((prevState, props) => {
            let selection = prevState.selection;
            selection.primaryPropertyId = primaryPropertyId;

            return {
                selection: selection
            };
        });
    };

    handleDateRangeChange(from, to) {
        console.log('MapApp handleDateRangeChange - from: ', from.clone().unix());
        this.setState((prevState, props) => {
            let isPropertyChosen = prevState.selection.primaryPropertyId !== null;
            if (isPropertyChosen) {
                this.handleAppStateChange({
                    from: from,
                    to: to
                });
            }

            let selection = prevState.selection;
            selection.from = from;
            selection.to = to;

            return {
                loading: isPropertyChosen,
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
        const { sidebarVisible, sidebarDirection } = this.state;

        return <div className="content">
            <Sidebar.Pushable className={ this.getSidebarClass() }>
                <Sidebar
                        as="div"
                        className="control-panel"
                        animation="overlay"
                        direction={ sidebarDirection }
                        visible={ sidebarVisible }>

                    <div style={ sidebarContentStyle }>
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
                </Sidebar>

                <Sidebar.Pusher style={ pusherStyle }>
                    <div className={ this.getSidebarClass() + ' main-wrapper'}>
                        <Map className="map"
                             ref={ this.mapRef }
                             topic={ this.state.topic }
                             properties={ this.state.properties }
                             primaryProperty={ this.getPropertyById(this.state.selection.primaryPropertyId) }
                             currentValues={ this.state.currentValues }
                             timeZone={ timeZone }
                             data={ this.state.geojsonData }
                             isSmall={ this.state.isSmall }
                             isDataValid={ this.state.isDataValid }
                             loading={ this.state.loading }
                             index={ this.state.selection.timeValueIndex }/>

                        <Button
                            className='sidebar-toggle'
                            icon={ getSidebarToggleIcon(sidebarDirection, sidebarVisible) }
                            onClick={ this.handleSidebarToggleClick }
                            style={ getSidebarToggleStyle(sidebarDirection, sidebarVisible) }/>
                    </div>

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