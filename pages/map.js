import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import MapApp from '../components/MapApp';
import fetch from 'isomorphic-unfetch';

class MapPage extends React.PureComponent {
    static async getInitialProps(ctx) {
        const topic = ctx.query.topic;
        const req = ctx.req;
        const baseUrl = req ?
            req.protocol + '://' + req.get('Host') + '/' :
            '';

        const res = await fetch(baseUrl + 'api/v2/topics?format=json');
        const topics = await res.json();

        return {
            topic: topic,
            topics: topics
        };
    }

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="root">
                <HeaderMenu topics={ this.props.topics } activeItem={ this.props.topic } />
                <MapApp sidebarVisible topic={ this.props.topic } topics={ this.props.topics }/>
            </div>
        );
    }
}

export default MapPage;