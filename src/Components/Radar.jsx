import React from 'react';
import { MapContainer, TileLayer, Polygon, ZoomControl, AttributionControl, LayersControl } from 'react-leaflet'

import { Widget } from './SimpleComponents';
import Home from './Radar_Custom_Controls/Home'
import Playback from './Radar_Custom_Controls/Playback';
import L from 'leaflet';

L.Map.include({
    _initControlPos: function () {
        const corners = this._controlCorners = {}
        const l = 'leaflet-'
        const container = this._controlContainer = L.DomUtil.create('div', l + 'control-container', this._container);
    
        function createCorner(vSide, hSide) {
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

export default class Radar extends React.Component {
    constructor(props) {
        super(props);

        this.map = React.createRef();
        this.radar = React.createRef();

        this.state = {
            isZoomed: false,
        }
    }

    zoom() {
        if(this.state.isZoomed) return;

        this.setState({ isZoomed: true })
        this.radar.current.classList.add("zoom-radar")
        document.body.classList.add("hide-overflow")
        window.scrollTo(0, 0);

        this.map.current.invalidateSize();
        //this.map.current.zoomControl.enable();
        this.map.current.dragging.enable();
        this.map.current.scrollWheelZoom.enable();
    }

    unZoom(e) {
        e.stopPropagation();
        this.setState({ isZoomed: false })

        this.radar.current.classList.remove("zoom-radar");
        document.body.classList.remove("hide-overflow")

    }

    render() {
        const warningPolygon = [
            [
                35.259999999999998,
                -97.920000000000002
            ],
            [
                35.259999999999998,
                -97.920000000000002
            ],
            [
                35.339999999999996,
                -98.019999999999996
            ],
            [
                35.479999899999996,
                -97.909999999999997
            ],
            [
                35.359999999999992,
                -97.739999999999995
            ],
            [
                35.259999999999998,
                -97.920000000000002
            ]
        ]

        return (
            <Widget large id="radar" onClick={this.zoom.bind(this)} ref={this.radar}>
                <MapContainer center={[35.5, -97.5]} zoom={10} zoomControl={false} attributionControl={false} scrollWheelZoom={false} dragging={false} ref={this.map}> 
                    <LayersControl>
                        <LayersControl.BaseLayer checked name="Radar">
                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://www.rainviewer.com/api.html">RainViewer</a>' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        </LayersControl.BaseLayer>
                    </LayersControl>

                    <Polygon pathOptions={{color: 'red'}} positions={warningPolygon} />

                    <ZoomControl position="topright"/>
                    <AttributionControl position="topleft"/>
                    <Home onClick={this.unZoom.bind(this)}/>
                    <Playback />
                </MapContainer>
            </Widget>
        )
    }
}