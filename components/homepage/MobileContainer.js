import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import HeaderMenu from '../HeaderMenu';
import HomepageHeading from './HomepageHeading';

class MobileContainer extends PureComponent {
    render() {
        const { children, topics } = this.props;

        return (
            <div className="mobile-homepage">
                <Segment
                    inverted
                    color="blue"
                    textAlign="center"
                    style={{ padding: '1em 0em' }}
                    vertical
                >
                    <HeaderMenu topics={topics} />
                    <HomepageHeading mobile />
                </Segment>

                {children}
            </div>
        );
    }
}

MobileContainer.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    topics: PropTypes.shape({
        name: PropTypes.string,
        name_id: PropTypes.string,
    }).isRequired,
};

export default MobileContainer;
