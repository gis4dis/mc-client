import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button } from 'semantic-ui-react';

class TimeSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value || props.from || 0,
            isPlaying: false,
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
        const { from, to } = this.props;
        if (nextProps.from !== from || nextProps.to !== to) {
            this.setState({
                value: nextProps.from || 0,
            });
        }
        /*const { from, to, value } = this.props;
        let newValue;
        if (nextProps.value !== value) {
            newValue = value;
        } else if (nextProps.from !== from || nextProps.to !== to) {
            newValue = nextProps.from || 0;
        }
        if (newValue || newValue === 0) {
            this.setState({
                value: newValue,
            });
        } */
    }

    onChange(event) {
        const time = parseInt(event.target.value, 10);
        this.setState({
            value: time,
        });

        const { callback, timeZone } = this.props;
        if (callback) {
            const timeDate = moment.unix(time).utcOffset(timeZone);
            callback(timeDate);
        }
    }

    setValueToMin() {
        const { callback, from, timeZone } = this.props;
        if (callback) {
            const timeDate = moment.unix(from).utcOffset(timeZone);
            callback(timeDate);
        }

        this.setState({
            value: from,
        });
    }

    setValueToMax() {
        const { callback, to, timeZone } = this.props;
        if (callback) {
            const timeDate = moment.unix(to).utcOffset(timeZone);
            callback(timeDate);
        }

        this.setState({
            value: to,
        });
    }

    togglePlay() {
        if (this.timerId) {
            this._clearTimer();
        } else {
            this.timerId = setInterval(() => this.moveStepForward(), 1000);
        }

        this.setState(prevState => ({
            isPlaying: !prevState.isPlaying,
        }));
    }

    stopButtonClick() {
        if (this.timerId) {
            this._clearTimer();
        }

        const { callback, from, timeZone } = this.props;
        if (callback) {
            const timeDate = moment.unix(from).utcOffset(timeZone);
            callback(timeDate);
        }

        this.setState({
            isPlaying: false,
            value: from,
        });
    }

    _clearTimer() {
        clearInterval(this.timerId);
        this.timerId = null;
    }

    moveStepBack() {
        this.setState((prevState, props) => {
            const { callback, from, frequency, timeZone } = props;
            const time = parseInt(prevState.value, 10);
            const step = parseInt(frequency || 1, 10);
            let newValue = time - step;

            if (newValue < from) {
                newValue = from;
            }

            if (time !== newValue) {
                if (callback) {
                    const timeDate = moment.unix(newValue).utcOffset(timeZone);
                    callback(timeDate);
                }
            }

            return {
                value: newValue,
            };
        });
    }

    moveStepForward() {
        this.setState((prevState, props) => {
            const { frequency, callback, timeZone, to } = props;
            const time = parseInt(prevState.value, 10);
            const step = parseInt(frequency || 1, 10);
            let newValue = time + step;

            if (newValue > to) {
                newValue = to;
            }

            let stopPlaying;
            if (this.timerId && newValue === to) {
                this._clearTimer();
                stopPlaying = true;
            }

            if (time !== newValue) {
                if (callback) {
                    const timeDate = moment.unix(newValue).utcOffset(timeZone);
                    callback(timeDate);
                }
            }

            return {
                isPlaying: stopPlaying ? false : prevState.isPlaying,
                value: newValue,
            };
        });
    }

    _isMin() {
        const { from } = this.props;
        const { value } = this.state;
        return value === from;
    }

    _isMax() {
        const { to } = this.props;
        const { value } = this.state;
        return value === to;
    }

    render() {
        const { isPlaying, value } = this.state;
        const playPauseIcon = isPlaying ? 'pause' : 'play';

        const { from, to, disabled, frequency, interval, loading } = this.props;
        let thumbWidth = interval && from && to ? (interval / (to - from)) * 100 : null;
        if (!thumbWidth) {
            thumbWidth = '14px';
        } else {
            if (thumbWidth < 1) {
                thumbWidth = 1;
            }
            thumbWidth += '%';
        }

        const min = loading ? 0 : from || 0;
        const max = to || 100;

        return (
            <div className="timeSlider">
                <div className="sliderContainer">
                    <input
                        type="range"
                        className="slider"
                        min={min}
                        max={max}
                        step={frequency}
                        value={value}
                        disabled={disabled}
                        onChange={this.onChange}
                        style={{ '--slider-thumb-width': thumbWidth }}
                    />
                </div>

                <div className="controlButtons">
                    <Button
                        icon={playPauseIcon}
                        color="teal"
                        circular
                        inverted
                        onClick={this.togglePlay}
                        disabled={disabled || this._isMax()}
                    />
                    <Button
                        icon="fast backward"
                        color="teal"
                        circular
                        inverted
                        onClick={this.setValueToMin}
                        disabled={disabled || this._isMin()}
                    />
                    <Button
                        icon="step backward"
                        color="teal"
                        circular
                        inverted
                        onClick={this.moveStepBack}
                        disabled={disabled || this._isMin()}
                    />
                    <Button
                        icon="step forward"
                        color="teal"
                        circular
                        inverted
                        onClick={this.moveStepForward}
                        disabled={disabled || this._isMax()}
                    />
                    <Button
                        icon="fast forward"
                        color="teal"
                        circular
                        inverted
                        onClick={this.setValueToMax}
                        disabled={disabled || this._isMax()}
                    />
                    <Button
                        icon="stop"
                        color="teal"
                        circular
                        inverted
                        onClick={this.stopButtonClick}
                        disabled={disabled || !isPlaying}
                    />
                </div>

                <style jsx>
                    {`
                        .timeSlider {
                            padding: 0;
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
                            -webkit-transition: 0.2s;
                            transition: opacity 0.2s;
                        }

                        .slider::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            height: 14px;
                            width: var(--slider-thumb-width, 14px);
                            border-radius: 50%;
                            background: #54ffff;
                            cursor: pointer;
                        }

                        .slider::-moz-range-thumb {
                            height: 14px;
                            width: var(--slider-thumb-width, 14px);
                            border-radius: 50%;
                            background: #4caf50;
                            cursor: pointer;
                        }

                        .controlButtons {
                            text-align: center;
                        }
                    `}
                </style>
            </div>
        );
    }
}

TimeSlider.defaultProps = {
    from: 0,
    to: 100,
    value: 0,
    callback: null,
    frequency: null,
    interval: null,
};

TimeSlider.propTypes = {
    from: PropTypes.number,
    to: PropTypes.number,
    value: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    callback: PropTypes.func,
    disabled: PropTypes.bool.isRequired,
    frequency: PropTypes.number,
    interval: PropTypes.number,
    timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TimeSlider;
