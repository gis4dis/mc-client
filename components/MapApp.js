import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Sidebar } from 'semantic-ui-react';
import Map from './Map';
import MapControls from './MapControls';
import NotificationPopup from './NotificationPopup';

/** ********************** styles ************************************** */
const NARROW_WIDTH = 700;

const sidebarContentStyle = {
    background: '#000',
    height: '100%',
    overflow: 'auto',
    padding: '16px',
};

const pusherStyle = {
    height: '100%',
    position: 'relative',
    width: '100%',
};

const sidebarToggleStyle = {
    background: '#000',
    color: '#fff',
    position: 'absolute',
    zIndex: 1,
};

const getSidebarToggleStyle = direction => {
    const style = Object.assign({}, sidebarToggleStyle);

    if (direction === 'right') {
        Object.assign(style, {
            right: 0,
            top: '50%',
        });
    } else if (direction === 'bottom') {
        Object.assign(style, {
            bottom: 0,
            left: '50%',
        });
    }
    return style;
};

const getSidebarToggleIcon = (direction, visible) => {
    if (direction === 'right') {
        return visible ? 'angle double right' : 'angle double left';
    }
    if (direction === 'bottom') {
        return visible ? 'angle double down' : 'angle double up';
    }
    return null;
};
/** ********************** styles ************************************** */

const INITIAL_RANGE_LENGTH = {
    weeks: 1,
};
const DEFAULT_TOPIC = 'drought';
const TIME_ZONE = '+01:00';

const PROPERTIES_REQUEST_PATH = '/api/v2/properties/';
const TIME_SERIES_REQUEST_PATH = '/api/v2/timeseries/';

/**
 * @param params
 */
const sendTimeSeriesRequest = params => {
    const paramParts = [];
    Object.keys(params).forEach(key => {
        if (params[key] != null) {
            paramParts.push(`${key}=${params[key]}`);
        }
    });

    const requestUrl = `${TIME_SERIES_REQUEST_PATH}?${paramParts.join('&')}`;
    return fetch(requestUrl);
};

