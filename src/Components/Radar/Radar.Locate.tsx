import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import { useMap } from 'react-leaflet';
import { Cursor, LocationDot } from '../../svgs/radar';

const Current_Location_Icon = L.divIcon({
    html: ReactDOMServer.renderToString(<LocationDot/>),
    className:"current-location",
    iconSize: [20, 20],
    iconAnchor: [10, 20]
});

/**
 * Automatically gets the user's current location in a leaflet map along with returning a button to return the user's current location
 * @returns A button that can return to the user's location at any given time
 */
const Locate = () => {
    const map = useMap();
    const currMarker = React.useRef<L.Marker>();
    const LocateUser = React.useCallback(() => map.locate({ setView: true, maxZoom: 10 }), [map]);

    //Get the user's location on first load along with adding a marker at said location and on every subsequent find.
    React.useEffect(() => {
        LocateUser();

        map.on('locationfound', (e) => {
            if(!currMarker.current) {
                currMarker.current = L.marker(e.latlng, { icon: Current_Location_Icon }).addTo(map);
            }

            //Set the marker position
            currMarker.current.setLatLng(e.latlng);
        });
    }, [LocateUser, map]);

    const Home = L.Control.extend({
        onAdd: () => {
            const button = L.DomUtil.create("a", "leaflet-custom-control button");;
            ReactDOM.createRoot(button).render(<Cursor />);
            button.addEventListener('click', LocateUser);

            return button;
        }
    });

    return new Home();
};

export default createControlComponent(Locate);