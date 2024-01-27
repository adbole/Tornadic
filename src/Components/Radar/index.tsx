import { AttributionControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import styled from "@emotion/styled";

import { Map } from "svgs/widget";

import { vars } from "ts/StyleMixins";

import {
    AlertPolygons,
    ControlPortal,
    Home,
    Legend,
    Locate,
    Peek,
    Position,
    RainViewer,
    Settings,
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
                style={{ zIndex: vars.zLayer1 }}
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
                    <Settings />

                    <Home />
                    <Locate />
                </ControlPortal>
                <ControlPortal position={Position.BOTTOM_CENTER}>
                    <Legend />
                </ControlPortal>

                <Peek />
                <RainViewer />
            </MapContainer>
        </RadarWidget>
    );
}

export default Radar;
