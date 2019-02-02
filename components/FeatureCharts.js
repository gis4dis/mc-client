import React from 'react';
import moment from 'moment';
import { Button } from 'semantic-ui-react';
import { Area, AreaChart, LineChart, Line, ReferenceArea, Tooltip, XAxis, YAxis, linearGradient } from 'recharts';

const getTime = (timeSettings, i) => {
    let from = timeSettings.from;
    let frequency = timeSettings.frequency;

    let time = from.unix() + frequency * i;
    return time;
};

const getChartTicks = (timeSettings, left, right) => {
    let allTicks = [];

    let indexTime = timeSettings.from.unix();
    while (indexTime < timeSettings.to.unix() &&
            (right === 'dataMax' || indexTime < right)) {
        if (left === 'dataMin' || left < indexTime) {
            allTicks.push(indexTime);
        }
        indexTime += timeSettings.frequency;
    }

    if (shouldShowOnlyDates(timeSettings, left, right)) {
        return allTicks.filter((tick) => {
            let time = moment.unix(tick).utcOffset(timeSettings.timeZone);
            let startOfDay = time.clone().startOf('day');

            return time.isSame(startOfDay);
        });
    }
    return allTicks;
};

const getTimeFormatter = (timeZone, format) => {
    return (time) => {
        let timeDate = moment.unix(time).utcOffset(timeZone);
        let timeStr = timeDate.format(format);

        let regExp = new RegExp('[^\.]?' + timeDate.format('YYYY') + '.?');
        timeStr = timeStr.replace(new RegExp('[^\.]?' + timeDate.format('YYYY') + '.?'), '');

        return timeStr;
    };
};

const getDatesDiff = (timeSettings) => {
    let from = timeSettings.from;
    let to = timeSettings.to;
    return to.diff(from, 'days');
};

const shouldShowOnlyDates = (timeSettings, left, right) => {
    let isZoomedIn = left !== 'dataMin' || right !== 'dataMax';

    let leftDate = left === 'dataMin' ?
        timeSettings.from :
        moment.unix(left).utcOffset(timeSettings.timeZone);
    let rightDate = right === 'dataMax' ?
        timeSettings.to :
        moment.unix(right).utcOffset(timeSettings.timeZone);
    return isZoomedIn ?
        rightDate.diff(leftDate, 'days') > 1 :
        getDatesDiff(timeSettings) > 1;
};

/********************* zooming ***********************/
const initialState = {
    left : 'dataMin',
    right : 'dataMax',
    refAreaLeft : '',
    refAreaRight : '',
    animation : true
};


/********************* zooming ***********************/


const getData = (feature, property, time) => {
    if (feature && property) {

        let propertyData = feature.get(property.name_id);

        if (propertyData) {
            let data = [];
            let shift = propertyData.value_index_shift;
            for (let i = 0; i < shift; i++) {
                data.push({
                    time: getTime(time, i),
                    value: null,
                    anomaly_rate: null
                });
            }


            let propertyValues = propertyData.values;
            let anomalyRates = propertyData.anomaly_rates;

            let count = propertyValues.length;
            for (let i = 0; i < count; i++) {
                let dataObject = {
                    time: getTime(time, i + shift),
                    value: propertyValues[i],
                    anomaly_rate: anomalyRates[i]
                };
                data.push(dataObject);
            }
            return data;
        } else {
            return null;
        }
    }
    return null;
};

const getTimeRangeString = (timeSettings) => {
    if (timeSettings.from && timeSettings.to) {
        return timeSettings.from.format('L') + ' - ' + timeSettings.to.format('L');
    }
    return null;
};


class FeatureCharts extends React.Component {
    constructor(props) {
        super(props);

        let title = this.props.feature ? this.props.feature.get('name') : null;
        let subtitle = getTimeRangeString(this.props.timeSettings);
        let data = getData(this.props.feature, this.props.property, this.props.timeSettings);

        let timeFormatter;
        if (data) {
            let format = getDatesDiff(this.props.timeSettings) > 1 ? 'L' : 'LT';
            timeFormatter = getTimeFormatter(this.props.timeSettings.timeZone, format);
        }

        this.state = Object.assign(initialState, {
            data: data,
            title: title,
            subtitle: subtitle,
            timeFormatter: timeFormatter
        });

    };

    componentWillReceiveProps(nextProps) {
        let title = nextProps.feature ? nextProps.feature.get('name') : null;
        let subtitle = getTimeRangeString(this.props.timeSettings);
        let data = getData(nextProps.feature, nextProps.property, nextProps.timeSettings);

        let timeFormatter;
        if (data) {
            let format = getDatesDiff(nextProps.timeSettings) > 1 ? 'L' : 'LT';
            timeFormatter = getTimeFormatter(nextProps.timeSettings.timeZone, format);
        }

        this.setState(Object.assign(initialState, {
            data: data,
            title: title,
            subtitle: subtitle,
            timeFormatter: timeFormatter
        }));
    }

