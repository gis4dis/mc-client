import React from 'react';

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
            projection : 'EPSG:3857'
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

    /***************************** fake generalization **********************/
    generalize(property, features, valueIndex, resolution) {
        let style = this._getStyleFunction(valueIndex);
        return {
            features: features,
            style: style
        };
    }

    _getStyleFunction(index) {
        return this.layerStyleFunction.bind(this, index);
    }

    layerStyleFunction(index, feature, resolution) {
        let value = feature.get('property_values')[index];
        let color;
        let radius;

        if (value < 2) {
            color = 'rgba(0, 0, 255, 0.6)';
            radius = 5;
        } else if (value < 5) {
            color = 'rgba(0, 255, 0, 0.6)';
            radius = 7;
        } else if (value < 10) {
            color = 'rgba(255, 255, 0, 0.6)';
            radius = 9;
        } else if (value < 15) {
            color = 'rgba(255, 128, 0, 0.6)';
            radius = 11;
        } else {
            color = 'rgba(255, 0, 0, 0.6)';
            radius = 11;
        }

        let style = new ol_style_Style({
            image: new ol_style_Circle({
                radius: radius,
                snapToPixel: false,
                fill: new ol_style_Fill({color: color}),
                stroke: new ol_style_Stroke({color: color, width: 1})
            })
        });

        return style;
    }
    /***************************** fake generalization **********************/

    getFeatures(data) {
        if (ol_format_GeoJSON) {
            let format = new ol_format_GeoJSON({
                defaultDataProjection: 'EPSG:4326'
            });
            let features = format.readFeatures(data,  {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            return features;
        }
        return null;
    }

    render() {
        let generalization;
        if (this.state.map && this.props.data) {
            let allFeatures = this.getFeatures(this.props.data);
            let view = this.state.map.getView();
            let resolution = view.getResolution();

            generalization = this.generalize(this.props.property, allFeatures, this.props.index, resolution);
        }

        if (generalization && this.geojsonLayer) {
            let source = this.geojsonLayer.getSource();
            source.clear();
            source.addFeatures(generalization.features);

            this.geojsonLayer.setStyle(generalization.style);
        }

        return (
            <div className="map-wrap">
                <div className="map" ref={(d) => this.mapElement = d}> </div>
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