import React, { Component } from 'react';
import FeatureCharts from './FeatureCharts';
import { Dimmer } from 'semantic-ui-react';

const DEFAULT_CHART_HEIGHT = 286;
const DEFAULT_CHART_WIDTH = 500;

class FullscreenFeatureCharts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            height: 0,
            width: 0
        }
    }

    componentDidMount() {
        this.setSize();
        window.addEventListener('resize', this.setSize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setSize.bind(this));
    }

    setSize() {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth
        });
    }

    _getChartSize() {
        let height = DEFAULT_CHART_HEIGHT;
        let width = DEFAULT_CHART_WIDTH;

        let currentHeight = this.state.height;
        let currentWidth = this.state.width;

        let isLower = currentHeight < height;
        let isNarrower = currentWidth < width;

        if (isLower && !isNarrower) {
            let ratio = currentHeight / height;

            height = currentHeight;
            width *= ratio;
        } else if (isLower && isNarrower) {
            let heightRatio = currentHeight / height;
            let widthRatio = currentWidth / width;

            if (heightRatio <= widthRatio) {
                width *= heightRatio;
                height = currentHeight;
            } else {
                height *= widthRatio;
                width = currentWidth
            }
        } else if (!isLower && isNarrower) {
            let ratio = currentWidth / width;

            height *= ratio;
            width = currentWidth;
        }

        return {
            height: height,
            width: width
        };
    }

    render() {
        let { height, width } = this._getChartSize();

        return <Dimmer active={ this.props.active } page onClickOutside={ this.props.onClose }>
            <div className="popup fullscreen">
                <a href="#" className="popup-closer" onClick={ this.props.onClose }></a>

                <FeatureCharts
                    chartId={ this.props.chartId }
                    height={ height - 50 }
                    width={ width }
                    feature={ this.props.feature }
                    property={ this.props.property }
                    timeSettings={ this.props.timeSettings }/>
            </div>
            <style jsx>{`
                .popup {
                    background-color: white;
                    color: #000;
                    padding: 15px;
                }

                .popup.fullscreen {
                    overflow: hidden;
                    padding: 25px 0;
                    position: relative;
                    width: 100%;
                }

                .popup-closer {
                    text-decoration: none;
                    position: absolute;
                    top: 2px;
                    right: 8px;
                }
                .popup-closer:after {
                    content: "✖";
                }

                .popup.fullscreen .popup-closer {
                    top: 8px;
                    right: 8px;
                }
            `}</style>
        </Dimmer>
    }
}

export default FullscreenFeatureCharts;