import React, { Component } from 'react';
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    List,
    Responsive,
    Segment,
    Sidebar,
    Visibility,
} from 'semantic-ui-react';
import HeaderMenu from "./HeaderMenu";

const HomepageHeading = ({ mobile }) => (
    <Container text>
        <Header
            as='h1'
            content='GIS4DIS'
            inverted
            style={{
                fontSize: mobile ? '2em' : '4em',
                fontWeight: 'bold',
                marginBottom: 0,
                marginTop: mobile ? '2em' : '3em',
            }}
        />
        <Header
            as='h2'
            content='Dynamic mapping methods oriented to risk and disaster management in the era of big data'
            inverted
            style={{
                fontSize: mobile ? '1.5em' : '1.7em',
                fontWeight: 'normal',
                marginTop: mobile ? '0.5em' : '1.5em',
                marginBottom: mobile ? '0.5em' : '1.5em',
            }}
        />
    </Container>
);

class DesktopContainer extends Component {
    render() {
        const { children, topics } = this.props;

        return (
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>

                    <Segment
                        inverted
                        color='blue'
                        textAlign='center'
                        style={{ padding: '1em 0em' }}
                        vertical
                    >
                        <HeaderMenu topics={ topics }/>
                        <HomepageHeading />
                    </Segment>

                {children}
            </Responsive>
        );
    }
}

class MobileContainer extends Component {
    render() {
        const { children, topics } = this.props;

        return (
            <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                <Segment
                    inverted
                    color='blue'
                    textAlign='center'
                    style={{ padding: '1em 0em' }}
                    vertical
                >
                    <HeaderMenu topics={ topics }/>
                    <HomepageHeading mobile />
                </Segment>

                {children}
            </Responsive>
        );
    }
}

const ResponsiveContainer = (props) => (
    <div>
        <DesktopContainer topics={ props.topics }>{props.children}</DesktopContainer>
        <MobileContainer topics={ props.topics }>{props.children}</MobileContainer>
    </div>
);

const HomepageLayout = (props) => (
    <ResponsiveContainer topics={ props.topics }>
        <Segment style={{ padding: '4em 0em' }} vertical>
            <Grid container stackable verticalAlign='top' divided>
                <Grid.Column width={8} style={{ padding: '1em' }}>
                    <Header as='h3' style={{ fontSize: '2em' }}>
                        Project goals
                    </Header>
                    <List bulleted style={{ fontSize: '1.33em' }}>
                        <List.Item>efficient methods for gathering, processing, integration and sharing of spatial data</List.Item>
                        <List.Item>collecting and processing data from different sources</List.Item>
                        <List.Item>cartographic presentation in real time (ie. rapid mapping) for crisis management</List.Item>
                    </List>
                    <Container textAlign='center'>
                        <Button primary size='huge' href='http://geogr.muni.cz/gis4dis'>
                            Find out more
                            <Icon name='right arrow' />
                        </Button>
                    </Container>
                </Grid.Column>
                <Grid.Column width={8} style={{ padding: '1em' }}>
                    <List style={{ fontSize: '1em' }}>
                        <List.Item>
                            Acronym:
                            <List.List style={{ fontSize: '1.33em', color: 'blue' }}>
                                <List.Item>GIS4DIS</List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            Project Period:
                            <List.List style={{ fontSize: '1.33em', color: 'blue' }}>
                                <List.Item>1. 4. 2017 - 31. 12. 2019</List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            Code and investor of project:
                            <List.List style={{ fontSize: '1.33em', color: 'blue' }}>
                                <List.Item>LTACH-17002</List.Item>
                                <List.Item>Ministry of Education, Youth and Sports (Czech Republic)</List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>Programme:
                            <List.List style={{ fontSize: '1.33em', color: 'blue' }}>
                                <List.Item>INTER-EXCELLENCE, INTER-ACTION</List.Item>
                            </List.List>
                        </List.Item>
                    </List>
                </Grid.Column>
            </Grid>
        </Segment>

        <Segment style={{ padding: '2em 0em 4em' }} vertical>
            <Container>
                <Header as='h3' style={{ fontSize: '2em' }}>
                    Partners
                </Header>

                <Grid container stackable verticalAlign='top'>
                    <Grid.Column width={8}>
                        <Grid container verticalAlign='top'>
                            <Grid.Column width={6}>
                                <Image src='static/mc/logo/muni-lg-white.png' style={ {background: 'rgb(0, 0, 200)'} }/>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <List style={{ fontSize: '1.33em', fontWeight: 'bold' }}>
                                    <List.Item>
                                        <a href='https://www.muni.cz/en'>Masaryk university</a>
                                        <List.List style={{ fontSize: '1em', fontWeight: 'normal' }}>
                                            <List.Item >
                                                <a href='http://geogr.muni.cz/lgc'>Laboratory on Geoinformatics and Cartography</a>
                                                <List.List style={{ fontSize: '0.8em' }}>
                                                    <List.Item as='a' href='http://geogr.muni.cz/about-institute'>
                                                        Department of Geography
                                                    </List.Item>
                                                    <List.Item as='a' href='http://www.sci.muni.cz/en/SCI/'>
                                                        Faculty of Science
                                                    </List.Item>
                                                </List.List>
                                            </List.Item>
                                        </List.List>
                                    </List.Item>
                                </List>
                            </Grid.Column>
                        </Grid>
                    </Grid.Column>

                    <Grid.Column width={8}>
                        <Grid container verticalAlign='top'>
                            <Grid.Column width={6}>
                                <Image src='static/mc/logo/Nanjing_Normal_University_logo.png' />
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <List style={{ fontSize: '1.33em', fontWeight: 'bold' }}>
                                    <List.Item>
                                        <a href='http://en.njnu.edu.cn/'>Nanjing Normal University</a>
                                        <List.List style={{ fontSize: '1em', fontWeight: 'normal' }}>
                                            <List.Item>
                                                <a href='http://schools.njnu.edu.cn/geog/research/key-laboratory-of-virtual-geographic-environment-nanjing-normal-university-ministry-of'>
                                                    Key Laboratory of Virtual Geographic Environment
                                                </a>
                                                <List.List style={{ fontSize: '0.8em' }}>
                                                    <List.Item as='a' href='http://schools.njnu.edu.cn/geog/'>
                                                        School of Geography Science
                                                    </List.Item>
                                                </List.List>
                                            </List.Item>
                                        </List.List>
                                    </List.Item>
                                </List>
                            </Grid.Column>
                        </Grid>
                    </Grid.Column>
                </Grid>
            </Container>
        </Segment>

        <Segment inverted vertical style={{ padding: '5em 0em' }}>
            <Container>
                <Grid divided inverted stackable>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Header inverted as='h4' content='About' />
                            <List link inverted>
                                <List.Item as='a' href='http://geogr.muni.cz/gis4dis'>Project site on MUNI</List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Header as='h4' inverted>
                                GIS4DIS
                            </Header>
                            <p>
                                Dynamic mapping methods oriented to risk and disaster management in the era of big data
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Segment>
    </ResponsiveContainer>
);

export default HomepageLayout;