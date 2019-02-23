import React from 'react';
import PropTypes from 'prop-types';

const getBaseStyle = color => ({
    backgroundColor: color || 'red',
    borderRadius: '4px',
    color: 'white',
    display: 'none',
    fontWeight: 'bold',
    lineHeight: '24px',
    position: 'absolute',
    padding: '8px',
    left: '10px',
    transition: 'bottom 10s ease 0s, height 10s ease-out 0s',
    zIndex: 1,
});

const getStyle = (open, color) => {
    const style = getBaseStyle(color);

    if (open) {
        style.display = 'block';
        style.bottom = '10px';
        style.height = '40px';
    } else {
        style.bottom = 0;
        style.height = 0;
        style.display = 'none';
    }
    return style;
};

class NotificationPopup extends React.PureComponent {
    render() {
        const { color, message, open } = this.props;
        return (
            <div style={getStyle(open, color)}>
                <span>{message}</span>
            </div>
        );
    }
}

NotificationPopup.defaultProps = {
    color: null,
    message: null,
    open: false,
};

NotificationPopup.propTypes = {
    color: PropTypes.string,
    message: PropTypes.string,
    open: PropTypes.bool,
};

export default NotificationPopup;
