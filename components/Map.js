import React from 'react';

let ol_Map;
let ol_View;
let ol_layer_Tile;
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

class Map extends React.Component {
    mapElement;

    constructor(props) {
        super(props);
        this.state = {
            map: null
        };
    }

    render() {
        return (
            <div className="map-wrap">
                <div className="map" ref={(d) => this.mapElement = d}> </div>
                <style jsx>{`
                    .map-wrap, .map {
                      width: 100%;
                      height: 100%;
                    }
                    @media (max-width:600px) {
                      .map-wrap {
                        height: 100%;
                        padding-bottom: 4rem;
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

    componentDidMount() {
        ol_Map = require('ol/map').default;
        ol_View = require('ol/view').default;
        ol_layer_Tile = require('ol/layer/tile').default;
        ol_proj = require('ol/proj').default;
        ol_source_OSM = require('ol/source/osm').default;

        projection = ol_proj.get(configuration.projection);

        const view = new ol_View({
            projection: projection,
            center: ol_proj.transform([16.62, 49.2], 'EPSG:4326', projection),
            zoom: 11
        });

        const baseLayer = getBaseLayer();

        const map = new ol_Map({
            target: this.mapElement,
            layers: [
                baseLayer
            ],
            view: view
        });

        this.setState({
            map
        });
    }
}

export default Map;