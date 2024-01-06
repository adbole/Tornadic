import { AttributionControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import styled from "@emotion/styled";

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


const BaseLayer = styled(TileLayer)({ filter: "invert(1) hue-rotate(180deg)" });

/**
 * Displays a small Radar widget that can then be clicked to zoom to fullscreen.
 * @returns The Radar widget
 */
function Radar() {
    return (
        <RadarWidget size="widget-large" widgetTitle="Radar" widgetIcon={<Map />}>
            <MapContainer
                center={[35.5, -97.5]}
                zoom={10}
                zoomControl={false}
                attributionControl={false}
                scrollWheelZoom={false}
                dragging={false}
            >
                <BaseLayer
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
                    <Opacity defaultOpacity={0.75} targetPane={RADAR_PANE}/>
                </ControlPortal>
                <Peek />
                <RainViewer />
            </MapContainer>
        </RadarWidget>
    );
}

export default Radar;
