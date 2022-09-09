import React from 'react'
import ReactDOM from 'react-dom/client';
import L from 'leaflet'
import { createControlComponent } from '@react-leaflet/core';
import { useMap } from 'react-leaflet'
import { Cursor } from '../../svgs/svgs'


const Current_Location_Icon = L.divIcon({
    html: `
        <svg width="30" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="8" cy="8" rx="8" ry="8" fill="#6498fa"/>
            <ellipse cx="8" cy="8" rx="6" ry="6" fill="#fff"/>
        </svg>   
    `,
    className:"current-location",
    iconSize: [20, 20],
    iconAnchor: [10, 10]
})

const Locate = () => {
    const map = useMap();
    const currMarker = React.useRef<L.Marker>();

    function LocateUser() {
        map.locate({
            setView: true,
            maxZoom: 10
        })
    }    

    React.useEffect(() => {
        LocateUser();

        map.on('locationfound', (e) => {
            if(!currMarker.current) {
                currMarker.current = L.marker(e.latlng, { icon: Current_Location_Icon }).addTo(map);
            }

            //Set the marker position
            currMarker.current.setLatLng(e.latlng);
        })
    }, [])

    const Home = L.Control.extend({
        onAdd: () => {
            const button = L.DomUtil.create("a", "leaflet-custom-control button");;
            ReactDOM.createRoot(button).render(<Cursor />)
            button.addEventListener('click', LocateUser)

            return button;
        }
    });

    return new Home();
}

export default createControlComponent(Locate);