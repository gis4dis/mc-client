import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header } from 'semantic-ui-react';

const HomepageHeading = ({ mobile }) => (
    <Container text>
        <Header
            as="h1"
            content="GIS4DIS"
            inverted
            style={{
                fontSize: mobile ? '2em' : '4em',
                fontWeight: 'bold',
                marginBottom: 0,
                marginTop: mobile ? '2em' : '3em',
            }}
        />
        <Header
            as="h2"
            content="Dynamic mapping methods oriented to risk and disaster management in the era of big data"
            inverted
            style={{
                fontSize: mobile ? '1.5em' : '1.7em',
                fontWeight: 'normal',
                marginTop: mobile ? '0.5em' : '1.5em',
                marginBottom: mobile ? '0.5em' : '1.5em',
            }}
        />
    </Container>
);

HomepageHeading.propTypes = {
    mobile: PropTypes.bool.isRequired,
};
