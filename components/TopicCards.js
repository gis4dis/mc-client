import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'semantic-ui-react';

const TopicCards = ({ topics }) => (
    <div>
        <Card.Group centered>
            {topics.map(topic => {
                return (
                    <Card
                        key={topic.name_id}
                        className="card"
                        as="a"
                        href={`topics/${topic.name_id}`}
                    >
                        <Image src={`static/mc/images/${topic.name_id}.jpg`} />
                        <Card.Content>
                            <Card.Header
                                style={{ textAlign: 'center', textTransform: 'uppercase' }}
                            >
                                {topic.name}
                            </Card.Header>
                        </Card.Content>
                    </Card>
                );
            })}
        </Card.Group>
    </div>
);

TopicCards.propTypes = {
    topics: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            name_id: PropTypes.string,
        })
    ).isRequired,
};

export default TopicCards;
