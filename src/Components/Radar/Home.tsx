import React from "react";
import { useMap } from "react-leaflet";

import { useBooleanState } from "Hooks";

import { Grid } from "svgs/radar";

/**
 * Provides the zooming functionality for the Radar component along with returning a button to be added to leaflet to provide unzooming
 * @returns A button to allow unzooming once inside the zoomed Radar
 */
const Home = () => {
    const [isZoomed, setIsZoomedTrue, setIsZoomedFalse] = useBooleanState(false);

    const map = useMap();
    const container = map.getContainer();

    const zoom = React.useCallback(() => !isZoomed && setIsZoomedTrue(), [isZoomed, setIsZoomedTrue]);
    const unZoom = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsZoomedFalse();
    };

    React.useEffect(() => {
        container.addEventListener("click", zoom);
        return () => container.removeEventListener("click", zoom);
    }, [container, zoom]);

    React.useEffect(() => {
        container.classList.toggle("zoom-radar", isZoomed);
        document.body.classList.toggle("zoom-radar", isZoomed);

        map.invalidateSize();
        isZoomed ? map.dragging.enable() : map.dragging.disable();
        isZoomed ? map.scrollWheelZoom.enable() : map.scrollWheelZoom.disable();
    }, [isZoomed, map, container]);

    return <button type="button" className="leaflet-custom-control leaflet-control" onClick={unZoom}><Grid /></button>;
};

export default Home;