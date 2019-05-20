import React from 'react';
import momentPropTypes from 'react-moment-proptypes';

const TimeValue = ({ value }) => {
    return (
        <div style={{ display: 'inline-block' }}>
            {value && <div className="currentValue">{value.format('L LT Z')}</div>}
            <style jsx>
                {`
                    .currentValue {
                        color: #6dffff;
                        text-align: right;
                    }
                `}
            </style>
        </div>
    );
};

TimeValue.defaultProps = {
    value: null,
};

TimeValue.propTypes = {
    value: momentPropTypes.momentObj,
};

export default TimeValue;
