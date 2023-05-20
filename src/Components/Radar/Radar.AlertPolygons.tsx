import { Polygon } from "react-leaflet";
import { useWeather } from "../Contexes/WeatherContext";
import { LatLngExpression } from 'leaflet';
import React from "react";
import { useModal } from "../Contexes/ModalContext";
import { AlertModal } from "../Alert/Alert.Modal";
import { AlertHelpers } from "../Alert/Alert.Common";

/**
 * Converts the coords given by the NWSAlert to an array of LatLngExpressions to be used by a polygon.
 * @param coords The coords to be converted
 * @returns The new coords to be used by a polygon
 */
function ConvertToLatLng(coords: number[][][]): LatLngExpression[] {
    return coords[0].map<LatLngExpression>(latlng => ({
        lat: latlng[1],
        lng: latlng[0]
    }));
}

/**
 * Returns a mapping of polygons for every alert there is in the current WeatherData
 * @returns Polygons representing every alert in the current WeatherData
 */
const AlertPolygons = () => {
    const alertData = useWeather().alerts;
    const modals = useModal();

    return (
        <>
            {
                alertData.map((alert, index) => {
                    if(!alert.geometry) return null;
            
                    return <Polygon className={AlertHelpers.GetAlertCSSClass(alert)} key={index} positions={ConvertToLatLng(alert.geometry.coordinates)} eventHandlers={{click: () => modals.showModal(<AlertModal alert={alertData[index]}/>)}}/>;
                })
            }
        </>
    );
};

export default AlertPolygons;