import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';
import HomepageLayout from '../components/homepage/HomepageLayout';

class HomePage extends React.PureComponent {
    static async getInitialProps({ query, req }) {
        let { topics } = query;

        if (!topics) {
            let baseUrl = '';
            if (req && req.protocol && req.headers && req.headers.host) {
                baseUrl = `${req.protocol}://${req.headers.host}`;
            }

            const res = await fetch(`${baseUrl}/api/v2/topics?format=json`);
            topics = await res.json();
        }

        return {
            topics,
        };
    }

    render() {
        const { topics } = this.props;
        return <HomepageLayout topics={topics} />;
    }
}

HomePage.propTypes = {
    topics: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default HomePage;
