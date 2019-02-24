import React from 'react';
import fetch from 'isomorphic-unfetch';
import HeaderMenu from '../components/HeaderMenu';
import MapApp from '../components/MapApp';
import { Icon, Menu } from 'semantic-ui-react';

class MapPage extends React.Component {
    static async getInitialProps(ctx) {
        const topic = ctx.query.topic;
        let topics = ctx.query.topics;

        if (!topics) {
            const req = ctx.req;
            const baseUrl =
                req && req.protocol && req.headers && req.headers.host
                `${req.protocol  }://${  req.headers.host}` :
                '';

            const res = await fetch(`${baseUrl  }/api/v2/topics?format=json`);
            topics = await res.json();
        }

        return {
            mode: 'map',
            topic,
            topics
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            mode: props.mode,
        };

        this.handleModeClick = (e, { name }) => this.setState({ mode: name });
    }

    render() {
        return (
          <div className={'map ' + this.state.mode + '-mode'}>
              <HeaderMenu topics={this.props.topics} activeItem={this.props.topic}>
                  <Menu.Item
                        name="map"
                        position="right"
                        active={this.state.mode === 'map'}
                        color="blue"
                        onClick={this.handleModeClick}
                    >
                      <Icon name="map" />
                    </Menu.Item>
                  <Menu.Item
                        name="settings"
                        position="right"
                        active={this.state.mode === 'settings'}
                        color="blue"
                        onClick={this.handleModeClick}
                    >
                      <Icon name="cogs" />
                    </Menu.Item>
                </HeaderMenu>
              <MapApp sidebarVisible topic={this.props.topic} topics={this.props.topics} />
            </div>
        );
    }
}

export default MapPage;
