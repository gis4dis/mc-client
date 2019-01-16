import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';


class HeaderMenu extends React.Component {
    constructor(props) {
        super(props);

        let topics = [];
        if (props.topics) {
            topics = props.topics.map((topic) => {
                return {
                    key: topic.name_id,
                    name: topic.name,
                    href: '/topics/' + topic.name_id
                };
            });
        }

        let homeTab = {key: 'home', name: 'Home', as: 'a', href: '/'};
        let aboutTab = {key: 'about', name: 'about', as: 'a', href: '/about'};
        var items = [homeTab].concat(...topics, aboutTab);

        if (props.addItems) {
            items = items.concat(props.addItems);
        }

        var activeIndex;
        if (props.activeItem) {
            var keys = items.map((item) => item.key);
            activeIndex = keys.indexOf(props.activeItem);
        }

        this.state = {
            activeIndex: activeIndex || 0,
            items: items,
            topics: topics
        };
    }



    render() {
        return <div>
            <Menu
                    fixed='top'
                    inverted
                    pointing
                    items={ this.state.items }
                    activeIndex={ this.state.activeIndex }/>
        </div>
    }

};

export default HeaderMenu;