import React from 'react';
import { MapContainer, TileLayer, Polygon, ZoomControl, AttributionControl } from 'react-leaflet'
import L from 'leaflet';

import { WidgetSize, Widget } from './SimpleComponents';
import Home from './Radar_Custom_Controls/Home'
import Playback from './Radar_Custom_Controls/Playback';
import Locate from './Radar_Custom_Controls/Locate';
import { Tornadic } from '../svgs/svgs';
import { Map } from '../svgs/widget/widget.svgs';

interface IDictionary {
    [indiex: string]: HTMLDivElement
}

L.Map.include({
    _initControlPos: function () {
        const corners = this._controlCorners = {} as IDictionary
        const l = 'leaflet-'
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
})

function Radar() {
    const radar = React.useRef<HTMLDivElement>(null);
    const defaultCent: L.LatLngExpression = {
        lat: 35.5,
        lng: -97.5
    }

    const warningPolygon = [
        {lat: 35.259999999999998, lng: -97.920000000000002},
        {lat: 35.259999999999998, lng: -97.920000000000002},
        {lat: 35.339999999999996, lng: -98.019999999999996},
        {lat: 35.479999899999996, lng: -97.909999999999997},
        {lat: 35.359999999999992, lng: -97.739999999999995},
        {lat: 35.259999999999998, lng: -97.920000000000002}
    ]

    return (
        <Widget id="radar" size={WidgetSize.LARGE} widgetTitle="Radar" widgetIcon={<Map/>} ref={radar}>
            <MapContainer center={defaultCent} zoom={10} zoomControl={false} attributionControl={false} scrollWheelZoom={false} dragging={false}> 
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://www.rainviewer.com/api.html">RainViewer</a>' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                <Polygon pathOptions={{color: 'red'}} positions={warningPolygon} />

                <ZoomControl position="topright"/>
                <AttributionControl position="topleft"/>

                {/* Cutom Controls */}
                <Home radar={radar}/>
                <Locate />
                <Playback/>
            </MapContainer>
        </Widget>
    )
}

export default Radar;