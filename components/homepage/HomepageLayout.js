import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Grid, Header, Icon, Image, List, Segment } from 'semantic-ui-react';
import TopicCards from '../TopicCards';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';

const ResponsiveContainer = ({ topics, children }) => (
    <div>
        <DesktopContainer topics={topics}>{children}</DesktopContainer>
        <MobileContainer topics={topics}>{children}</MobileContainer>
    </div>
);

ResponsiveContainer.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    topics: PropTypes.shape({
        name: PropTypes.string,
        name_id: PropTypes.string,
    }).isRequired,
};

const HomepageLayout = ({ topics }) => (
    <ResponsiveContainer topics={topics}>
        <Segment
            style={{
                padding: 'var(--segment-top-bottom-padding, 4em) var(--segment-side-padding, 0em)',
            }}
            vertical
        >
            <Grid container stackable verticalAlign="top" divided>
                <Grid.Column width={8} style={{ padding: '1em' }}>
                    <Header as="h3" style={{ fontSize: '2em' }}>
                        Project goals
                    </Header>
                    <List bulleted style={{ fontSize: '1.33em' }}>
                        <List.Item>
                            efficient methods for gathering, processing, integration and sharing of
                            spatial data
                        </List.Item>
                        <List.Item>collecting and processing data from different sources</List.Item>
                        <List.Item>
                            cartographic presentation in real time (ie. rapid mapping) for crisis
                            management
                        </List.Item>
                    </List>
                    <Container textAlign="center">
                        <Button primary size="huge" href="http://geogr.muni.cz/gis4dis">
                            Find out more
                            <Icon name="right arrow" />
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
                                <List.Item>
                                    Ministry of Education, Youth and Sports (Czech Republic)
                                </List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            Programme:
                            <List.List style={{ fontSize: '1.33em', color: 'blue' }}>
                                <List.Item>INTER-EXCELLENCE, INTER-ACTION</List.Item>
                            </List.List>
                        </List.Item>
                    </List>
                </Grid.Column>
            </Grid>
        </Segment>

        <Segment style={{ padding: '2em var(--segment-side-padding, 0em)' }} vertical>
            <Container>
                <Header as="h3" style={{ fontSize: '2em' }}>
                    Topics
                </Header>
                <TopicCards topics={topics} />
            </Container>
        </Segment>

        <Segment style={{ padding: '2em var(--segment-side-padding, 0em)' }} vertical>
            <Container>
                <Header as="h3" style={{ fontSize: '2em' }}>
                    Partners
                </Header>

                <Grid container stackable verticalAlign="top">
                    <Grid.Column width={8}>
                        <Grid container verticalAlign="top">
                            <Grid.Column mobile={16} tablet={6} computer={6}>
                                <Image
                                    src="static/mc/logo/muni-lg-white.png"
                                    style={{ background: 'rgb(0, 0, 200)' }}
                                />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={10} computer={10}>
                                <List style={{ fontSize: '1.33em', fontWeight: 'bold' }}>
                                    <List.Item>
                                        <a href="https://www.muni.cz/en">Masaryk university</a>
                                        <List.List
                                            style={{ fontSize: '1em', fontWeight: 'normal' }}
                                        >
                                            <List.Item>
                                                <a href="http://geogr.muni.cz/lgc">
                                                    Laboratory on Geoinformatics and Cartography
                                                </a>
                                                <List.List style={{ fontSize: '0.8em' }}>
                                                    <List.Item
                                                        as="a"
                                                        href="http://geogr.muni.cz/about-institute"
                                                    >
                                                        Department of Geography
                                                    </List.Item>
                                                    <List.Item
                                                        as="a"
                                                        href="http://www.sci.muni.cz/en/SCI/"
                                                    >
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
                        <Grid container verticalAlign="top">
                            <Grid.Column mobile={16} tablet={6} computer={6}>
                                <Image src="static/mc/logo/Nanjing_Normal_University_logo.png" />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={10} computer={10}>
                                <List style={{ fontSize: '1.33em', fontWeight: 'bold' }}>
                                    <List.Item>
                                        <a href="http://en.njnu.edu.cn/">
                                            Nanjing Normal University
                                        </a>
                                        <List.List
                                            style={{ fontSize: '1em', fontWeight: 'normal' }}
                                        >
                                            <List.Item>
                                                <a href="http://schools.njnu.edu.cn/geog/research/key-laboratory-of-virtual-geographic-environment-nanjing-normal-university-ministry-of">
                                                    Key Laboratory of Virtual Geographic Environment
                                                </a>
                                                <List.List style={{ fontSize: '0.8em' }}>
                                                    <List.Item
                                                        as="a"
                                                        href="http://schools.njnu.edu.cn/geog/"
                                                    >
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

        <Segment inverted vertical style={{ padding: '5em var(--segment-side-padding, 0em)' }}>
            <Container>
                <Grid divided inverted stackable>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Header inverted as="h4" content="About" />
                            <List link inverted>
                                <List.Item as="a" href="http://geogr.muni.cz/gis4dis">
                                    Project site on MUNI
                                </List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Header as="h4" inverted>
                                GIS4DIS
                            </Header>
                            <p>
                                Dynamic mapping methods oriented to risk and disaster management in
                                the era of big data
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Segment>
    </ResponsiveContainer>
);

HomepageLayout.propTypes = {
    topics: PropTypes.shape({
        name: PropTypes.string,
        name_id: PropTypes.string,
    }).isRequired,
};

export default HomepageLayout;
