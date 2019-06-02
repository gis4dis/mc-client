import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import { Button, Dropdown, Icon, Message } from 'semantic-ui-react';
import { Area, AreaChart, ReferenceArea, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { getStartOfPeriod } from '../utils/time';

const DEFAULT_CHART_HEIGHT = 286;
const DEFAULT_CHART_WIDTH = 500;
const HEADER_HEIGHT = 54;

const getTitle = feature => {
    return feature ? feature.get('name') : null;
};

const getDatesDiff = timeSettings => {
    const { from, to } = timeSettings;
    return to.diff(from, 'days');
};

const shouldShowOnlyDates = (timeSettings, left, right) => {
    const isZoomedIn = left !== 'dataMin' || right !== 'dataMax';

    const leftDate =
        left === 'dataMin' ? timeSettings.from : moment.unix(left).utcOffset(timeSettings.timeZone);
    const rightDate =
        right === 'dataMax' ? timeSettings.to : moment.unix(right).utcOffset(timeSettings.timeZone);
    return isZoomedIn ? rightDate.diff(leftDate, 'days') > 1 : getDatesDiff(timeSettings) > 1;
};

const getTime = (timeSettings, i) => {
    const { from, frequency } = timeSettings;
    const time = from.unix() + frequency * i;
    return time;
};

const getChartTicks = (timeSettings, left, right) => {
    const allTicks = [];

    let indexTime = timeSettings.from.unix();
    while (indexTime < timeSettings.to.unix() && (right === 'dataMax' || indexTime < right)) {
        if (left === 'dataMin' || left < indexTime) {
            allTicks.push(indexTime);
        }
        indexTime += timeSettings.frequency;
    }

    if (shouldShowOnlyDates(timeSettings, left, right)) {
        return allTicks.filter(tick => {
            const time = moment.unix(tick).utcOffset(timeSettings.timeZone);
            const startOfDay = getStartOfPeriod(time.clone(), 'day', timeSettings.timeZone);

            return time.isSame(startOfDay);
        });
    }
    return allTicks;
};

const getTimeFormatter = (timeZone, format) => {
    return time => {
        const timeDate = moment.unix(time).utcOffset(timeZone);
        let timeStr = timeDate.format(format);

        const regExp = new RegExp(`[^.]?${timeDate.format('YYYY')}.?`);
        timeStr = timeStr.replace(regExp, '');

        return timeStr;
    };
};

/** ******************* zooming ********************** */
const initialState = {
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
    animation: true,
};

/** ******************* zooming ********************** */

const getData = (feature, property, time) => {
    if (feature && property) {
        const propertyData = feature.get(property.name_id);

        if (propertyData) {
            const data = [];
            const shift = propertyData.value_index_shift;
            for (let i = 0; i < shift; i++) {
                data.push({
                    time: getTime(time, i),
                    value: null,
                    anomaly_rate: null,
                });
            }

            const propertyValues = propertyData.values;
            const anomalyRates = propertyData.anomaly_rates;

            const count = propertyValues.length;
            for (let i = 0; i < count; i++) {
                const dataObject = {
                    time: getTime(time, i + shift),
                    value: propertyValues[i],
                    anomaly_rate: anomalyRates[i],
                };
                data.push(dataObject);
            }
            return data;
        }
        return null;
    }
    return null;
};

const getTimeRangeString = timeSettings => {
    if (timeSettings.from && timeSettings.to) {
        return `${timeSettings.from.format('L')} - ${timeSettings.to.format('L')}`;
    }
    return null;
};

class FeatureCharts extends React.Component {
    constructor(props) {
        super(props);

        const { feature, property, timeSettings } = props;
        const isAggregatedFeature = feature && feature.get('intersectedFeatures');

        const selectedFeature = isAggregatedFeature
            ? feature.get('intersectedFeatures')[0]
            : feature;

        const title = isAggregatedFeature ? null : getTitle(selectedFeature);
        const subtitle = getTimeRangeString(timeSettings);
        const data = getData(selectedFeature, property, timeSettings);

        let timeFormatter;
        if (data) {
            const format = getDatesDiff(timeSettings) > 1 ? 'L' : 'LT';
            timeFormatter = getTimeFormatter(timeSettings.timeZone, format);
        }

        this.state = Object.assign(initialState, {
            selectedFeature,
            data,
            title,
            subtitle,
            timeFormatter,
        });

        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this.onIntersectedFeatureChange = this.onIntersectedFeatureChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const isAggregatedFeature =
            nextProps.feature && nextProps.feature.get('intersectedFeatures');
        const selectedFeature = isAggregatedFeature
            ? nextProps.feature.get('intersectedFeatures')[0]
            : nextProps.feature;
        const title = isAggregatedFeature ? null : getTitle(selectedFeature);
        const { timeSettings } = this.props;
        const subtitle = getTimeRangeString(timeSettings);
        const data = getData(selectedFeature, nextProps.property, nextProps.timeSettings);

        let timeFormatter;
        if (data) {
            const format = getDatesDiff(nextProps.timeSettings) > 1 ? 'L' : 'LT';
            timeFormatter = getTimeFormatter(nextProps.timeSettings.timeZone, format);
        }

        this.setState(
            Object.assign(initialState, {
                selectedFeature,
                data,
                title,
                subtitle,
                timeFormatter,
            })
        );
    }

    onIntersectedFeatureChange(event, data) {
        const { feature, property, timeSettings } = this.props;
        const featId = data.value;
        const selectedFeature = feature
            .get('intersectedFeatures')
            .find(feat => feat.getId() === featId);
        const featureData = getData(selectedFeature, property, timeSettings);

        this.setState({
            selectedFeature,
            data: featureData,
            title: null,
        });
    }

    _onMouseDown(evt) {
        if (evt) {
            this.setState({
                refAreaLeft: evt.activeLabel,
            });
        }
    }

    _onMouseMove(evt) {
        const { refAreaLeft } = this.state;
        if (refAreaLeft) {
            this.setState({
                refAreaRight: evt.activeLabel,
            });
        }
    }

    zoomIn() {
        let { refAreaLeft, refAreaRight } = this.state;
        const { timeSettings } = this.props;

        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            this.setState({
                refAreaLeft: '',
                refAreaRight: '',
            });
            return;
        }

        if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

        const format = shouldShowOnlyDates(timeSettings, refAreaLeft, refAreaRight) ? 'L' : 'LT';
        const timeFormatter = getTimeFormatter(timeSettings.timeZone, format);

        this.setState(() => ({
            timeFormatter,
            refAreaLeft: '',
            refAreaRight: '',
            left: refAreaLeft,
            right: refAreaRight,
        }));
    }

    zoomOut() {
        const { timeSettings } = this.props;
        const format = getDatesDiff(timeSettings) > 1 ? 'L' : 'LT';
        const timeFormatter = getTimeFormatter(timeSettings.timeZone, format);

        this.setState({
            timeFormatter,
            refAreaLeft: '',
            refAreaRight: '',
            left: 'dataMin',
            right: 'dataMax',
        });
    }

    render() {
        const { feature } = this.props;
        const {
            selectedFeature,
            data,
            title,
            subtitle,
            timeFormatter,
            left,
            right,
            refAreaLeft,
            refAreaRight,
        } = this.state;
        const { chartId, height, property, timeSettings, width } = this.props;
        const isZoomedIn = left !== 'dataMin' || right !== 'dataMax';

        let valueAxisLabel;
        if (property) {
            valueAxisLabel = {
                value: /* property.name + */ ` [${property.unit}]`,
                angle: -90,
                offset: 10,
                position: 'insideLeft',
            };
        }

        const id = chartId;

        return (
            <div style={{ textAlign: 'left' }}>
                {feature && feature.get('intersectedFeatures') && (
                    <Dropdown
                        value={selectedFeature.getId()}
                        selection
                        options={feature.get('intersectedFeatures').map(feat => {
                            const featId = feat.getId();
                            const featName = feat.get('name');

                            return {
                                key: featId,
                                text: featName,
                                value: featId,
                            };
                        })}
                        onChange={this.onIntersectedFeatureChange}
                    />
                )}

                {title && <div className="title">{title}</div>}
                <div style={{ height: '36px' }}>
                    {subtitle && <div className="subtitle">{subtitle}</div>}

                    {isZoomedIn && (
                        <Button
                            inverted
                            color="blue"
                            onClick={this.zoomOut}
                            style={{ float: 'right' }}
                        >
                            Zoom Out
                        </Button>
                    )}
                </div>

                {data && (
                    <AreaChart
                        height={height - HEADER_HEIGHT}
                        width={width}
                        data={data}
                        onMouseDown={this._onMouseDown}
                        onMouseMove={this._onMouseMove}
                        onMouseUp={this.zoomIn}
                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id={`colorValues${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0000ff" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0000ff" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id={`colorAnomalies${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff0000" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#ff0000" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <XAxis
                            dataKey="time"
                            allowDataOverflow
                            domain={[left, right]}
                            scale="time"
                            ticks={getChartTicks(timeSettings, left, right)}
                            type="number"
                            tickFormatter={timeFormatter}
                        />
                        <YAxis yAxisId="values" label={valueAxisLabel} unit={property.unit} />
                        <YAxis yAxisId="anomalies" orientation="right" />

                        <Tooltip labelFormatter={getTimeFormatter(timeSettings.timeZone, 'LT L')} />

                        <ReferenceLine
                            x={timeSettings.time.unix()}
                            yAxisId="values"
                            stroke="#6dffff"
                            strokeWidth="2px"
                        />

                        <Area
                            yAxisId="values"
                            type="monotone"
                            dataKey="value"
                            stroke="#0000ff"
                            fillOpacity={1}
                            fill={`url(#colorValues${id})`}
                        />
                        <Area
                            yAxisId="anomalies"
                            type="monotone"
                            dataKey="anomaly_rate"
                            stroke="#ff0000"
                            fillOpacity={1}
                            fill={`url(#colorAnomalies${id})`}
                        />

                        {refAreaLeft && refAreaRight && (
                            <ReferenceArea
                                yAxisId="values"
                                x1={refAreaLeft}
                                x2={refAreaRight}
                                strokeOpacity={0.3}
                            />
                        )}
                    </AreaChart>
                )}

                {!data && (
                    <div
                        style={{
                            backgroundImage:
                                'linear-gradient(to top, rgba(150,150,150,0.5), rgba(150,150,150,0.1))',
                            height: `${height - HEADER_HEIGHT}px`,
                            minHeight: `${height - HEADER_HEIGHT}px`,
                            width: `${width}px`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Message
                            icon
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                height: '70px',
                                width: '275px',
                            }}
                        >
                            <Icon name="chart area" />
                            <Message.Content>
                                <Message.Header>No data</Message.Header>
                                No data for given property.
                            </Message.Content>
                        </Message>
                    </div>
                )}
                <style jsx>
                    {`
                        .title {
                            font-size: 18px;
                            font-weight: bold;
                            margin: 0 0 4px 8px;
                        }

                        .subtitle {
                            display: inline-block;
                            margin: 4px 4px 0 8px;
                        }
                    `}
                </style>
            </div>
        );
    }
}

FeatureCharts.defaultProps = {
    feature: null,
    height: DEFAULT_CHART_HEIGHT,
    property: null,
    width: DEFAULT_CHART_WIDTH,
};

FeatureCharts.propTypes = {
    chartId: PropTypes.string.isRequired,
    feature: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    height: PropTypes.number,
    property: PropTypes.shape({
        name: PropTypes.string,
        name_id: PropTypes.string,
        unit: PropTypes.string,
    }),
    timeSettings: PropTypes.shape({
        from: momentPropTypes.momentObj,
        to: momentPropTypes.momentObj,
        timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    width: PropTypes.number,
};

export default FeatureCharts;
