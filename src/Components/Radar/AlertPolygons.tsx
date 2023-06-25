import { Polygon, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";

import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/Weather";

import { AlertModal } from "../Alert/AlertModal";
import { getAlertCSSClass } from "../Alert/Common";

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
    const { alerts } = useWeather();
    const { showModal } = useModal();
    const map = useMap();

    return (
        <>{
            alerts.filter(alert => alert.geometry !== null).map((alert, index) => {
                const onClick = () => {
                    //Don't show modal if the radar isn't zoomed
                    if(!map.dragging.enabled()) return;

                    showModal(<AlertModal alert={alerts[index]}/>);
                };

                return (
                    <Polygon 
                        className={getAlertCSSClass(alert)} 
                        key={index} 
                        positions={ConvertToLatLng(alert.geometry.coordinates)} 
                        eventHandlers={{ click: onClick }}
                    />
                );
            })
        }</>
    );
};

export default AlertPolygons;