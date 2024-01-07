import React from "react";
import { useMap } from "react-leaflet";
import { Global } from "@emotion/react";

import { useBooleanState } from "Hooks";

import { Button } from "Components/Input";
import { Grid } from "svgs/radar";

import { vars } from "ts/StyleMixins";

/**
 * Provides the zooming functionality for the Radar component
 * along with returning a button to be added to leaflet to provide unzooming
 * @returns A button to allow unzooming once inside the zoomed Radar
 */
export default function Home() {
    const [isZoomed, setIsZoomedTrue, setIsZoomedFalse] = useBooleanState(false);

    const map = useMap();

    const zoom = React.useCallback(
        () => !isZoomed && setIsZoomedTrue(),
        [isZoomed, setIsZoomedTrue]
    );

    const unZoom = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsZoomedFalse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const container = map.getContainer();

        container.style.position = "";
        container.addEventListener("click", zoom);
        return () => container.removeEventListener("click", zoom);
    }, [map, zoom]);

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
                            zIndex: vars.zLayer1,
                            inset: 0,
                            position: "fixed",
                        },
                        !isZoomed && {
                            position: "relative",
                            cursor: "pointer",
                            borderRadius: vars.borderRadius,
                            ".leaflet-control-container": { display: "none" },
                        },
                    ],
                }}
            />
            <Button
                className="leaflet-custom-control leaflet-control"
                onClick={unZoom}
                style={{ padding: 0, marginBottom: 0 }}
                title="Return to Dashboard"
            >
                <Grid />
            </Button>
        </>
    );
}
