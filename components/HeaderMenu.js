import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';


class HeaderMenu extends React.Component {
    constructor(props) {
        super(props);

        var items = [
            {key: 'home', name: 'Home', as: 'a', href: '/'},
            {key: 'map', name: 'Map', as: 'a', href: '/map'}
        ];

        if (props.addItems) {
            items = items.concat(props.addItems);
        }

        this.state = {
            activeItem: props.activeItem || 'home',
            items: items
        };
    }

    render() {
        return <div>
            <Menu fixed='top' inverted items={ this.state.items } />
        </div>
    }

};

export default HeaderMenu;