import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Dimmer, Button } from 'semantic-ui-react';
import FeatureCharts from './FeatureCharts';

const DEFAULT_CHART_HEIGHT = 286;
const DEFAULT_CHART_WIDTH = 500;

class FullscreenFeatureCharts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            height: 0,
            width: 0,
        };
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
            width: window.innerWidth,
        });
    }

    _getChartSize() {
        let height = DEFAULT_CHART_HEIGHT;
        let width = DEFAULT_CHART_WIDTH;

        const { height: currentHeight, width: currentWidth } = this.state;

        const isLower = currentHeight < height;
        const isNarrower = currentWidth < width;

        if (isLower && !isNarrower) {
            const ratio = currentHeight / height;

            height = currentHeight;
            width *= ratio;
        } else if (isLower && isNarrower) {
            const heightRatio = currentHeight / height;
            const widthRatio = currentWidth / width;

            if (heightRatio <= widthRatio) {
                width *= heightRatio;
                height = currentHeight;
            } else {
                height *= widthRatio;
                width = currentWidth;
            }
        } else if (!isLower && isNarrower) {
            const ratio = currentWidth / width;

            height *= ratio;
            width = currentWidth;
        }

        return {
            height,
            width,
        };
    }

    render() {
        const { active, chartId, feature, onClose, property, timeSettings } = this.props;
        const { height, width } = this._getChartSize();

        return (
            <Dimmer active={active} page onClickOutside={onClose}>
                <div className="popup fullscreen">
                    <Button className="popup-closer" onClick={onClose} />

                    <FeatureCharts
                        chartId={chartId}
                        height={height - 50}
                        width={width}
                        feature={feature}
                        property={property}
                        timeSettings={timeSettings}
                    />
                </div>
                <style jsx>
                    {`
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
                            content: '✖';
                        }

                        .popup.fullscreen .popup-closer {
                            top: 8px;
                            right: 8px;
                        }
                    `}
                </style>
            </Dimmer>
        );
    }
}

FullscreenFeatureCharts.defaultProps = {
    active: false,
    feature: null,
    property: null,
};

FullscreenFeatureCharts.propTypes = {
    active: PropTypes.bool,
    chartId: PropTypes.string.isRequired,
    feature: PropTypes.instanceOf(),
    onClose: PropTypes.func.isRequired,
    property: PropTypes.shape({
        name: PropTypes.string,
        name_id: PropTypes.string,
        unit: PropTypes.string,
    }),
    timeSettings: PropTypes.shape({
        from: PropTypes.instanceOf(moment.Moment),
        to: PropTypes.instanceOf(moment.Moment),
        timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
};

export default FullscreenFeatureCharts;
