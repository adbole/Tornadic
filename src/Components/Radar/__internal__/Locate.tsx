import React from "react";
import ReactDOMServer from "react-dom/server";
import { useMap } from "react-leaflet";
import L from "leaflet";

import { useUserLocation } from "Hooks";

import { Button } from "Components/Input";
import { Cursor, LocationDot } from "svgs/radar";


const Current_Location_Icon = L.divIcon({
    html: ReactDOMServer.renderToString(<LocationDot />),
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

    const { latitude: lat, longitude: lng, status } = useUserLocation();

    React.useEffect(() => {
        if (!(lat && lng) || status !== "OK") return;

        const coords = {
            lat,
            lng,
        };

        if (!currMarker.current) {
            currMarker.current = L.marker(coords, {
                icon: Current_Location_Icon,
                title: "Current Location Marker",
            }).addTo(map);
        }

        map.panTo(coords);
        currMarker.current.setLatLng(coords);
    }, [lat, lng, map, status]);

    return (
        <Button
            className="leaflet-custom-control leaflet-control"
            onClick={() => lat && lng && map.panTo({ lat, lng })}
            style={{ padding: 0, marginBottom: 0 }}
            title="Pan to current location"
        >
            <Cursor />
        </Button>
    );
}
