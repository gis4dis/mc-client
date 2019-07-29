export const INITIAL_RANGE_LENGTH = {
    weeks: 1,
};
export const DEFAULT_TOPIC = 'drought';
export const TIME_ZONE = '+01:00';

export const PROPERTIES_REQUEST_PATH = '/api/v2/properties/';
export const TIME_SLOTS_REQUEST_PATH = '/api/v2/time_slots/';
export const TIME_SERIES_REQUEST_PATH = '/api/v2/timeseries/';
export const VGI_OBSERVATIONS_REQUEST_PATH = '/api/v2/vgi_observations/';

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
    INITIAL_RANGE_LENGTH,
    DEFAULT_TOPIC,
    TIME_ZONE,
    PROPERTIES_REQUEST_PATH,
    TIME_SLOTS_REQUEST_PATH,
    TIME_SERIES_REQUEST_PATH,
    VGI_OBSERVATIONS_REQUEST_PATH,
    TIME_SLOTS,
};

export default appConfiguration;
