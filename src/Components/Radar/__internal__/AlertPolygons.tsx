import { useRef } from "react";
import { GeoJSON, useMap } from "react-leaflet";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import AlertModal from "Components/Modals/Alert";

import { alertColors } from "ts/StyleMixins";

/**
 * Returns a mapping of polygons for every alert there is in the current WeatherData
 * @returns Polygons representing every alert in the current WeatherData
 */
export default function AlertPolygons() {
    const { nationAlerts: alerts } = useWeather();
    const map = useMap();

    const [modalOpen, showModal, hideModal] = useBooleanState(false);
    const alertToShow = useRef(alerts[0]);

    return (
        <>
            {alerts
                .filter(alert => alert.hasCoords())
                .map(alert => {
                    const onClick = () => {
                        //Don't show modal if the radar isn't zoomed
                        if (!map.dragging.enabled()) return;

                        alertToShow.current = alert;
                        showModal();
                    };

                    const backgroundName = alert.getAlertCSS() as keyof typeof alertColors;

                    return (
                        <GeoJSON
                            key={alert.get("id")}
                            data={alert as unknown as GeoJSON.GeoJsonObject}
                            eventHandlers={{ click: onClick }}
                            style={{ color: alertColors[backgroundName].background }}
                        />
                    );
                })}
            <AlertModal alerts={[alertToShow.current]} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
