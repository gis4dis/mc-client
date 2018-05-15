import React from 'react';
import moment from 'moment';

class TimeSlider extends React.Component {
    constructor(props) {
        super(props);

        let min = props.from.unix();
        let max = props.to.unix();

        let step = props.frequency ? props.frequency : 1;

        this.state = {
            min: min,
            max: max,
            step: step,
            value: min
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        var time = parseInt(event.target.value);
        this.setState({
            value: time
        });

        if (this.props.callback) {
            var timeDate = moment.unix(time);
            this.props.callback(timeDate);
        }
    }

    valueToString(value) {
        return moment(value).format('L LT Z');
    }

    render() {
        return <div className="timeSlider">
            <div className="currentValue">
                { moment.unix(this.state.value).format('L LT Z') }
            </div>

            <div className="sliderContainer">
                <input type="range"
                        className="slider"
                        min={ this.state.min }
                        max={ this.state.max }
                        step={ this.state.step }
                        value={ this.state.value }
                        onChange={ this.onChange }/>
            </div>

            <style jsx>{`
                .timeSlider {
                    margin: 8px 0;
                }

                .currentValue {
                    color: #66ff33;
                    text-align: right;
                }

                .sliderContainer {
                    margin: 8px 0 16px;
                }

                .slider {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 8px;
                    border-radius: 5px;
                    background: #ddd;
                    outline: none;
                    -webkit-transition: .2s;
                    transition: opacity .2s;
                }

                .slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #66ff33;
                    cursor: pointer;
                }

                .slider::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #4CAF50;
                    cursor: pointer;
                }
            `}</style>
        </div>
    }
}

export default TimeSlider;