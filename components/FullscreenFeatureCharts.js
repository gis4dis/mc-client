import React, { Component } from 'react';
import FeatureCharts from './FeatureCharts';
import { Dimmer } from 'semantic-ui-react';

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

    render() {
        return <Dimmer active={ this.props.active } page onClickOutside={ this.props.onClose }>
            <div className="popup fullscreen">
                <a href="#" className="popup-closer" onClick={ this.props.onClose }></a>

                <FeatureCharts
                    chartId={ this.props.chartId }
                    height={ this.state.height - 50 }
                    width={ this.state.width }
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