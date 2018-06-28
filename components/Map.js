import React from 'react';
import generalize from 'gis4dis-generalizer'

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

        this.setState({
            map
        });
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
        let currentFeatures = source.getFeatures();
        let newIds = newFeatures.map((feature) => (feature.get('id_by_provider')));
        let matchingIds = [];
        currentFeatures.forEach((feature) => {
            let fid = feature.get('id_by_provider');
            if (!newIds.includes(fid)) {
                source.removeFeature(feature);
            } else {
                if (isDataChange) {
                    // TODO handle possible change in property_values (= new geojson)
                }
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

    _clearFeatures() {
        let source = this.geojsonLayer.getSource();
        source.clear();
    }

    render() {
        return (
            <div className="map-wrap">
                <div className="map" ref={(d) => this.mapElement = d}> </div>

                { !this.props.isDataValid && <div className="warning-wrap">
                        <div>No data to display</div>
                    </div> }

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