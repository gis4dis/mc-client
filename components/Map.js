import React from 'react';

let ol_Map;
let ol_View;
let ol_layer_Tile;
let ol_layer_Vector;
let ol_source_Vector;
let ol_format_GeoJSON;
let ol_proj;
let ol_source_OSM;

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

        projection = ol_proj.get(configuration.projection);

        const view = new ol_View({
            projection: projection,
            center: ol_proj.transform([16.62, 49.2], 'EPSG:4326', projection),
            zoom: 11
        });

        const baseLayer = getBaseLayer();

        this.geojsonLayer = getGeojsonLayer();
        this.geojsonLayer.setStyle(this.props.dataStyle);

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

    processGeojsonData(geojson) {
        let format = new ol_format_GeoJSON({
            defaultDataProjection: 'EPSG:4326'
        });
        let features = format.readFeatures(geojson,  {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });

        let source = this.geojsonLayer.getSource();
        source.clear();
        source.addFeatures(features);
    }

    render() {
        if (this.props.data) {
            this.processGeojsonData(this.props.data);
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