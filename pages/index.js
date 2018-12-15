import HomepageLayout from '../components/HomepageLayout'
import React from 'react';
import fetch from 'isomorphic-unfetch'


class HomePage extends React.PureComponent {
    static async getInitialProps(ctx) {
        const res = await fetch('http://localhost:8000/api/v2/topics?format=json');
        const topics = await res.json();

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