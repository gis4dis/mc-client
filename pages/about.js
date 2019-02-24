import React from 'react';
import fetch from 'isomorphic-unfetch';
import SimpleLayout from '../components/SimpleLayout';
import HeaderMenu from '../components/HeaderMenu';

class AboutPage extends React.PureComponent {
    static async getInitialProps(ctx) {
        let topics = ctx.query ? ctx.query.topics : null;

        if (!topics) {
            const req = ctx.req;
            const baseUrl =
                req && req.protocol && req.headers && req.headers.host ?
                    req.protocol + '://' + req.headers.host :
                    '';

            const res = await fetch(`${baseUrl}/api/v2/topics?format=json`);
            topics = await res.json();
        }

        return {
            topics,
        };
    }

    render() {
        return (
            <div>
                <HeaderMenu topics={this.props.topics} activeItem="about" />
                <SimpleLayout>
                    <p>This is the about page</p>
                </SimpleLayout>
            </div>
        );
    }
}

export default AboutPage;
