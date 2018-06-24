import React from 'react';

class NotificationPopup extends React.Component {
    _getBaseStyle(color) {
        return {
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
            zIndex: 1
        };
    }

    _getStyle(open, color) {
        let style = this._getBaseStyle(color);

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
    }

    render() {
        return <div style={ this._getStyle(this.props.open, this.props.color) }>
            <span>{ this.props.message }</span>
        </div>
    }
};

export default NotificationPopup;