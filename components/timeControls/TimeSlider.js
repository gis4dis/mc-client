import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button } from 'semantic-ui-react';

const minThumbWidth = 12;
const minThumbWidthString = `${minThumbWidth}px`;

const getSteps = options => {
    const { from, to, frequency, interval } = options;
    let steps;

    if (interval === frequency) {
        steps = frequency;
    } else {
        steps = [];
        const lastMeasurement = to - interval;
        for (let i = from; i <= lastMeasurement; i += frequency) {
            steps.push(i);
        }
    }
    return steps;
};

class TimeSlider extends React.Component {
    constructor(props) {
        super(props);

        const { from, to, frequency, interval, value } = props;
        let steps = [];
        if (from && to) {
            steps = getSteps({
                from,
                to,
                frequency,
                interval,
            });
        }

        this.state = {
            value: value || from || 0,
            steps,
            isPlaying: false,
        };

        this.onChange = this.onChange.bind(this);

        this.togglePlay = this.togglePlay.bind(this);
        this.stopButtonClick = this.stopButtonClick.bind(this);

        this.moveStepBack = this.moveStepBack.bind(this);
        this.moveStepForward = this.moveStepForward.bind(this);

        this.setValueToMin = this.setValueToMin.bind(this);
        this.setValueToMax = this.setValueToMax.bind(this);

        this.inputElement = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        const { from, to } = this.props;
        if (nextProps.from !== from || nextProps.to !== to) {
            const { from: nextFrom, to: nextTo, frequency, interval } = nextProps;

            let steps = [];
            if (from && to) {
                steps = getSteps({
                    from: nextFrom,
                    to: nextTo,
                    frequency,
                    interval,
                });
            }

            this.setState({
                value: nextProps.from || 0,
                steps,
            });
        }
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
        const { callback, timeZone } = this.props;
        const max = this._getMax();

        if (callback) {
            const timeDate = moment.unix(max).utcOffset(timeZone);
            callback(timeDate);
        }

        this.setState({
            value: max,
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
            const { steps } = this.state;
            const time = parseInt(prevState.value, 10);

            let newValue;
            if (steps instanceof Array) {
                const index = steps.indexOf(time);
                newValue = index ? steps[index - 1] : from;
            } else {
                const step = parseInt(frequency || 1, 10);
                newValue = time - step;
            }

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
            const { steps } = this.state;
            const time = parseInt(prevState.value, 10);

            let newValue;
            if (steps instanceof Array) {
                const index = steps.indexOf(time);
                newValue = index < steps.length - 1 ? steps[index + 1] : time;
            } else {
                const step = parseInt(frequency || 1, 10);
                newValue = time + step;
            }

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
        const { value } = this.state;
        return value === this._getMax();
    }

    _getMax() {
        const { to } = this.props;
        const { steps } = this.state;

        if (steps instanceof Array && steps.length) {
            return steps[steps.length - 1];
        }
        return to - steps;
    }

    render() {
        const { steps, isPlaying } = this.state;
        const playPauseIcon = isPlaying ? 'pause' : 'play';

        const { from, to, interval, loading } = this.props;
        const thumbWidth = interval && from && to ? (interval / (to - from)) * 100 : null;

        let { disabled } = this.props;
        disabled = disabled || loading;

        let thumbWidthString;
        let thumbBorderRadius;
        if (thumbWidth && this.inputElement && this.inputElement.current) {
            const width = this.inputElement.current.offsetWidth;
            const thumbWidthInPx = (width * thumbWidth) / 100;
            if (thumbWidthInPx < minThumbWidth) {
                thumbWidthString = minThumbWidthString;
            } else {
                thumbWidthString = `${thumbWidth}%`;
                thumbBorderRadius = 0;
            }
        } else {
            thumbWidthString = minThumbWidthString;
        }

        const min = loading ? 0 : from || 0;
        const max = to || 100;

        let { value } = this.state;
        value = loading ? min : value || min;

        return (
            <div className="timeSlider">
                <div className="sliderContainer">
                    <input
                        type="range"
                        className="slider"
                        ref={this.inputElement}
                        min={min}
                        max={max}
                        step={steps}
                        value={value}
                        disabled={disabled}
                        onChange={this.onChange}
                        style={{
                            '--slider-thumb-width': thumbWidthString,
                            '--slider-thumb-border-radius': thumbBorderRadius,
                        }}
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

                        .sliderContainer {
                            margin: 8px 0 8px;
                        }

                        .slider {
                            -webkit-appearance: none;
                            height: 2px;
                            border-radius: 5px;
                            box-shadow: none;
                            background: #6dffff;
                            outline: none;
                            transition: opacity 0.2s;
                            width: 100%;
                            -webkit-transition: 0.2s;
                        }

                        .slider::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            height: 12px;
                            width: var(--slider-thumb-width, 12px);
                            border-radius: var(--slider-thumb-border-radius, 50%);
                            background: #54ffff;
                            cursor: pointer;
                        }

                        .slider::-moz-range-thumb {
                            height: 12px;
                            width: var(--slider-thumb-width, 12px);
                            border-radius: var(--slider-thumb-border-radius, 50%);
                            border: none;
                            background: #54ffff;
                            cursor: pointer;
                        }

                        .slider[disabled] {
                            opacity: 0.45;
                        }

                        .slider[disabled]::-webkit-slider-thumb {
                            border: solid 3px #000;
                            cursor: default;
                        }

                        .slider[disabled]::-moz-range-thumb {
                            border: solid 3px #000;
                            height: 6px;
                            width: 6px;
                            cursor: default;
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
