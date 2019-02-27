import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';
import SimpleLayout from '../components/SimpleLayout';
import HeaderMenu from '../components/HeaderMenu';

class AboutPage extends React.PureComponent {
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
        return (
            <div>
                <HeaderMenu topics={topics} activeItem="about" />
                <SimpleLayout>
                    <p>This is the about page</p>
                </SimpleLayout>
            </div>
        );
    }
}

AboutPage.propTypes = {
    topics: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AboutPage;
