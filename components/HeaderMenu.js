import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';


class HeaderMenu extends React.Component {
    constructor(props) {
        super(props);

        var items = [
            {key: 'home', name: 'Home', as: 'a', href: '/'},
            {key: 'map', name: 'Map', as: 'a', href: '/map'},
            {key: 'about', name: 'about', as: 'a', href: '/about'}
        ];

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
            items: items
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