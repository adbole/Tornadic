import React from 'react';
import ReactDOM from 'react-dom/client';
import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import { useMap } from 'react-leaflet';

import { Grid } from '../../svgs/radar';

/**
 * Provides the zooming functionality for the Radar component along with returning a button to be added to leaflet to provide unzooming
 * @returns A button to allow unzooming once inside the zoomed Radar
 */
const Home = (props: L.ControlOptions & {
    radar: React.MutableRefObject<HTMLDivElement | null>
}) => {
    const [isZoomed, setIsZoomed] = React.useState(false);
    const radar = props.radar.current;
    const map = useMap();

    function zoom() {
        if (isZoomed) return;

        setIsZoomed(true);
        radar?.classList.add("zoom-radar");
        document.body.classList.add("hide-overflow");
        window.scrollTo(0, 0);

        map.invalidateSize();
        map.dragging.enable();
        map.scrollWheelZoom.enable();
    }

    function unZoom(e: Event) {
        e.stopPropagation();
        setIsZoomed(false);

        radar?.classList.remove("zoom-radar");
        document.body.classList.remove("hide-overflow");

        map.invalidateSize();
        map.dragging.disable();
        map.scrollWheelZoom.disable();
    }
    
    radar?.addEventListener("click", zoom);

    const Home = L.Control.extend({
        onAdd: () => {
            const button = L.DomUtil.create("a", "leaflet-custom-control button");
            button.addEventListener("click", unZoom);
            ReactDOM.createRoot(button).render(<Grid />);

            return button;
        }
    });

    return new Home();
};

export default createControlComponent(Home);