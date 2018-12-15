import React from 'react';
import SimpleLayout from '../components/SimpleLayout'
import HeaderMenu from '../components/HeaderMenu'

class AboutPage extends React.PureComponent {
    static async getInitialProps(ctx) {
        const res = await fetch('http://localhost:8000/api/v2/topics?format=json');
        const topics = await res.json();

        return {
            topics: topics
        };
    }

    render() {
        return <div>
            <HeaderMenu topics={ this.props.topics } activeItem='about'/>
            <SimpleLayout>
                <p>This is the about page</p>
            </SimpleLayout>
        </div>
    }
}

export default AboutPage;