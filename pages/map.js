import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';
import { Icon, Menu } from 'semantic-ui-react';
import HeaderMenu from '../components/HeaderMenu';
import MapApp from '../components/MapApp';

class MapPage extends React.Component {
    static async getInitialProps({ query, req }) {
        const { topic } = query;
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
            mode: 'map',
            topic,
            topics,
        };
    }

    constructor(props) {
        super(props);

        const { mode } = props;
        this.state = {
            mode,
        };

        this.handleModeClick = (e, { name }) => this.setState({ mode: name });
    }

    render() {
        const { mode } = this.state;
        const { topic, topics } = this.props;
        return (
            <div className={`map ${mode}-mode`}>
                <HeaderMenu topics={topics} activeItem={topic}>
                    <Menu.Item
                        name="map"
                        position="right"
                        active={mode === 'map'}
                        color="blue"
                        onClick={this.handleModeClick}
                    >
                        <Icon name="map" />
                    </Menu.Item>
                    <Menu.Item
                        name="settings"
                        position="right"
                        active={mode === 'settings'}
                        color="blue"
                        onClick={this.handleModeClick}
                    >
                        <Icon name="cogs" />
                    </Menu.Item>
                </HeaderMenu>
                <MapApp sidebarVisible topic={topic} topics={topics} />
            </div>
        );
    }
}

MapPage.propTypes = {
    mode: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    topics: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            name_id: PropTypes.string,
        }).isRequired
    ).isRequired,
};

export default MapPage;
