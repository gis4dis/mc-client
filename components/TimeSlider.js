import React from 'react';
import moment from 'moment';

class TimeSlider extends React.Component {
    constructor(props) {
        super(props);

        let min = props.from.unix();
        let max = props.to.unix();

        let initValue = props.value ? props.value.unix() : (min + max) / 2;

        let step = props.frequency ? props.frequency : 1;

        this.state = {
            min: min,
            max: max,
            value: initValue,
            step: step
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        var time = parseInt(event.target.value);
        this.setState({
            value: time
        });

        if (this.props.callback) {
            var timeDate = moment(time);
            this.props.callback(timeDate);
        }
    }

    render() {
        return <div>
            <div className="slidercontainer">
                <input type="range"
                        className="slider"
                        min={ this.state.min }
                        max={ this.state.max }
                        step={ this.state.step }
                        value={ this.state.value }
                        onChange={ this.onChange }/>
            </div>
        </div>
    }
}

export default TimeSlider;