import { useRef } from "react";
import ReactDOMServer from "react-dom/server";
import { GeoJSON, useMap } from "react-leaflet";
import type { SerializedStyles } from "@emotion/react";
import { css, Global } from "@emotion/react";

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
    const alertToShow = useRef(alerts[0]);

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
            {alerts
                .filter(alert => alert.hasCoords())
                .map(alert => {
                    const onClick = () => {
                        //Don't show modal if the radar isn't zoomed
                        if (!map.dragging.enabled()) return;

                        alertToShow.current = alert;
                        showModal();
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

                                layer.on("mouseover", () => {
                                    layer.openPopup();
                                });
                            }}
                        />
                    );
                })}
            <AlertModal alerts={[alertToShow.current]} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
