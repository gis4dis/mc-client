import { Card, Image } from 'semantic-ui-react'

const TopicCards = (props) => (
    <div>
        <Card.Group centered>
            { props.topics.map(function(topic){
                return <Card key={ topic.name_id } className="card" as="a" href={ 'topics/' + topic.name_id }>
                    <Image src={ 'static/mc/images/' + topic.name_id + '.jpg' } />
                    <Card.Content>
                        <Card.Header style={ {textAlign: 'center', textTransform: 'uppercase'} }>{ topic.name }</Card.Header>
                    </Card.Content>
                </Card>
            }) }
        </Card.Group>
    </div>
);


export default TopicCards;
