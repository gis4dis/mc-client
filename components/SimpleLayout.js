import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

const containerStyle = {
    position: 'absolute',
    top: '40px',
};

const SimpleLayout = ({ children }) => (
    <div>
        <Container style={containerStyle}>{children}</Container>
    </div>
);

SimpleLayout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default SimpleLayout;
