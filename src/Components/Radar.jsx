import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { Widget } from './BaseComponents';

const Radar = () => (
    <Widget large={true} id="radar">
        <MapContainer center={[35.5, -97.5]} zoom={10} scrollWheelZoom={false} zoomControl={false} dragging={false} attributionControl={false}> 
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        </MapContainer>
    </Widget>
)

export default Radar;