class MapApp extends React.Component {
    constructor(props) {
        super(props);

        const now = moment().utcOffset(TIME_ZONE);

        const from = now
            .clone()
            .startOf('day')
            .subtract(INITIAL_RANGE_LENGTH);
        const to = now
            .clone()
            .startOf('day')
            .subtract(1, 'days');

        this.state = {
            isSmall: false,
            topic: props.topic || DEFAULT_TOPIC,
            properties: [],
            selection: {
                primaryPropertyId: null,
                from,
                to,
                timeValueIndex: 0,
                bbox: null,
            },
            currentValues: {
                from,
                to,
                frequency: 3600,
            },
            geojsonData: null,
            loading: false,
            sidebarVisible: props.sidebarVisible,
            sidebarDirection: 'right',
            popupOpen: false,
            popupMessage: null,
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

        const { topic } = this.state;

        const propertiesRequestUrl = `${PROPERTIES_REQUEST_PATH}?topic=${topic}&format=json`;
        fetch(propertiesRequestUrl)
            .then(results => {
                return results.json();
            })
            .then(data => {
                const primaryPropertyId = data.length ? data[0].name_id : null;

                this.setState(prevState => {
                    const { selection } = prevState;
                    selection.primaryPropertyId = primaryPropertyId;

                    this.handleAppStateChange({
                        from: selection.from,
                        to: selection.to,
                        properties: data,
                    });

                    return {
                        loading: true,
                        properties: data,
                        selection,
                    };
                });
            });

        this.resizeApp();
        window.addEventListener('resize', this.resizeApp.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeApp.bind(this));
    }

    getPropertyById(propertyId) {
        const { properties } = this.state;
        const property = properties.find(prop => prop.name_id === propertyId);

        return property;
    }

    /** ************************** sidebar handlers ******************************** */
    getSidebarClass() {
        let classes = '';
        const { sidebarDirection, sidebarVisible } = this.state;

        if (sidebarVisible) {
            classes += 'sidebar-visible';
        } else {
            classes += 'sidebar-hidden';
        }

        classes += ` ${sidebarDirection}`;
        return classes;
    }

    updateSidebarDirection() {
        let direction;

        if (window.innerWidth <= NARROW_WIDTH) {
            direction = 'bottom';
        } else {
            direction = 'right';
        }

        this.setState({
            sidebarDirection: direction,
        });

        setTimeout(() => {
            this.mapRef.current.updateMapSize();
        }, 100);
    }

    handleSidebarToggleClick() {
        const { sidebarVisible } = this.state;
        this.setState({
            sidebarVisible: !sidebarVisible,
        });

        setTimeout(() => {
            this.mapRef.current.updateMapSize();

            this.setState({
                mapSize: this._getMapSize(),
            });
        }, 100);
    }
    /** ************************** sidebar handlers ******************************** */

    /** ****************************** app handlers ******************************** */
    resizeApp() {
        this.updateSidebarDirection();

        this.setState({
            isSmall: window.innerWidth <= NARROW_WIDTH,
            mapSize: this._getMapSize(),
        });
    }

    _getMapSize() {
        if (this.mapRef && this.mapRef.current) {
            const { mapElement } = this.mapRef.current;
            const height = mapElement.clientHeight;
            const width = mapElement.clientWidth;

            return {
                height,
                width,
            };
        }
        return null;
    }

    /**
     * @param options
     * propertyId
     * from
     * to
     * bbox
     */
    handleAppStateChange(options) {
        const { properties, topic } = this.state;
        const requestParameters = {
            topic,
            phenomenon_date_from: options.from.format('YYYY-MM-DD'),
            phenomenon_date_to: options.to.format('YYYY-MM-DD'),
            bbox: options.bbox,
        };

        const props = options.properties || properties;
        if (props.length) {
            const nameIds = props.map(property => property.name_id);
            requestParameters.props = nameIds.join(',');
        }

        sendTimeSeriesRequest(requestParameters)
            .then(response => {
                if (response.status !== 200) {
                    const message = `Looks like there was a problem. Status Code: ${
                        response.status
                    }`;
                    console.log(message);
                    this.notifyUser({
                        text: message,
                        color: 'red',
                    });

                    this.setState({
                        currentValues: {
                            from: null,
                            to: null,
                            frequency: null,
                        },
                        geojsonData: null,
                        isDataValid: false,
                        loading: false,
                    });
                    return;
                }

                response.json().then(data => {
                    const from = data.phenomenon_time_from
                        ? moment(data.phenomenon_time_from).utcOffset(TIME_ZONE)
                        : null;
                    const to = data.phenomenon_time_to
                        ? moment(data.phenomenon_time_to).utcOffset(TIME_ZONE)
                        : null;

                    this.setState({
                        currentValues: {
                            from,
                            to,
                            frequency: data.value_frequency,
                            valueDuration: data.value_duration,
                        },
                        geojsonData: data,
                        isDataValid: Boolean(from && to),
                        loading: false,
                    });
                });
            })
            .catch(error => console.log(error));
    }

    handlePropertyChange(event, data) {
        const primaryPropertyId = data.value;

        this.setState(prevState => {
            const { selection } = prevState;
            selection.primaryPropertyId = primaryPropertyId;

            return {
                selection,
            };
        });
    }

    handleDateRangeChange(from, to) {
        this.setState(prevState => {
            const isPropertyChosen = prevState.selection.primaryPropertyId !== null;
            if (isPropertyChosen) {
                this.handleAppStateChange({
                    from,
                    to,
                });
            }

            const { selection } = prevState;
            selection.from = from;
            selection.to = to;

            return {
                loading: isPropertyChosen,
                selection,
            };
        });
    }

    handleTimeValueChange(time) {
        this.setState(prevState => {
            const from = prevState.currentValues.from.unix();
            const index = (time.unix() - from) / prevState.currentValues.frequency;

            const { selection } = prevState;
            selection.timeValueIndex = index;

            return {
                selection,
            };
        });
    }

    notifyUser(message) {
        this.setState({
            popupOpen: true,
            popupMessage: message.text,
            popupColor: message.color,
        });

        setTimeout(() => {
            this.setState({
                popupOpen: false,
            });
        }, 5000);
    }
    /** ****************************** app handlers ******************************** */

    render() {
        const {
            currentValues,
            geojsonData,
            isDataValid,
            isSmall,
            loading,
            mapSize,
            popupColor,
            popupMessage,
            popupOpen,
            properties,
            selection,
            sidebarVisible,
            sidebarDirection,
            topic,
        } = this.state;

        return (
            <div className="content">
                <Sidebar.Pushable className={this.getSidebarClass()}>
                    <Sidebar
                        as="div"
                        className="control-panel"
                        animation="overlay"
                        direction={sidebarDirection}
                        visible={sidebarVisible}
                    >
                        <div style={sidebarContentStyle}>
                            <MapControls
                                properties={properties}
                                selection={selection}
                                currentValues={currentValues}
                                timeZone={TIME_ZONE}
                                onPropertyChange={this.handlePropertyChange}
                                onDateRangeChange={this.handleDateRangeChange}
                                onTimeValueChange={this.handleTimeValueChange}
                                notifyUser={this.notifyUser}
                            />
                        </div>
                    </Sidebar>

                    <Sidebar.Pusher style={pusherStyle}>
                        <div className={`${this.getSidebarClass()} main-wrapper`}>
                            <Map
                                className="map"
                                ref={this.mapRef}
                                topic={topic}
                                properties={properties}
                                primaryProperty={this.getPropertyById(selection.primaryPropertyId)}
                                currentValues={currentValues}
                                timeZone={TIME_ZONE}
                                data={geojsonData}
                                isSmall={isSmall}
                                mapSize={mapSize}
                                isDataValid={isDataValid}
                                loading={loading}
                                index={selection.timeValueIndex}
                            />

                            <Button
                                className="sidebar-toggle"
                                icon={getSidebarToggleIcon(sidebarDirection, sidebarVisible)}
                                onClick={this.handleSidebarToggleClick}
                                style={getSidebarToggleStyle(sidebarDirection, sidebarVisible)}
                            />
                        </div>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>

                <NotificationPopup open={popupOpen} message={popupMessage} color={popupColor} />

                <style jsx>
                    {`
                        .content {
                            height: calc(100vh - 40px);
                            position: absolute;
                            top: 40px;
                            width: 100%;
                        }
                    `}
                </style>
            </div>
        );
    }
}

MapApp.defaultProps = {
    topic: DEFAULT_TOPIC,
};

MapApp.propTypes = {
    sidebarVisible: PropTypes.bool.isRequired,
    topic: PropTypes.string,
};

export default MapApp;
