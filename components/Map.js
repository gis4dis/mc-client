import React from 'react';
import generalize from 'gis4dis-generalizer'
import FeatureCharts from "./FeatureCharts";
import { Dimmer, Loader } from 'semantic-ui-react';

let ol_Map;
let ol_View;
let ol_layer_Tile;
let ol_layer_Vector;
let ol_source_Vector;
let ol_format_GeoJSON;
let ol_proj;
let ol_source_OSM;
let ol_style_Circle;
let ol_style_Fill;
let ol_style_Stroke;
let ol_style_Style;
let ol_interaction_Select;
let ol_Overlay;

let projection;

const configuration = {
    projection: 'EPSG:3857'
};

const getBaseLayer = () => {
    const baseLayer = new ol_layer_Tile({
        source: new ol_source_OSM()
    });

    baseLayer.on('precompose', function(evt) {
        const ctx = evt.context;
        ctx.fillStyle = '#dddddd';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    });

    baseLayer.on('postcompose', function(evt) {
        const ctx = evt.context;
        evt.context.globalCompositeOperation = 'color';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        evt.fillStyle = '#000000';
        evt.context.globalCompositeOperation = 'source-over';
    });

    return baseLayer;
};

const getGeojsonLayer = (geojson) => {
    const geojsonLayer = new ol_layer_Vector({
        source: new ol_source_Vector({
            projection : 'EPSG:4326'
        })
    });

    return geojsonLayer;
};

class Map extends React.Component {
    mapElement;

    constructor(props) {
        super(props);

        this.state = {
            map: null
        };
    }

    componentDidMount() {
        ol_Map = require('ol/map').default;
        ol_View = require('ol/view').default;
        ol_layer_Tile = require('ol/layer/tile').default;
        ol_layer_Vector = require('ol/layer/vector').default;
        ol_source_Vector = require('ol/source/vector').default;
        ol_format_GeoJSON = require('ol/format/geojson').default;
        ol_proj = require('ol/proj').default;
        ol_source_OSM = require('ol/source/osm').default;
        ol_style_Circle = require('ol/style/circle').default;
        ol_style_Fill = require('ol/style/fill').default;
        ol_style_Stroke = require('ol/style/stroke').default;
        ol_style_Style = require('ol/style/style').default;
        ol_interaction_Select = require('ol/interaction/select').default;
        ol_Overlay = require('ol/overlay').default;

        projection = ol_proj.get(configuration.projection);

        const view = new ol_View({
            projection: projection,
            center: ol_proj.transform([16.62, 49.2], 'EPSG:4326', projection),
            zoom: 13
        });

        const baseLayer = getBaseLayer();

        this.geojsonLayer = getGeojsonLayer();

        const map = new ol_Map({
            target: this.mapElement,
            layers: [
                baseLayer,
                this.geojsonLayer
            ],
            view: view
        });

        let overlay = this.createOverlay();
        map.addOverlay(overlay);

        let selectInteraction = new ol_interaction_Select();
        selectInteraction.on('select', function(evt) {
            let coordinate = evt.mapBrowserEvent.coordinate;

            let feature = evt.target.getFeatures().item(0);
            this.setState({
                selectedFeature: feature
            });

            if (feature) {
                overlay.setPosition(coordinate);
                this._setOverlayVisible(true);
            } else {
                overlay.setPosition(undefined);
                this._setOverlayVisible(false);
            }

        }.bind(this));
        map.addInteraction(selectInteraction);

        this.setState({
            map
        });
    }

    componentWillUnmount() {
        var popup = document.getElementById('popup');
        popup.removeEventListener('mouseenter', this._onOverlayMouseEnter.bind(this));
        popup.removeEventListener('mouseout', this._onOverlayMouseLeave.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isDataValid) {
            let generalization = this._getGeneralization(nextProps);

            if (generalization && this.geojsonLayer) {
                let isDataChange = this.props.data !== nextProps.data;
                this._updateFeatures(generalization.features, isDataChange);

                this.geojsonLayer.setStyle(generalization.style);
            }
        } else {
            this._clearFeatures();
        }
    }

    createOverlay() {
        var popup = document.getElementById('popup');
        popup.style.display = 'none';
        popup.addEventListener('mouseenter', this._onOverlayMouseEnter.bind(this));
        popup.addEventListener('mouseleave', this._onOverlayMouseLeave.bind(this));

        var closer = document.getElementById('popup-closer');

        var overlay = new ol_Overlay({
            element: popup,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            },
            stopEvent: false
        });

