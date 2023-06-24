import { Polygon } from "react-leaflet";
import { useWeather } from "Contexts/Weather";
import { LatLngExpression } from 'leaflet';
import { useModal } from "Contexts/ModalContext";
import { AlertModal } from "../Alert/AlertModal";
import { AlertHelpers } from "../Alert/Common";

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
    const modals = useModal();

    return (
        <>{
            alerts.filter(alert => alert.geometry !== null).map((alert, index) => {
                const onClick = (e: L.LeafletMouseEvent) => {
                    //Don't show modal if we weren't clicked
                    const event = e.originalEvent;
                    if(event.target !== event.currentTarget) return;

                    modals.showModal(<AlertModal alert={alerts[index]}/>);
                };

                return (
                    <Polygon 
                        className={AlertHelpers.GetAlertCSSClass(alert)} 
                        key={index} 
                        positions={ConvertToLatLng(alert.geometry.coordinates)} 
                        eventHandlers={{click: onClick}}
                    />
                );
            })
        }</>
    );
};

export default AlertPolygons;