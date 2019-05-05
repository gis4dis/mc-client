import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import generalize from 'gis4dis-generalizer';
import { Button, Dimmer, Icon, Loader, Message } from 'semantic-ui-react';
import FeatureCharts from './FeatureCharts';
import FullscreenFeatureCharts from './FullscreenFeatureCharts';

let OLMap;
let OLView;
let OLLayerTile;
let OLLayerVector;
let OLSourceVector;
let olProj;
let OLSourceOSM;
let OLInteractionSelect;
let OLOverlay;

let projection;

const configuration = {
    projection: 'EPSG:3857',
};

const getBaseLayer = () => {
    const baseLayer = new OLLayerTile({
        source: new OLSourceOSM(),
    });

    baseLayer.on('precompose', evt => {
        const ctx = evt.context;
        ctx.fillStyle = '#dddddd';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    });

    baseLayer.on('postcompose', evt => {
        const ctx = evt.context;
        ctx.globalCompositeOperation = 'color';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#000000';
        ctx.globalCompositeOperation = 'source-over';
    });

    return baseLayer;
};

const getGeojsonLayer = () => {
    const geojsonLayer = new OLLayerVector({
        source: new OLSourceVector({
            projection: 'EPSG:4326',
        }),
    });

    return geojsonLayer;
};

