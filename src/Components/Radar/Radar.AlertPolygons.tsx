import { Polygon } from "react-leaflet";
import { AlertType, WeatherData } from "../../ts/WeatherData";
import { useWeather } from "../Contexes/WeatherContext";
import { LatLngExpression } from 'leaflet';
import React from "react";
import { useModal } from "../Contexes/ModalContext";
import { AlertModal } from "../Alert";

/**
 * Takes an AlertType and converts it to a a simple color for the polygon to use
 * @param alertType The AlertType to convert
 * @returns The color to be used
 */
function GetPolygonColor(alertType: AlertType): string {
    switch(alertType) {
        case AlertType.WARNING:
            return "red";
        case AlertType.WATCH:
            return "yellow";
        case AlertType.ADVISORY:
            return "orange";
        default:
            return "gray";
    }
}

/**
 * Converts the coords given by the NWSAlert to an array of LatLngExpressions to be used by a polygon.
 * @param coords The coords to be converted
 * @returns The new coords to be used by a polygon
 */
function ConvertToLatLng(coords: number[][][]): LatLngExpression[] {
    return coords[0].map<LatLngExpression>(latlng => {
        return {
            lat: latlng[1],
            lng: latlng[0]
        };
    });
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
                alertData.map((singleAlert, index) => {
                    if(!singleAlert.geometry) return <React.Fragment key={index}/>;
            
                    const polygonColor = GetPolygonColor(WeatherData.GetAlertType(singleAlert));
            
                    return <Polygon key={index} pathOptions={{color: polygonColor}} positions={ConvertToLatLng(singleAlert.geometry.coordinates)} eventHandlers={{click: () => modals.showModal(<AlertModal alert={alertData[index]}/>)}}/>;
                })
            }
        </>
    );
};

export default AlertPolygons;