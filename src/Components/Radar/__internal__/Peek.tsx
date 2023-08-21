import React from "react";
import { Popup, useMap } from "react-leaflet";
import type L from "leaflet";

import { useBooleanState, useNullableState } from "Hooks";

import { Button } from "Components/Input";
import PeekModal from "Components/Modals/Peek";

/**
 * A modal displaying some weather information for the given location
 */
export default function Peek() {
    const map = useMap();
    const [position, setPosition] = useNullableState<L.LatLng>();
    const [latlng, setLatLng] = useNullableState<L.LatLng>();
    const [modalOpen, showModal, hideModal] = useBooleanState(false);

    React.useEffect(() => {
        function onClick(e: L.LeafletMouseEvent) {
            if (!map.getContainer().classList.contains("zoom-radar")) return;

            setPosition(e.latlng);
        }

        map.addEventListener("click", onClick);
        return () => {
            map.removeEventListener("click", onClick);
        };
    });

    if (!position) return null;

    return (
        <>
            <Popup position={position} closeOnClick closeOnEscapeKey>
                <Button
                    onClick={e => {
                        e.stopPropagation();
                        map.closePopup();

                        setLatLng(position);
                        showModal();
                    }}
                >
                    Peek Weather
                </Button>
            </Popup>
            <PeekModal
                latitude={latlng?.lat}
                longitude={latlng?.lng}
                isOpen={modalOpen}
                onClose={() => {
                    hideModal();
                }}
            />
        </>
    );
}
