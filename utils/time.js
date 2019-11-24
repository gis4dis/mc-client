import moment from 'moment';

/**
 * Returns new Moment instance time zone offset.
 * @param {Moment} date Moment instance to set time zone offset
 * @param {Number|String} timeZone time zone offset
 * @returns {Moment} new Moment instance representing date in given time zone
 */
const getDateInTimeZone = (date, timeZone) => {
    return moment(date).utcOffset(timeZone);
};

/**
 * Returns new Moment instance representing start of the given period in specified time zone.
 * @param {Moment} date Moment instance to find its start of the given period
 * @param {String} period time period
 * @param {Number|String} timeZone time zone offset
 * @returns {Moment} new Moment instance representing start of the given period
 */
export const getStartOfPeriod = (date, period, timeZone) => {
    return getDateInTimeZone(date, timeZone).startOf(period);
};

/**
 * Returns new Moment instance representing end of the given period in specified time zone.
 * @param {Moment} date Moment instance to find its end of the given period
 * @param {String} period time period
 * @param {Number|String} timeZone time zone offset
 * @returns {Moment} new Moment instance representing end of the given period
 */
export const getEndOfPeriod = (date, period, timeZone) => {
    return getDateInTimeZone(date, timeZone).endOf(period);
};

/**
 * Returns new Moment instance representing last possible observation time in specified time zone.
 * @param {Moment} date Moment instance representing date
 * @param {Number} frequency observation frequency in seconds
 * @param {Number|String} timeZone time zone offset
 * @returns {Moment} new Moment instance representing last possible observation
 */
export const getLastPossibleObservationTime = (date, valueDuration, timeZone) => {
    const dateClone = getDateInTimeZone(date, timeZone);
    const startOfNextDay = dateClone.add(1, 'days').startOf('day');
    return startOfNextDay.subtract(valueDuration, 'seconds');
};

/**
 * Returns new Moment instance representing last observation time in specified time zone.
 * @param {Moment} time Moment instance representing beginning of the last observation extended by observation frequency
 * @param {Number} frequency observation frequency in seconds
 * @param {Number|String} timeZone time zone offset
 * @returns {Moment} new Moment instance representing last observation
 */
export const getLastObservationTime = (time, valueDuration, timeZone) => {
    const timeClone = moment(getDateInTimeZone(time, timeZone));
    const lastTime = timeClone.subtract(valueDuration, 'seconds');
    return lastTime;
};