class Map extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            map: null,
            fullscreenFeatureCharts: false,
        };
    }

    componentDidMount() {
        OLMap = require('ol/map').default;
        OLView = require('ol/view').default;
        OLLayerTile = require('ol/layer/tile').default;
        OLLayerVector = require('ol/layer/vector').default;
        OLSourceVector = require('ol/source/vector').default;
        olProj = require('ol/proj').default;
        OLSourceOSM = require('ol/source/osm').default;
        OLInteractionSelect = require('ol/interaction/select').default;
        OLOverlay = require('ol/overlay').default;

        projection = olProj.get(configuration.projection);

        const view = new OLView({
            projection,
            center: olProj.transform([16.62, 49.2], 'EPSG:4326', projection),
            zoom: 13,
        });

        const baseLayer = getBaseLayer();

        this.geojsonLayer = getGeojsonLayer();

        const map = new OLMap({
            target: this.mapElement,
            layers: [baseLayer, this.geojsonLayer],
            view,
        });

        const overlay = this.createOverlay();
        map.addOverlay(overlay);

        const selectInteraction = new OLInteractionSelect({
            style: (feature, resolution) => {
                const style = this.geojsonLayer.getStyle();
                return style(feature, resolution);
            },
        });
        selectInteraction.on('select', evt => {
            const { coordinate } = evt.mapBrowserEvent;

            const feature = evt.target.getFeatures().item(0);
            this.setState({
                selectedFeature: feature,
            });

            const { isSmall } = this.props;
            overlay.setPosition(feature && !isSmall ? coordinate : undefined);
            this._setOverlayVisible(!!feature);
        });
        map.addInteraction(selectInteraction);
        this._selectInteraction = selectInteraction;

        this.setState({
            map,
        });

        this._closeOverlay = this._closeOverlay.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { data, vgiData, index, isDataValid, primaryProperty, properties, topic } = nextProps;
        const { map } = this.state;
        if (isDataValid) {
            const view = map.getView();
            const resolution = view.getResolution();
            const featureCollection = data.feature_collection;
            const options = {
                topic,
                properties,
                primary_property: primaryProperty.name_id,
                features: featureCollection,
                vgi_features: vgiData,
                value_idx: index,
                resolution,
            };
            const generalization = generalize(options);
            const { data: prevData, primaryProperty: prevPrimaryProperty } = this.props;

            if (generalization && this.geojsonLayer) {
                const isDataChange = prevData !== data;
                const isPropertyChange = prevPrimaryProperty !== primaryProperty;
                this._updateFeatures(generalization.features, isDataChange || isPropertyChange);

                this.geojsonLayer.setStyle(generalization.style);
            }
        } else {
            this._clearFeatures();
        }
    }

    componentWillUnmount() {
        const popup = document.getElementById('popup');
        popup.removeEventListener('mouseenter', this._onOverlayMouseEnter.bind(this));
        popup.removeEventListener('mouseout', this._onOverlayMouseLeave.bind(this));
    }

    mapElement;

    updateMapSize() {
        const { map } = this.state;
        if (map) {
            map.updateSize();
        }
    }

    /** *********************** overlay ********************************************************** */
    createOverlay() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none';
        popup.addEventListener('mouseenter', this._onOverlayMouseEnter.bind(this));
        popup.addEventListener('mouseleave', this._onOverlayMouseLeave.bind(this));

        const overlay = new OLOverlay({
            id: 'featurePopup',
            element: popup,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
            stopEvent: false,
        });

        return overlay;
    }

    _closeOverlay(event) {
        const { map } = this.state;
        if (map) {
            const overlay = map.getOverlayById('featurePopup');

            overlay.setPosition(undefined);

            this._setOverlayVisible(false);
            this._setMapInteractionsActive(true);
            this._selectInteraction.getFeatures().clear();
        }
        event.target.blur();
    }

    _onOverlayMouseEnter() {
        this._setMapInteractionsActive(false);
    }

    _onOverlayMouseLeave() {
        this._setMapInteractionsActive(true);
    }

    _setOverlayVisible(visible) {
        const popup = document.getElementById('popup');
        popup.style.display = visible && !this._isSmallMap() ? 'block' : 'none';

        this.setState({
            fullscreenFeatureCharts: visible && this._isSmallMap(),
        });
    }

    _isSmallMap() {
        const { mapSize } = this.props;
        let { isSmall } = this.props;
        if (!isSmall) {
            const { height, width } = mapSize;
            isSmall = height < 323 || width < 532;
        }
        return isSmall;
    }
    /** *********************** overlay ********************************************************** */

    _setMapInteractionsActive(active) {
        const { map } = this.state;
        if (map) {
            // deactivating all interactions may cause problems
            map.getInteractions().forEach(interaction => {
                interaction.setActive(active);
            });
        }
    }

    /*
    _handleResolutionChange(event) {
        console.log(event);
    }
    */

    _updateFeatures(newFeatures, isDataChange) {
        const source = this.geojsonLayer.getSource();

        if (isDataChange) {
            source.clear();
            source.addFeatures(newFeatures);
        } else {
            const currentFeatures = source.getFeatures();
            const newIds = newFeatures.map(feature => feature.get('id'));
            const matchingIds = [];
            currentFeatures.forEach(feature => {
                const fid = feature.get('id');
                if (!newIds.includes(fid)) {
                    source.removeFeature(feature);
                } else {
                    matchingIds.push(fid);
                }
            });

            const featuresToAdd = newFeatures.filter(feature => {
                return !matchingIds.includes(feature.get('id'));
            });
            if (featuresToAdd.length) {
                source.addFeatures(featuresToAdd);
            }
        }
    }

    _clearFeatures() {
        const source = this.geojsonLayer.getSource();
        source.clear();
    }

    render() {
        const { fullscreenFeatureCharts, selectedFeature } = this.state;
        const { currentValues, loading, isDataValid, primaryProperty, timeZone } = this.props;

        return (
            <div className="map-wrap">
                <FullscreenFeatureCharts
                    chartId="1"
                    active={fullscreenFeatureCharts}
                    feature={selectedFeature}
                    property={primaryProperty}
                    timeSettings={Object.assign(currentValues, { timeZone })}
                    onClose={this._closeOverlay}
                />

                <div id="popup" className="popup ol-popup" style={{ display: 'none' }}>
                    <Button icon="close" basic floated="right" onClick={this._closeOverlay} />

                    <FeatureCharts
                        chartId="2"
                        feature={selectedFeature}
                        property={primaryProperty}
                        timeSettings={Object.assign(currentValues, {
                            timeZone,
                        })}
                    />
                </div>

                <Dimmer active={loading} inverted>
                    <Loader>Loading data...</Loader>
                </Dimmer>

                <div
                    className="map"
                    ref={d => {
                        this.mapElement = d;
                    }}
                >
                    {' '}
                </div>

                {!loading && !isDataValid && (
                    <Message
                        icon
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            height: '86px',
                            width: '265px',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            margin: 'auto',
                        }}
                    >
                        <Icon name="ban" />
                        <Message.Content>
                            <Message.Header>No data</Message.Header>
                            No data found for given date range and property.
                        </Message.Content>
                    </Message>
                )}

                <style jsx>
                    {`
                        .map-wrap,
                        .map {
                            height: 100%;
                            width: 100%;
                        }
                        @media (max-width: 600px) {
                            .map-wrap {
                                height: 100%;
                            }
                        }

                        .popup {
                            background-color: white;
                            color: #000;
                            padding: 15px;
                        }

                        .ol-popup {
                            position: absolute;
                            -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
                            filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
                            border-radius: 10px;
                            border: 1px solid #cccccc;
                            bottom: 12px;
                            left: -50px;
                            min-width: 280px;
                        }
                        .ol-popup:after,
                        .ol-popup:before {
                            top: 100%;
                            border: solid transparent;
                            content: ' ';
                            height: 0;
                            width: 0;
                            position: absolute;
                            pointer-events: none;
                        }
                        .ol-popup:after {
                            border-top-color: white;
                            border-width: 10px;
                            left: 48px;
                            margin-left: -10px;
                        }
                        .ol-popup:before {
                            border-top-color: #cccccc;
                            border-width: 11px;
                            left: 48px;
                            margin-left: -11px;
                        }
                    `}
                </style>

                <style jsx global>
                    {`
                        .map-wrap .ui.blue.buttons.zoom .button:focus {
                            background-color: #2185d0;
                        }
                    `}
                </style>
            </div>
        );
    }
}

Map.defaultProps = {
    data: null,
    index: 0,
    isDataValid: false,
    mapSize: null,
    primaryProperty: null,
    vgiData: null,
};

Map.propTypes = {
    currentValues: PropTypes.shape({
        from: momentPropTypes.momentObj,
        to: momentPropTypes.momentObj,
        frequency: PropTypes.number,
    }).isRequired,
    data: PropTypes.shape({
        feature_collection: PropTypes.object,
        phenomenon_time_from: PropTypes.string,
        phenomenon_time_to: PropTypes.string,
        properties: PropTypes.arrayOf(PropTypes.string),
        value_frequency: PropTypes.number,
    }),
    vgiData: PropTypes.shape({
        feature: PropTypes.array,
        type: PropTypes.string,
    }),
    index: PropTypes.number,
    isDataValid: PropTypes.bool,
    isSmall: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    mapSize: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
    }),
    primaryProperty: PropTypes.shape({
        name: PropTypes.string,
        name_id: PropTypes.string,
        unit: PropTypes.string,
    }),
    properties: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            name_id: PropTypes.string,
            unit: PropTypes.string,
        })
    ).isRequired,
    timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    topic: PropTypes.string.isRequired,
};

export default Map;
