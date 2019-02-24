import React from 'react';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';

const dropdownStyle = {
    background: 'black !important',
    color: 'white !important',
    textTransform: 'capitalize !important',
};

class HeaderMenu extends React.Component {
    constructor(props) {
        super(props);

        let topics = [];
        if (props.topics) {
            topics = props.topics.map(topic => {
                return {
                    key: topic.name_id,
                    name: topic.name,
                    href: `/topics/${topic.name_id}`,
                };
            });
        }

        const homeTab = { key: 'home', name: 'Home', as: 'a', href: '/' };
        // let aboutTab = {key: 'about', name: 'about', as: 'a', href: '/about'};
        let items = [homeTab].concat(...topics);

        if (props.addItems) {
            items = items.concat(props.addItems);
        }

        let activeIndex;
        if (props.activeItem) {
            const keys = items.map(item => item.key);
            activeIndex = keys.indexOf(props.activeItem);
        }

        this.state = {
            activeIndex: activeIndex || 0,
            items,
            topics,
        };
    }

    render() {
        const { children } = this.props;

        return (
            <div>
                <Menu
                    className="desktop-menu"
                    fixed="top"
                    inverted
                    pointing
                    items={this.state.items}
                    activeIndex={this.state.activeIndex}
                />

                <Menu className="mobile-menu" fixed="top" inverted icon>
                    <Dropdown item icon="bars" className="left" style={dropdownStyle}>
                        <Dropdown.Menu style={dropdownStyle}>
                            {this.state.items.map((item, index) => {
                                if (this.state.activeIndex !== index) {
                                    return (
                                        <Dropdown.Item
                                            key={item.key}
                                            text={item.name}
                                            as="a"
                                            href={item.href}
                                            style={dropdownStyle}
                                        />
                                    );
                                }
                            })}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Menu.Menu position="right" className="right">
                        {children}
                    </Menu.Menu>
                </Menu>
            </div>
        );
    }
}

export default HeaderMenu;
