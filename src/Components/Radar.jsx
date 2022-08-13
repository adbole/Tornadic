import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { Widget } from './SimpleComponents';

const Radar = () => (
    <Widget large={true} id="radar">
        <MapContainer center={[35.5, -97.5]} zoom={10} scrollWheelZoom={false} zoomControl={false} dragging={false} attributionControl={false}> 
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <TileLayer url="https://tilecache.rainviewer.com/v2/radar/nowcast_acd55f29816d/512/{z}/{x}/{y}/1/1_0.png"/>
        </MapContainer>
    </Widget>
)

export default Radar;