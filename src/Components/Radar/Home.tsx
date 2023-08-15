import React from "react";
import { useMap } from "react-leaflet";
import { css,Global } from "@emotion/react";

import { useBooleanState } from "Hooks";

import { Grid } from "svgs/radar";

// const default = css({
//     cursor: "pointer",
//     ".leaflet-control": { display: "none" }
// })

/**
 * Provides the zooming functionality for the Radar component
 * along with returning a button to be added to leaflet to provide unzooming
 * @returns A button to allow unzooming once inside the zoomed Radar
 */
export default function Home() {
    const [isZoomed, setIsZoomedTrue, setIsZoomedFalse] = useBooleanState(false);

    const map = useMap();
    const containerId = React.useId()

    const zoom = React.useCallback(
        () => !isZoomed && setIsZoomedTrue(),
        [isZoomed, setIsZoomedTrue]
    );
    const unZoom = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsZoomedFalse();
    };

    React.useEffect(() => {
        const container = map.getContainer()

        container.style.position = ""
        container.addEventListener("click", zoom);
        return () => container.removeEventListener("click", zoom);
    }, [map, zoom, containerId]);

    React.useEffect(() => {
        map.getContainer().classList.toggle("zoom-radar", isZoomed);
        document.body.classList.toggle("zoom-radar", isZoomed);

        map.invalidateSize();
        isZoomed ? map.dragging.enable() : map.dragging.disable();
        isZoomed ? map.scrollWheelZoom.enable() : map.scrollWheelZoom.disable();
    }, [isZoomed, map]);

    return (
        <>
            <Global
                styles={{
                    ".leaflet-container": [
                        isZoomed && {
                            zIndex: "var(--on-top)",
                            inset: 0,
                            position: "fixed",
                        },
                        !isZoomed && {
                            position: "relative",
                            cursor: "pointer",
                            borderRadius: "var(--border-radius)",
                            ".leaflet-control-container": { display: "none" }
                        }
                    ]
                }}
            />
            <button type="button" className="leaflet-custom-control leaflet-control" onClick={unZoom}>
                <Grid />
            </button>
        </>
    );
}
