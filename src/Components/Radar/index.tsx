import { AttributionControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import { RADAR_PANE } from "Hooks/useRainViewer";

import { Map } from "svgs/widget";

import {
    AlertPolygons,
    ControlPortal,
    Home,
    Locate,
    Opacity,
    Peek,
    Position,
    RainViewer,
} from "./__internal__";
import RadarWidget from "./style";


/**
 * Displays a small Radar widget that can then be clicked to zoom to fullscreen.
 * @returns The Radar widget
 */
function Radar() {
    const defaultCent: L.LatLngExpression = {
        lat: 35.5,
        lng: -97.5,
    };

    return (
        <RadarWidget size="widget-large" widgetTitle="Radar" widgetIcon={<Map />}>
            <MapContainer
                center={defaultCent}
                zoom={10}
                zoomControl={false}
                attributionControl={false}
                scrollWheelZoom={false}
                dragging={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://www.rainviewer.com/api.html">RainViewer</a>'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ZoomControl position="topright" />
                <AttributionControl
                    position="topleft"
                    prefix={
                        '<a href="https://leafletjs.com/" title="A JavaScript library for interactive maps">Leaflet</a>'
                    }
                />

                {/* Custom Controls */}
                <AlertPolygons />
                <ControlPortal position={Position.TOP_RIGHT}>
                    <Home />
                    <Locate />
                    <Opacity defaultOpacity={0.8} targetPane={RADAR_PANE}/>
                </ControlPortal>
                <Peek />
                <RainViewer />
            </MapContainer>
        </RadarWidget>
    );
}

export default Radar;
