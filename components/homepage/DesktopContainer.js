import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import HeaderMenu from '../HeaderMenu';
import HomepageHeading from './HomepageHeading';

class DesktopContainer extends PureComponent {
    render() {
        const { children, topics } = this.props;

        return (
            <div className="desktop-homepage">
                <Segment
                    inverted
                    color="blue"
                    textAlign="center"
                    style={{ padding: '1em 0em' }}
                    vertical
                >
                    <HeaderMenu topics={topics} />
                    <HomepageHeading />
                </Segment>

                {children}
            </div>
        );
    }
}

DesktopContainer.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    topics: PropTypes.shape({
        name: PropTypes.string,
        name_id: PropTypes.string,
    }).isRequired,
};

export default DesktopContainer;
