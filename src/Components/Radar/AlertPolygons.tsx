import { Polygon } from "react-leaflet";
import { AlertType, WeatherData } from "../../ts/WeatherData";
import { useAlert } from "../Contexes/AlertContex";
import { useWeather } from "../Contexes/WeatherContext";
import { LatLngExpression } from 'leaflet';
import React from "react";

function GetPolygonColor(alertType: AlertType) {
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

function ConvertToLatLng(coords: number[][][]): LatLngExpression[] {
    return coords[0].map<LatLngExpression>(latlng => {
        return {
            lat: latlng[1],
            lng: latlng[0]
        };
    });
}

const AlertPolygons = () => {
    const alertData = useWeather().alerts;
    const alertModals = useAlert();

    return (
        <>
            {
                alertData.map((singleAlert, index) => {
                    if(!singleAlert.geometry) return <React.Fragment key={index}/>;
            
                    const polygonColor = GetPolygonColor(WeatherData.GetAlertType(singleAlert));
            
                    return <Polygon key={index} pathOptions={{color: polygonColor}} positions={ConvertToLatLng(singleAlert.geometry.coordinates)} eventHandlers={{click: () => alertModals.showAlert(index)}}/>;
                })
            }
        </>
    );
};

export default AlertPolygons;