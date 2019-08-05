/**
 * Initial date - initial range ends in the midnight of the previous day.
 * @type {string} date in format 'YYYY-MM-DD' or 'now'
 * @const
 */
export const INITIAL_DATE = 'now';

/**
 * Default topic
 * @type {string}
 * @const
 */
export const DEFAULT_TOPIC = 'drought';

/**
 * Timezone
 * @type {string}
 * @const
 */
export const TIME_ZONE = '+01:00';

/** endpoints */
export const PROPERTIES_REQUEST_PATH = '/api/v2/properties/';
export const TIME_SLOTS_REQUEST_PATH = '/api/v2/time_slots/';
export const TIME_SERIES_REQUEST_PATH = '/api/v2/timeseries/';
export const VGI_OBSERVATIONS_REQUEST_PATH = '/api/v2/vgi_observations/';

/**
 * Key-value pairs - key is time slot id, value is an object defining its properties.
 * @type {Object}
 * @property {string} title
 * @property {Object} initialRange - key-value pair repesenting units and count
 */
export const TIME_SLOTS = {
    '1_hour_slot': {
        title: '1 hour',
        initialRange: {
            days: 1,
        },
    },
    '24_hour_slot': {
        title: '24 hours',
        initialRange: {
            weeks: 1,
        },
    },
    '30_days_daily': {
        title: '30 days',
        initialRange: {
            month: 1,
        },
    },
};

const appConfiguration = {
    INITIAL_DATE,
    DEFAULT_TOPIC,
    TIME_ZONE,
    PROPERTIES_REQUEST_PATH,
    TIME_SLOTS_REQUEST_PATH,
    TIME_SERIES_REQUEST_PATH,
    VGI_OBSERVATIONS_REQUEST_PATH,
    TIME_SLOTS,
};

export default appConfiguration;
