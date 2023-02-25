import React from 'react';
import { MapContainer, TileLayer, ZoomControl, AttributionControl } from 'react-leaflet';
import L from 'leaflet';

import { WidgetSize, Widget } from '../SimpleComponents';
import Home from './Home';
import Playback from './Playback';
import Locate from './Locate';
import AlertPolygons from './AlertPolygons';
import { Map } from '../../svgs/widget/widget.svgs';

interface IDictionary {
    [indiex: string]: HTMLDivElement
}

L.Map.include({
    _initControlPos: function () {
        const corners = this._controlCorners = {} as IDictionary;
        const l = 'leaflet-';
        const container = this._controlContainer = L.DomUtil.create('div', l + 'control-container', this._container);
    
        function createCorner(vSide: string, hSide: string) {
            const className = l + vSide + ' ' + l + hSide;
    
            corners[vSide + hSide] = L.DomUtil.create('div', className, container);
        }
    
        createCorner('top', 'left');
        createCorner('top', 'right');
        createCorner('bottom', 'left');
        createCorner('bottom', 'right');
        createCorner('bottom', 'center');
    }
});

/**
 * Displays a small Radar widget that can then be clicked to zoom to fullscreen.
 * @returns The Radar widget
 */
const Radar = () => {
    const radar = React.useRef<HTMLDivElement>(null);
    const defaultCent: L.LatLngExpression = {
        lat: 35.5,
        lng: -97.5
    };

    return (
        <Widget id="radar" size={WidgetSize.LARGE} widgetTitle="Radar" widgetIcon={<Map/>} ref={radar}>
            <MapContainer center={defaultCent} zoom={10} zoomControl={false} attributionControl={false} scrollWheelZoom={false} dragging={false}> 
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://www.rainviewer.com/api.html">RainViewer</a>' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                <ZoomControl position="topright"/>
                <AttributionControl position="topleft" prefix={'<a href="https://leafletjs.com/" title="A JavaScript library for interactive maps">Leaflet</a>'}/>

                {/* Cutom Controls */}
                <AlertPolygons />
                <Home radar={radar}/>
                <Locate />
                <Playback/>
            </MapContainer>
        </Widget>
    );
};

export default Radar;