import React from 'react';
import moment from 'moment';
import { Area, AreaChart, LineChart, Line, Tooltip, XAxis, YAxis, linearGradient } from 'recharts';

const getTime = (timeSettings, i) => {
    let from = timeSettings.from;
    let frequency = timeSettings.frequency;

    let time = from.unix() + frequency * i;
    return time;
};

const getChartTicks = (timeSettings) => {
    let allTicks = [];
    let indexTime = timeSettings.from.unix();
    while (indexTime < timeSettings.to.unix()) {
        allTicks.push(indexTime);
        indexTime += timeSettings.frequency;
    }

    if (getDatesDiff(timeSettings) > 1) {
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

const getData = (feature, time) => {
    if (feature) {
        let data = [];

        let shift = feature.get('value_index_shift');
        for (let i = 0; i < shift; i++) {
            data.push({
                time: getTime(time, i),
                value: null,
                anomaly_rate: null
            });
        }

        let propertyValues = feature.get('property_values');
        let anomalyRates = feature.get('property_anomaly_rates');

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
    }
    return null;
};

class FeatureCharts extends React.Component {
    render() {
        let title = this.props.feature ? this.props.feature.get('name') : 'Title';
        let data = getData(this.props.feature, this.props.timeSettings);

        let format = getDatesDiff(this.props.timeSettings) > 1 ? 'L' : 'LT';
        let timeFormatter = getTimeFormatter(this.props.timeSettings.timeZone, format);

        return <div>
            <h3>{ title }</h3>
            {data &&
                <AreaChart width={730} height={250} data={ data } margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                            domain={ ['dataMin', 'dataMax'] }
                            scale="time"
                            ticks={ getChartTicks(this.props.timeSettings) }
                            type="number"
                            tickFormatter={ timeFormatter }/>
                    <YAxis yAxisId="values" />
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
                </AreaChart>
            }

            {(!data) &&
                <div className="noData">
                    <span>No data available</span>
                </div>
            }
            <style jsx>{`
                .noData {
                    background: #ccc;
                    height: 150px;
                    text-align: center;
                    width: 200px;
                }
            `}</style>
        </div>
    }


}

export default FeatureCharts;