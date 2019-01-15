import HomepageLayout from '../components/HomepageLayout'
import React from 'react';
import fetch from 'isomorphic-unfetch';


class HomePage extends React.PureComponent {
    static async getInitialProps(ctx) {
        let topics = ctx.query ? ctx.query.topics : null;

        if (!topics) {
            const req = ctx.req;
            const baseUrl = req && req.protocol && req.headers && req.headers.host ?
                req.protocol + '://' + req.headers.host :
                '';

            console.log(baseUrl);
            const res = await fetch(baseUrl + '/api/v2/topics?format=json');
            topics = await res.json();
        }

        return {
            topics: topics
        };
    }

    constructor(props) {
        super(props);
    }


    render() {

        return (
            <HomepageLayout topics={ this.props.topics }/>
        );
    }
}

export default HomePage;