    _onMouseDown(evt) {
        if (evt) {
            this.setState({
                refAreaLeft: evt.activeLabel
            });
        }
    };

    _onMouseMove(evt) {
        if (this.state.refAreaLeft) {
            this.setState({
                refAreaRight: evt.activeLabel
            });
        }
    };

    zoomIn() {
        let { refAreaLeft, refAreaRight } = this.state;

        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            this.setState({
                refAreaLeft : '',
                refAreaRight : ''
            });
            return;
        }

        if (refAreaLeft > refAreaRight)
            [ refAreaLeft, refAreaRight ] = [ refAreaRight, refAreaLeft ];

        let format = shouldShowOnlyDates(this.props.timeSettings, refAreaLeft, refAreaRight) ?
            'L' : 'LT';
        let timeFormatter = getTimeFormatter(this.props.timeSettings.timeZone, format);

        this.setState(() => ({
            timeFormatter: timeFormatter,
            refAreaLeft: '',
            refAreaRight: '',
            left: refAreaLeft,
            right: refAreaRight
        }));
    };

    zoomOut() {
        let format = getDatesDiff(this.props.timeSettings) > 1 ? 'L' : 'LT';
        let timeFormatter = getTimeFormatter(this.props.timeSettings.timeZone, format);

        this.setState({
            timeFormatter: timeFormatter,
            refAreaLeft : '',
            refAreaRight : '',
            left : 'dataMin',
            right : 'dataMax'
        });
    }

    render() {
        const { data, title, subtitle, timeFormatter, left, right, refAreaLeft, refAreaRight } = this.state;
        const isZoomedIn = left !== 'dataMin' || right !== 'dataMax';

        let valueAxisLabel;
        if (this.props.property) {
            valueAxisLabel = {
                value: /*this.props.property.name + */' [' + this.props.property.unit + ']',
                angle: -90,
                offset: 10,
                position: 'insideLeft'
            };
        }

        let headerHeight = 54;
        let height = (this.props.height || 286) - headerHeight;
        let width = this.props.width || 500;

        return <div>
            {title && <div className="title">{ title }</div>}
            <div style={ {height: '36px'} }>
                {subtitle && <div className="subtitle">{ subtitle }</div>}

                {isZoomedIn &&
                    <Button
                            inverted
                            color="blue"
                            onClick={ this.zoomOut.bind(this) }
                            style={ {float: 'right'} }>
                        Zoom Out
                    </Button>
                }
            </div>

            {data &&
                <AreaChart
                        height={ height }
                        width={ width }
                        data={ data }
                        onMouseDown = { this._onMouseDown.bind(this) }
                        onMouseMove = { this._onMouseMove.bind(this) }
                        onMouseUp = { this.zoomIn.bind(this) }
                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValues" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0000ff" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0000ff" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff0000" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ff0000" stopOpacity={0}/>
                        </linearGradient>
                    </defs>

                    <XAxis dataKey="time"
                            allowDataOverflow={true}
                            domain={ [left, right] }
                            scale="time"
                            ticks={ getChartTicks(this.props.timeSettings, left, right) }
                            type="number"
                            tickFormatter={ timeFormatter }/>
                    <YAxis yAxisId="values" label={ valueAxisLabel }/>
                    <YAxis yAxisId="anomalies" orientation="right" />

                    <Tooltip labelFormatter={ getTimeFormatter(this.props.timeSettings.timeZone, 'LT L') }/>

                    <Area yAxisId="values"
                            type="monotone"
                            dataKey="value"
                            stroke="#0000ff"
                            fillOpacity={1}
                            fill="url(#colorValues)" />
                    <Area yAxisId="anomalies"
                            type="monotone"
                            dataKey="anomaly_rate"
                            stroke="#ff0000"
                            fillOpacity={1}
                            fill="url(#colorAnomalies)" />

                    {(refAreaLeft && refAreaRight) &&
                        <ReferenceArea
                            yAxisId="values"
                            x1={ refAreaLeft }
                            x2={ refAreaRight }
                            strokeOpacity={0.3} />
                    }
                </AreaChart>
            }
            <style jsx>{`
                .title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 4px;
                }

                .subtitle {
                    display: inline-block;
                    margin-right: 4px;
                }
            `}</style>
        </div>
    }


}

export default FeatureCharts;