import React from "react";
import ReactDOMServer from "react-dom/server";
import { GeoJSON, useMap } from "react-leaflet";
import type { SerializedStyles } from "@emotion/react";
import { css, Global } from "@emotion/react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point as turf_point } from "@turf/helpers";
import type { LeafletMouseEvent } from "leaflet";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import AlertModal from "Components/Modals/Alert";

import NWSAlert from "ts/NWSAlert";
import { alertColors, vars } from "ts/StyleMixins";


const styles: {
    [K in `.tornadic-${ReturnType<NWSAlert["getAlertCSS"]>}`]: SerializedStyles;
} = {} as any;

Object.entries(alertColors).forEach(([name, { background, foreground }]) => {
    styles[`.tornadic-${name as keyof typeof alertColors}`] = css({
        background,
        color: foreground,
        "&.leaflet-tooltip-top:before": { borderTopColor: background },
    });
});

function AlertTooltip({ alert }: { alert: NWSAlert }) {
    return (
        <>
            <h1>{alert.get("event")}</h1>
            <p>
                <em>Issued: </em>
                {alert.get("sent")}
            </p>
            <p>
                <em>Ends: </em>
                {alert.get("ends") ?? alert.get("expires")}
            </p>
        </>
    );
}

/**
 * Returns a mapping of polygons for every alert there is in the current WeatherData
 * @returns Polygons representing every alert in the current WeatherData
 */
export default function AlertPolygons() {
    const { alerts } = useWeather();
    const map = useMap();

    const [modalOpen, showModal, hideModal] = useBooleanState(false);
    const alertsToShow = React.useRef([alerts[0]]);

    const alertsWithCoords = React.useMemo(
        () => alerts.filter(alert => alert.hasCoords()),
        [alerts]
    );

    if (alertsWithCoords.length === 0) return null;

    return (
        <>
            <Global
                styles={css({
                    ...styles,
                    ".leaflet-tooltip.leaflet-custom-tooltip": {
                        borderRadius: vars.borderRadius,
                        border: "none",
                        padding: "10px",
                        h1: { fontWeight: 500 },
                    },
                })}
            />
            {alertsWithCoords.map(alert => {
                const onClick = (e: LeafletMouseEvent) => {
                    if (!map.dragging.enabled()) return;

                    const points = turf_point([e.latlng.lng, e.latlng.lat]);

                    //NWSAlert includes the necessary GeoJSON properties for this to work so conversion to any is okay
                    const intersectingAlerts = alertsWithCoords.filter(alert =>
                        booleanPointInPolygon(points, alert as any)
                    );

                    if (intersectingAlerts.length > 0) {
                        alertsToShow.current = intersectingAlerts;
                        showModal();
                    }
                };

                return (
                    <GeoJSON
                        key={alert.get("id")}
                        data={alert as unknown as GeoJSON.GeoJsonObject}
                        eventHandlers={{ click: onClick }}
                        style={{ color: alertColors[alert.getAlertCSS()].background }}
                        onEachFeature={(feature, layer) => {
                            const alert = new NWSAlert(feature as unknown as NWSAlert);

                            layer.bindTooltip(
                                ReactDOMServer.renderToString(<AlertTooltip alert={alert} />),
                                {
                                    direction: "top",
                                    className: `leaflet-custom-tooltip tornadic-${alert.getAlertCSS()}`,
                                }
                            );

                            layer.getTooltip()?.setOpacity(1);
                        }}
                    />
                );
            })}
            <AlertModal alerts={alertsToShow.current} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
