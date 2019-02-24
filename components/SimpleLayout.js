import { Container } from 'semantic-ui-react';

const containerStyle = {
    position: 'absolute',
    top: '40px',
};

const SimpleLayout = props => (
    <div>
        <Container style={containerStyle}>{props.children}</Container>
    </div>
);

export default SimpleLayout;
