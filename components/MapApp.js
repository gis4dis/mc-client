import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Sidebar } from 'semantic-ui-react';
import Map from './Map';
import MapControls from './MapControls';
import NotificationPopup from './NotificationPopup';
import TimeSliderCollapsible from './timeControls/TimeSliderCollapsible';
import { getEndOfPeriod, getStartOfPeriod } from '../utils/time';

/** ********************** styles ************************************** */
const NARROW_WIDTH = 700;

const refreshViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

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
const VGI_OBSERVATIONS_REQUEST_PATH = '/api/v2/vgi_observations/';

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

/**
 * @param params
 */
const sendVGIObservationsRequest = params => {
    const paramParts = [];
    Object.keys(params).forEach(key => {
        if (params[key] != null) {
            paramParts.push(`${key}=${params[key]}`);
        }
    });

    const requestUrl = `${VGI_OBSERVATIONS_REQUEST_PATH}?${paramParts.join('&')}`;
    return fetch(requestUrl);
};

class MapApp extends React.Component {
    constructor(props) {
        super(props);

        moment.locale('en-gb');
        const now = moment();

        const from = getStartOfPeriod(now.clone(), 'day', TIME_ZONE).subtract(INITIAL_RANGE_LENGTH);
        const to = getEndOfPeriod(now.clone(), 'day', TIME_ZONE).subtract(1, 'days');

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
                time: null,
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
        this.handleSliderCollapsedChange = this.handleSliderCollapsedChange.bind(this);

        this.resizeApp = this.resizeApp.bind(this);
        this.notifyUser = this.notifyUser.bind(this);

        this.handleSidebarToggleClick = this.handleSidebarToggleClick.bind(this);

        this.mapRef = React.createRef();
    }

    componentDidMount() {
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
        window.addEventListener('resize', this.resizeApp);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeApp);
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

        this.resizeMap();
    }

    handleSidebarToggleClick() {
        const { sidebarVisible } = this.state;
        this.setState({
            sidebarVisible: !sidebarVisible,
        });

        this.resizeMap();
    }
    /** ************************** sidebar handlers ******************************** */

    /** ****************************** app handlers ******************************** */
    resizeApp() {
        refreshViewportHeight();

        this.updateSidebarDirection();

        this.setState({
            isSmall: window.innerWidth <= NARROW_WIDTH,
            mapSize: this._getMapSize(),
        });
    }

    resizeMap() {
        setTimeout(() => {
            this.mapRef.current.updateMapSize();

            this.setState({
                mapSize: this._getMapSize(),
            });
        }, 100);
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
        const { isDataValid, isSmall, properties, topic } = this.state;
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

        if (isSmall && isDataValid) {
            this.resizeMap();
        }

        let requestId;
        if (this._lastRequestId === undefined) {
            requestId = 0;
        } else {
            requestId = this._lastRequestId + 1;
        }
        this._lastRequestId = requestId;

        Promise.all([
            sendTimeSeriesRequest(requestParameters),
            sendVGIObservationsRequest(requestParameters),
        ])
            .then(responses => {
                if (requestId === this._lastRequestId) {
                    const notOkResponse = responses.find(response => response.status !== 200);
                    if (notOkResponse) {
                        const message = `Looks like there was a problem. Status Code: ${notOkResponse.status}`;
                        console.log(message);
                        this.notifyUser({
                            text: message,
                            color: 'red',
                        });

                        this.setState({
                            currentValues: {
                                from: null,
                                to: null,
                                time: null,
                                frequency: null,
                            },
                            geojsonData: null,
                            isDataValid: false,
                            loading: false,
                        });
                    } else {
                        const [timeSeriesResponse, vgiResponse] = responses;
                        Promise.all([timeSeriesResponse.json(), vgiResponse.json()]).then(jsons => {
                            const [data, vgiData] = jsons;
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
                                    time: from,
                                    frequency: data.value_frequency,
                                    valueDuration: data.value_duration,
                                },
                                geojsonData: data,
                                vgiData,
                                isDataValid: Boolean(from && to),
                                loading: false,
                            });

                            if (isSmall && Boolean(from && to)) {
                                this.resizeMap();
                            }
                        });
                    }
                }
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

            const { currentValues, selection } = prevState;
            currentValues.time = time;
            selection.timeValueIndex = index;

            return {
                currentValues,
                selection,
            };
        });
    }

    handleSliderCollapsedChange(collapsed) {
        this.setState({
            sliderCollapsed: collapsed,
        });

        this.resizeMap();
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
            vgiData,
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
            sliderCollapsed,
            topic,
        } = this.state;

        const { switchToMapHandler } = this.props;

        let sliderHeight = 0;
        if (isDataValid && isSmall && !loading) {
            sliderHeight = sliderCollapsed ? 35 : 113;
        }

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
                                loading={loading}
                                timeZone={TIME_ZONE}
                                onDateRangeChange={this.handleDateRangeChange}
                                onPropertyChange={this.handlePropertyChange}
                                onTimeValueChange={this.handleTimeValueChange}
                                notifyUser={this.notifyUser}
                                isFullscreen={isSmall}
                                switchToMapHandler={switchToMapHandler}
                            />
                        </div>
                    </Sidebar>

                    <Sidebar.Pusher style={pusherStyle}>
                        <div className={`${this.getSidebarClass()} main-wrapper`}>
                            <div style={{ height: `calc(100% - ${sliderHeight}px)` }}>
                                <Map
                                    className="map"
                                    ref={this.mapRef}
                                    topic={topic}
                                    properties={properties}
                                    primaryProperty={this.getPropertyById(
                                        selection.primaryPropertyId
                                    )}
                                    currentValues={currentValues}
                                    timeZone={TIME_ZONE}
                                    data={geojsonData}
                                    vgiData={vgiData}
                                    isSmall={isSmall}
                                    mapSize={mapSize}
                                    isDataValid={isDataValid}
                                    loading={loading}
                                    index={selection.timeValueIndex}
                                />
                            </div>

                            {isDataValid && isSmall && !loading && (
                                <div className="inline-slider">
                                    <TimeSliderCollapsible
                                        currentValues={currentValues}
                                        loading={loading}
                                        onValueChange={this.handleTimeValueChange}
                                        onCollapsedChange={this.handleSliderCollapsedChange}
                                        timeZone={TIME_ZONE}
                                    />
                                </div>
                            )}

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
                            height: calc(var(--vh, 1vh) * 100 - 40px);
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
    switchToMapHandler: PropTypes.func.isRequired,
    sidebarVisible: PropTypes.bool.isRequired,
    topic: PropTypes.string,
};

export default MapApp;
