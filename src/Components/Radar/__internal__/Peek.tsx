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
    touchAction: "none",
    "> .leaflet-popup-content-wrapper": { display: "none" },
    transition: "opacity 0.9s linear !important",
});

/**
 * A modal displaying some weather information for the given location
 */
export default function Peek() {
    const map = useMap();
    const [position, setPosition, unsetPosition] = useNullableState<L.LatLng>();
    const [latlng, setLatLng, unsetLatLng] = useNullableState<L.LatLng>();

    const timeout = React.useRef<NodeJS.Timeout>();
    const initialXY = React.useRef<[number, number]>([0, 0]);

    const beginHold = React.useCallback(
        (pos: L.LatLng, xy: [number, number]) => {
            if (!map.dragging.enabled()) return;

            if (timeout.current) {
                clearTimeout(timeout.current);
                timeout.current = undefined;
                unsetPosition();

                return;
            }

            //100ms delay allows for a normal click or tap to pass through without issues.
            timeout.current = setTimeout(() => {
                setPosition(pos);
                initialXY.current = xy;

                timeout.current = setTimeout(() => {
                    unsetPosition();
                    setLatLng(pos);
                }, 900);
            }, 100);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [map]
    );

    const onMouseDown = React.useCallback(
        ({ latlng, originalEvent: { clientX, clientY } }: L.LeafletMouseEvent) =>
            beginHold(latlng, [clientX, clientY]),
        [beginHold]
    );

    const onTouchStart = React.useCallback(
        ({ touches: [touch] }: TouchEvent) => {
            const latlng = map.containerPointToLatLng([touch.clientX, touch.clientY]);

            beginHold(latlng, [touch.clientX, touch.clientY]);
        },
        [map, beginHold]
    );

    const onUp = React.useCallback(() => {
        if (!timeout.current) return;

        clearTimeout(timeout.current);
        timeout.current = undefined;
        unsetPosition();
    }, [unsetPosition]);

    const onMove = React.useCallback(
        (e: L.LeafletMouseEvent | TouchEvent) => {
            if (!timeout.current) return;

            const event =
                window.TouchEvent && e instanceof TouchEvent
                    ? e.touches[e.touches.length - 1]
                    : (e as L.LeafletMouseEvent).originalEvent;

            const xChange = Math.abs(event.clientX - initialXY.current[0]);
            const yChange = Math.abs(event.clientY - initialXY.current[1]);
            const maxChange = 20;

            if (xChange > maxChange || yChange > maxChange) {
                onUp();
            }
        },
        [onUp]
    );

    React.useEffect(() => {
        const mapEvents = [
            ["mousedown", onMouseDown],
            ["mousemove", onMove],
            ["mouseup", onUp],
            ["contextmenu", () => undefined],
        ] as const;

        const containerEvents = [
            ["touchstart", onTouchStart],
            ["touchend", onUp],
            ["touchmove", onMove],
        ] as const;

        mapEvents.forEach(([event, handler]) => map.on(event, handler));

        const mapContainer = map.getContainer();
        containerEvents.forEach(([event, handler]) =>
            mapContainer.addEventListener(event, handler, { passive: true })
        );

        return () => {
            mapEvents.forEach(([event, handler]) => map.off(event, handler));
            containerEvents.forEach(([event, handler]) =>
                mapContainer.removeEventListener(event, handler)
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, beginHold]);

    return (
        <>
            {position && (
                <>
                    <HoldPopup position={position} closeButton={false} offset={[0, 50]} />
                    <Global styles={{ body: { userSelect: "none" } }} />
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
