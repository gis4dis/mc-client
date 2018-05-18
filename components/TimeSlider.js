import React from 'react';
import moment from 'moment';
import { Button } from 'semantic-ui-react';

class TimeSlider extends React.Component {
    constructor(props) {
        super(props);

        let min = props.from.unix();
        let max = props.to.unix();

        this.state = {
            min: min,
            max: max,
            value: min,
            isPlaying: false
        };

        this.onChange = this.onChange.bind(this);

        this.togglePlay = this.togglePlay.bind(this);

        this.moveStepBack = this.moveStepBack.bind(this);
        this.moveStepForward = this.moveStepForward.bind(this);
    }

    onChange(event) {
        let time = parseInt(event.target.value);
        this.setState({
            value: time
        });

        if (this.props.callback) {
            let timeDate = moment.unix(time);
            this.props.callback(timeDate);
        }
    }

    togglePlay() {
        if (this.timerId) {
            this._clearTimer();
        } else {
            this.timerId = setInterval(
                () => this.moveStepForward(),
                1000
            );
        }

        this.setState((prevState, props) => ({
            isPlaying: !prevState.isPlaying
        }));
    }

    _clearTimer() {
        clearInterval(this.timerId);
        this.timerId = null;
    }

    moveStepBack() {
        this.setState((prevState, props) => {
            let time = parseInt(prevState.value);
            let step = parseInt(props.frequency || 1);
            let newValue = time - step;

            if (newValue < prevState.min) {
                newValue = prevState.min;
            }

            if (time !== newValue) {
                if (props.callback) {
                    let timeDate = moment.unix(newValue);
                    props.callback(timeDate);
                }
            }

            return {
                value: newValue
            };
        });
    }

    moveStepForward() {
        this.setState((prevState, props) => {
            let time = parseInt(prevState.value);
            let step = parseInt(props.frequency || 1);
            let newValue = time + step;

            if (newValue > prevState.max) {
                newValue = prevState.max;
            }

            if (this.timer && newValue === prevState.max) {
                this._clearTimer();
            }

            if (time !== newValue) {
                if (props.callback) {
                    let timeDate = moment.unix(newValue);
                    props.callback(timeDate);
                }
            }

            return {
                value: newValue
            };
        });
    }

    disableStepBackButton() {
        //TODO handle disabling buttons
    }

    disableStepForwardButton() {
        //TODO handle disabling buttons
    }

    valueToString(value) {
        return moment(value).format('L LT Z');
    }

    render() {
        const isPlaying = this.state.isPlaying;
        const playPauseIcon = isPlaying ? 'pause' : 'play';

        return <div className="timeSlider">
            <div className="controlButtons">

                <Button icon={ playPauseIcon } onClick={ this.togglePlay }/>
                <Button icon='step backward' onClick={ this.moveStepBack }/>
                <Button icon='step forward' onClick={ this.moveStepForward }/>
            </div>

            <div className="currentValue">
                { moment.unix(this.state.value).format('L LT Z') }
            </div>

            <div className="sliderContainer">
                <input type="range"
                        className="slider"
                        min={ this.state.min }
                        max={ this.state.max }
                        step={ this.props.frequency }
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