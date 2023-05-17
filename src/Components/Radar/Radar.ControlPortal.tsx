/*
    Creates a react portal to leaflet-control-container in one of its positions to allow the adding of controls. 
*/

import ReactDOM from "react-dom";
import L from 'leaflet';
import React from "react";

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
    const [portalRoot, setPortalRoot] = React.useState<Element | null>(null);

    React.useEffect(() => {
        const root = document.getElementsByClassName(props.position)[0];

        L.DomEvent.disableClickPropagation(root as HTMLElement);
        setPortalRoot(root);
    }, [props.position]);

    return portalRoot 
    ? ReactDOM.createPortal(props.children, portalRoot)
    : null;
};

export default ControlPortal;