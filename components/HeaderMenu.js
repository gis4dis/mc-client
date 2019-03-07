import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Menu } from 'semantic-ui-react';

const dropdownStyle = {
    background: 'black !important',
    color: 'white !important',
    textTransform: 'capitalize !important',
};

class HeaderMenu extends React.Component {
    constructor(props) {
        super(props);

        const { activeItem, addItems, topics } = props;

        let topicItems = [];
        if (topics) {
            topicItems = topics.map(topic => {
                return {
                    key: topic.name_id,
                    name: topic.name,
                    href: `/topics/${topic.name_id}`,
                };
            });
        }

        const homeTab = { key: 'home', name: 'Home', as: 'a', href: '/' };
        // let aboutTab = {key: 'about', name: 'about', as: 'a', href: '/about'};
        let items = [homeTab].concat(...topicItems);

        if (addItems) {
            items = items.concat(addItems);
        }

        let activeIndex;
        if (activeItem) {
            const keys = items.map(item => item.key);
            activeIndex = keys.indexOf(activeItem);
        }

        this.state = {
            activeIndex: activeIndex || 0,
            items,
        };
    }

    render() {
        const { children } = this.props;
        const { items, activeIndex } = this.state;

        return (
            <div>
                <Menu
                    className="desktop-menu"
                    fixed="top"
                    inverted
                    pointing
                    items={items}
                    activeIndex={activeIndex}
                />

                <Menu className="mobile-menu" fixed="top" inverted icon>
                    <Dropdown item icon="bars" className="left" style={dropdownStyle}>
                        <Dropdown.Menu style={dropdownStyle}>
                            {items.map((item, index) => {
                                if (activeIndex !== index) {
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
                                return null;
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

HeaderMenu.defaultProps = {
    activeItem: null,
    addItems: null,
    children: undefined,
    topics: null,
};

HeaderMenu.propTypes = {
    activeItem: PropTypes.string,
    addItems: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            name: PropTypes.string,
            href: PropTypes.string,
        })
    ),
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    topics: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            name_id: PropTypes.string,
        })
    ),
};

export default HeaderMenu;
