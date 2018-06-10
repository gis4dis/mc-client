import React from 'react';
import moment from 'moment';
import { Button } from 'semantic-ui-react';

class TimeSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.from,
            isPlaying: false
        };

        this.onChange = this.onChange.bind(this);

        this.togglePlay = this.togglePlay.bind(this);
        this.stopButtonClick = this.stopButtonClick.bind(this);

        this.moveStepBack = this.moveStepBack.bind(this);
        this.moveStepForward = this.moveStepForward.bind(this);

        this.setValueToMin = this.setValueToMin.bind(this);
        this.setValueToMax = this.setValueToMax.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.from !== this.props.from || nextProps.to !== this.props.to) {
            this.setState({
                value: nextProps.from
            });
        }
    }

    onChange(event) {
        let time = parseInt(event.target.value);
        this.setState({
            value: time
        });

        if (this.props.callback) {
            let timeDate = moment.unix(time).utcOffset(this.props.timeZone);
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

    stopButtonClick() {
        if (this.timerId) {
            this._clearTimer();
        }

        if (this.props.callback) {
            let timeDate = moment.unix(this.props.from).utcOffset(this.props.timeZone);
            this.props.callback(timeDate);
        }

        this.setState({
            isPlaying: false,
            value: this.props.from
        });
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

            if (newValue < props.from) {
                newValue = props.from;
            }

            if (time !== newValue) {
                if (props.callback) {
                    let timeDate = moment.unix(newValue).utcOffset(this.props.timeZone);
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

            if (newValue > props.to) {
                newValue = props.to;
            }

            let stopPlaying;
            if (this.timerId && newValue === props.to) {
                this._clearTimer();
                stopPlaying = true;
            }

            if (time !== newValue) {
                if (props.callback) {
                    let timeDate = moment.unix(newValue).utcOffset(this.props.timeZone);
                    props.callback(timeDate);
                }
            }

            return {
                isPlaying: stopPlaying ? false : prevState.isPlaying,
                value: newValue
            };
        });
    }

    setValueToMin() {
        if (this.props.callback) {
            let timeDate = moment.unix(this.props.from).utcOffset(this.props.timeZone);
            this.props.callback(timeDate);
        }

        this.setState({
            value: this.props.from
        });
    }

    setValueToMax() {
        if (this.props.callback) {
            let timeDate = moment.unix(this.props.to).utcOffset(this.props.timeZone);
            this.props.callback(timeDate);
        }

        this.setState({
            value: this.props.to
        });
    }

    _isMin() {
        return this.state.value === this.props.from;
    }

    _isMax() {
        return this.state.value === this.props.to;
    }

    render() {
        const isPlaying = this.state.isPlaying;
        const playPauseIcon = isPlaying ? 'pause' : 'play';

        return <div className="timeSlider">
            <div className="currentValue">
                { moment.unix(this.state.value).utcOffset(this.props.timeZone).format('L LT Z') }
            </div>

            <div className="sliderContainer">
                <input type="range"
                        className="slider"
                        min={ this.props.from }
                        max={ this.props.to }
                        step={ this.props.frequency }
                        value={ this.state.value }
                        onChange={ this.onChange }/>
            </div>

            <div className="controlButtons">
                <Button icon={ playPauseIcon }
                        color="teal"
                        circular
                        inverted
                        onClick={ this.togglePlay }
                        disabled={ this._isMax() } />
                <Button icon='fast backward'
                        color="teal"
                        circular
                        inverted
                        onClick={ this.setValueToMin }
                        disabled={ this._isMin() } />
                <Button icon='step backward'
                        color="teal"
                        circular
                        inverted
                        onClick={ this.moveStepBack }
                        disabled={ this._isMin() } />
                <Button icon='step forward'
                        color="teal"
                        circular
                        inverted
                        onClick={ this.moveStepForward }
                        disabled={ this._isMax() } />
                <Button icon='fast forward'
                        color="teal"
                        circular
                        inverted
                        onClick={ this.setValueToMax }
                        disabled={ this._isMax() } />
                <Button icon='stop'
                        color="teal"
                        circular
                        inverted
                        onClick={ this.stopButtonClick }
                        disabled={ !this.state.isPlaying } />
            </div>

            <style jsx>{`
                .timeSlider {
                    padding: 8px 0;
                }

                .currentValue {
                    color: #54ffff;
                    text-align: right;
                }

                .sliderContainer {
                    margin: 8px 0 8px;
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
                    background: #54ffff;
                    cursor: pointer;
                }

                .slider::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #4CAF50;
                    cursor: pointer;
                }

                .controlButtons {
                    text-align: center;
                }
            `}</style>
        </div>
    }
}

export default TimeSlider;