import { Polygon, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";

import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/WeatherContext";

import AlertModal from "Components/Alert/AlertModal";

/**
 * Converts the coords given by the NWSAlert to an array of LatLngExpressions to be used by a polygon.
 * @param coords The coords to be converted
 * @returns The new coords to be used by a polygon
 */
function convertToLatLng(coords: number[][][]): LatLngExpression[] {
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
            alerts.filter(alert => alert.getCoords()).map(alert => {
                const onClick = () => {
                    //Don't show modal if the radar isn't zoomed
                    if(!map.dragging.enabled()) return;

                    showModal(<AlertModal alerts={[alert]}/>);
                };

                return (
                    <Polygon 
                        className={alert.getAlertCSS()} 
                        key={alert.get("id")} 
                        positions={convertToLatLng(alert.getCoords()!)} 
                        eventHandlers={{ click: onClick }}
                    />
                );
            })
        }</>
    );
};

export default AlertPolygons;