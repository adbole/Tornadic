/*
    Creates a react portal to leaflet-control-container in one of its positions to allow the adding of controls. 
*/

import ReactDOM from "react-dom";
import L from 'leaflet';
import React from "react";
import { useNullableState } from "Hooks";

export enum Position {
    TOP_LEFT = "leaflet-top leaflet-left",
    TOP_RIGHT = "leaflet-top leaflet-right",
    BOTTOM_RIGHT = "leaflet-bottom leaflet-left",
    BOTTOM_LEFT = "leaflet-bottom leaflet-left",
    BOTTOM_CENTER = "leaflet-bottom leaflet-center",
}

type ControlPortalProps = {
    position: Position,
    children: React.ReactNode
}

const ControlPortal = (props: ControlPortalProps) => {
    const [portalRoot, setPortalRoot] = useNullableState<Element>();

    React.useEffect(() => {
        const root = document.getElementsByClassName(props.position)[0];

        L.DomEvent.disableClickPropagation(root as HTMLElement);
        setPortalRoot(root);
    }, [props.position, setPortalRoot]);

    return portalRoot 
    ? ReactDOM.createPortal(props.children, portalRoot)
    : null;
};

export default ControlPortal;