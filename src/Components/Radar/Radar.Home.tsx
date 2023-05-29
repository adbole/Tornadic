import React from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

import { Grid } from '../../svgs/radar';
import { useMountedEffect } from '../../ts/Helpers';

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

    const zoom = React.useCallback(() => !isZoomed && setIsZoomed(true), [isZoomed]);
    const unZoom = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsZoomed(false);
    };

    React.useEffect(() => {
        radar?.addEventListener("click", zoom);
        return () => radar?.removeEventListener("click", zoom);
    }, [radar, zoom]);

    useMountedEffect(() => {
        radar?.classList.toggle('zoom-radar');
        document.body.classList.toggle('zoom-radar');

        map.invalidateSize();
        map.dragging.enabled() ? map.dragging.disable() : map.dragging.enable();
        map.scrollWheelZoom.enabled() ? map.scrollWheelZoom.disable() : map.scrollWheelZoom.enable();
    }, [isZoomed, map, radar]);

    return <button type="button" className="leaflet-custom-control leaflet-control" onClick={unZoom}><Grid /></button>;
};

export default Home;