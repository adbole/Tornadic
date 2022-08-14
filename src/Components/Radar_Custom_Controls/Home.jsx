import React from 'react';
import ReactDOM from 'react-dom/client';
import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import { useMap } from 'react-leaflet'
import PropTypes from 'prop-types'

import { ReactComponent as Grid } from '../../svgs/grid.svg'


const Home = (props) => {
    const [isZoomed, setIsZoomed] = React.useState(false);
    const radar = props.radar.current
    const map = useMap();

    function zoom() {
        if (isZoomed) return;

        setIsZoomed(true);
        radar.classList.add("zoom-radar")
        document.body.classList.add("hide-overflow")
        window.scrollTo(0, 0);

        map.invalidateSize();
        map.dragging.enable();
        map.scrollWheelZoom.enable();
        console.log(isZoomed)
    }

    function unZoom(e) {
        e.stopPropagation();
        setIsZoomed(false);

        radar.classList.remove("zoom-radar");
        document.body.classList.remove("hide-overflow")

        map.invalidateSize();
        map.dragging.disable();
        map.scrollWheelZoom.disable();
    }

    radar.addEventListener("click", zoom);

    const Home = L.Control.extend({
        onAdd: () => {
            const button = L.DomUtil.create("a", "leaflet-custom-control home");
            button.addEventListener("click", unZoom);
            ReactDOM.createRoot(button).render(<Grid />)

            return button;
        }
    });

    return new Home();
};

Home.propTypes = {
    radar: PropTypes.element.isRequired
}

export default createControlComponent(Home);