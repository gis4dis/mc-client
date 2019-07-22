export const INITIAL_RANGE_LENGTH = {
    weeks: 1,
};
export const DEFAULT_TOPIC = 'drought';
export const TIME_ZONE = '+01:00';

export const PROPERTIES_REQUEST_PATH = '/api/v2/properties/';
export const TIME_SLOTS_REQUEST_PATH = '/api/v2/time_slots/';
export const TIME_SERIES_REQUEST_PATH = '/api/v2/timeseries/';
export const VGI_OBSERVATIONS_REQUEST_PATH = '/api/v2/vgi_observations/';

export const TIME_SLOTS_TITLES = {
    '1_hour_slot': '1 hour',
    '24_hour_slot': '24 hours',
    '30_days_daily': '30 days',
};

const appConfiguration = {
    INITIAL_RANGE_LENGTH,
    DEFAULT_TOPIC,
    TIME_ZONE,
    PROPERTIES_REQUEST_PATH,
    TIME_SLOTS_REQUEST_PATH,
    TIME_SERIES_REQUEST_PATH,
    VGI_OBSERVATIONS_REQUEST_PATH,
    TIME_SLOTS_TITLES,
};

export default appConfiguration;
