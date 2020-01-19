/**
 * Returns new Moment instance representing last observation time in specified time zone.
 * @param {Moment} time Moment instance representing beginning of the last observation extended by observation frequency
 * @param {Number} valueDuration observation duration in seconds
 * @returns {Moment} new Moment instance representing last observation
 */
export const getLastObservationTime = (time, valueDuration) => {
    const lastTime = time.clone().subtract(valueDuration, 'seconds');
    return lastTime;
};

/**
 * Returns new Moment instance representing time of observation.
 * @param {Moment} time Moment instance representing beginning of the observation
 * @param {Number} valueDuration observation duration in seconds
 * @returns {Moment} new Moment instance representing end of observation
 */
export const getObservationTime = (time, valueDuration) => {
    const endTime = time.clone().add(valueDuration, 'seconds');
    return endTime;
};

/**
 * Returns new Moment instance representing time of observation in UNIX seconds.
 * @param {Moment} time Moment instance representing beginning of the observation
 * @param {Number} valueDuration observation duration in seconds
 * @returns {Number} new Moment instance representing end of observation
 */
export const getObservationTimeInSeconds = (time, valueDuration) => {
    const endTime = time.unix() + valueDuration;
    return endTime;
};
