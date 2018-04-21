import Header from './Header'
import Map from '../components/Map'

const layoutStyle = {
    margin: 20,
    padding: 20,
    border: '1px solid #DDD'
}

const Layout = (props) => (
    <div style={layoutStyle}>
        <Header />
        <Map />
    </div>
)

export default Layout