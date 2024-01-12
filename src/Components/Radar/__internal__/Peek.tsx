import React from "react";
import { Popup, useMap } from "react-leaflet";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import type L from "leaflet";

import { useNullableState } from "Hooks";

import PeekModal from "Components/Modals/Peek";

import { vars } from "ts/StyleMixins";


const HoldPopup = styled(Popup)({
    marginBottom: 0,
    width: "100px",
    height: "100px",
    borderRadius: vars.borderRadius,
    backdropFilter: "blur(5px)",
    border: "1px solid white",
    pointerEvents: "none",
    "> .leaflet-popup-content-wrapper": { display: "none" },
});

/**
 * A modal displaying some weather information for the given location
 */
export default function Peek() {
    const map = useMap();
    const [position, setPosition, unsetPosition] = useNullableState<L.LatLng>();
    const [latlng, setLatLng, unsetLatLng] = useNullableState<L.LatLng>();

    const timeout = React.useRef<NodeJS.Timeout>();

    const beginHold = React.useCallback(
        (pos: L.LatLng) => {
            if (!map.dragging.enabled()) return;

            setPosition(pos);
            timeout.current = setTimeout(() => {
                unsetPosition();
                setLatLng(pos);
            }, 1000);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [map]
    );

    React.useEffect(() => {
        const onMouseDown = (e: L.LeafletMouseEvent) => beginHold(e.latlng);
        function onTouchStart({ touches: [touch] }: TouchEvent) {
            const latlng = map.containerPointToLatLng([touch.clientX, touch.clientY]);

            beginHold(latlng);
        }

        function onUp() {
            if (!timeout.current) return;

            clearTimeout(timeout.current);
            timeout.current = undefined;
            unsetPosition();
        }

        map.on("mousedown", onMouseDown);
        map.getContainer().addEventListener("touchstart", onTouchStart);
        map.on("mouseup mousemove", onUp);
        map.getContainer().addEventListener("touchend", onUp);
        map.getContainer().addEventListener("touchmove", onUp);

        map.on("contextmenu", () => undefined);
        return () => {
            map.off("mousedown", onMouseDown);
            map.off("mouseup mousemove", onUp);
            map.off("contextmenu");

            map.getContainer().removeEventListener("touchend", onUp);
            map.getContainer().removeEventListener("touchmove", onUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, beginHold]);

    return (
        <>
            {position &&  (
                <>
                    <HoldPopup position={position} closeButton={false} offset={[0, 50]} />
                    <Global styles={{ "body": { userSelect: "none" }}} />
                </>
            )}
            <PeekModal
                latitude={latlng?.lat}
                longitude={latlng?.lng}
                isOpen={Boolean(latlng)}
                onClose={unsetLatLng}
            />
        </>
    );
}