        closer.onclick = () => {
            overlay.setPosition(undefined);

            this._setOverlayVisible(false);
            this._setMapInteractionsActive(true);

            closer.blur();
            return false;
        };

        return overlay;
    }

    _onOverlayMouseEnter() {
        this._setMapInteractionsActive(false);
    }

    _onOverlayMouseLeave() {
        this._setMapInteractionsActive(true);
    }

    _setOverlayVisible(visible) {
        var popup = document.getElementById('popup');
        popup.style.display = visible ? 'block' : 'none';
    }

    _setMapInteractionsActive(active) {
        let map = this.state.map;
        if (map) {
            // deactivating all interactions may cause problems
            map.getInteractions().forEach((interaction) => {
                interaction.setActive(active);
            });
        }
    }


    _handleResolutionChange(event) {
        console.log(event);
    }

    _getGeneralization(props) {
        if (this.state.map && props.data && props.data.feature_collection) {
            let view = this.state.map.getView();
            let resolution = view.getResolution();

            let options = {
                property: props.property,
                features: props.data.feature_collection,
                value_idx: props.index,
                resolution: resolution
            };

            return generalize(options);
        }
        return null;
    }

    _updateFeatures(newFeatures, isDataChange) {
        let source = this.geojsonLayer.getSource();

        if (isDataChange) {
            source.clear();
            source.addFeatures(newFeatures);
        } else {
            let currentFeatures = source.getFeatures();
            let newIds = newFeatures.map((feature) => (feature.get('id_by_provider')));
            let matchingIds = [];
            currentFeatures.forEach((feature) => {
                let fid = feature.get('id_by_provider');
                if (!newIds.includes(fid)) {
                    source.removeFeature(feature);
                } else {
                    matchingIds.push(fid);
                }
            });

            let featuresToAdd = newFeatures.filter((feature) => {
                return !matchingIds.includes(feature.get('id_by_provider'));
            });
            if (featuresToAdd.length) {
                source.addFeatures(featuresToAdd);
            }
        }
    }

    _clearFeatures() {
        let source = this.geojsonLayer.getSource();
        source.clear();
    }

    render() {
        return (
            <div className="map-wrap">
                <Dimmer active={ this.props.loading } inverted>
                    <Loader>
                        Loading data...
                    </Loader>
                </Dimmer>

                <div className="map" ref={(d) => this.mapElement = d}> </div>

                { !this.props.loading && !this.props.isDataValid &&
                    <div className="warning-wrap">
                        <div>No data to display</div>
                    </div>
                }

                <div id="popup" className="ol-popup" style={ {display: 'none'} }>
                    <a href="#" id="popup-closer" className="ol-popup-closer"></a>

                    <FeatureCharts
                        feature={ this.state.selectedFeature }
                        timeSettings={ Object.assign(this.props.currentValues, {timeZone: this.props.timeZone}) } />
                </div>

                <style jsx>{`
                    .map-wrap, .map {
                        height: 100%;
                        width: 100%;
                    }
                    @media (max-width:600px) {
                        .map-wrap {
                            height: 100%;
                        }
                    }
                    .ol-popup {
                        position: absolute;
                        background-color: white;
                        -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
                        filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
                        padding: 15px;
                        border-radius: 10px;
                        border: 1px solid #cccccc;
                        bottom: 12px;
                        left: -50px;
                        min-width: 280px;
                    }
                    .ol-popup:after, .ol-popup:before {
                        top: 100%;
                        border: solid transparent;
                        content: " ";
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
                    .ol-popup-closer {
                        text-decoration: none;
                        position: absolute;
                        top: 2px;
                        right: 8px;
                    }
                    .ol-popup-closer:after {
                        content: "✖";
                    }
                    .warning-wrap {
                        background-color: rgba(255, 255, 255, 0.8);
                        border: solid 3px rgba(0, 0, 0, 0.2);
                        border-radius: 10px;
                        color: rgba(0, 0, 0, 0.6);
                        font-weight: bolder;
                        text-transform: uppercase;
                        padding: 10px;
                        text-align: center;

                        height: 46px;
                        width: 30%;

                        position: absolute;
                        top:0;
                        bottom: 0;
                        left: 0;
                        right: 0;

                        margin: auto;
                    }
                    .warning-wrap > * {
                        vertical-align: middle;
                    }
                    `}</style>

                <style jsx global>{`
                    .map-wrap .ui.blue.buttons.zoom .button:focus {
                        background-color: #2185d0;
                    }
                `}</style>

            </div>
        );
    }
}

export default Map;