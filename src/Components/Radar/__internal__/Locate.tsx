import React from "react";
import ReactDOMServer from "react-dom/server";
import { useMap } from "react-leaflet";
import L from "leaflet";

import { useLocalStorage, useUserLocation } from "Hooks";

import { Button } from "Components/Input";
import { Cursor, LocationDot } from "svgs/radar";


const Current_Location_Icon = L.divIcon({
    html: ReactDOMServer.renderToString(<LocationDot />),
    className: "current-location",
    iconSize: [20, 20],
    iconAnchor: [10, 20],
});

/**
 * Automatically gets the user's current location in a leaflet map along with returning a button to return the user's current location
 * @returns A button that can return to the user's location at any given time
 */
export default function Locate() {
    const map = useMap();
    const currMarker = React.useRef<L.Marker>();

    const [, setUserLocation] = useLocalStorage("userLocation");
    const { latitude: lat, longitude: lng, status } = useUserLocation();

    React.useEffect(() => {
        if (!(lat && lng) || status !== "OK") return;

        const coords = {
            lat,
            lng,
        };

        if (!currMarker.current) {
            currMarker.current = L.marker(coords, { icon: Current_Location_Icon }).addTo(map);
        }

        map.panTo(coords);
        currMarker.current.setLatLng(coords);
    }, [lat, lng, map, status]);

    return (
        <Button
            className="leaflet-custom-control leaflet-control"
            onClick={() => setUserLocation({ useCurrent: true })}
            style={{ padding: 0 }}
        >
            <Cursor />
        </Button>
    );
}
