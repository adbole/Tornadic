import React from "react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

import { useBooleanState, usePermission } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import AlertModal from "Components/Modals/Alert";

import type NWSAlert from "ts/NWSAlert";

import AlertWidget, { AlertInformation, ExcessAlerts } from "./style";


const getPriorityAlert = (alerts: NWSAlert[]) =>
    alerts.reduce(
        (highest, next) => (next.priority < highest.priority ? next : highest),
        alerts[0]
    );

function Alert({ noNotify = false }) {
    const { alerts: unfilteredAlerts, point } = useWeather();
    const notiPermission = usePermission("notifications")

    const [modalOpen, showModal, hideModal] = useBooleanState(false);

    const alerts = unfilteredAlerts.filter(alert => {
        //Point and NWSAlert include the necessary GeoJSON properties for this to work so conversion to any is okay
        const inBounds = alert.hasCoords() && booleanPointInPolygon(point as any, alert as any)
            
        return alert.get("affectedZones").includes(point.properties.forecastZone) || inBounds
    });

    const previousAlertTime = React.useRef(new Date(alerts[0]?.get("sent") ?? 0));

    React.useEffect(() => {
        if (noNotify || alerts.length === 0 || notiPermission !== "granted") return;

        const newAlerts = alerts.filter((alert) => new Date(alert.get("sent")) > previousAlertTime.current);

        if (newAlerts.length > 0) {
            const alert = getPriorityAlert(newAlerts);

            const additionalAlerts = newAlerts.length > 1 ? `\n+${newAlerts.length - 1} more alert(s)` : "";

            new Notification(`${alert.get("event")}`, {
                body: `Issued: ${alert.get("sent")}\nExpires: ${alert.get("expires") ?? alert.get("ends")}${additionalAlerts}`,
            });

            previousAlertTime.current = new Date(newAlerts[0].get("sent"));
        }

    //This effect should only run if alerts changes, noNotify and notiPermission are excluded as changing them could 
    //cause unnecessary notifications to be sent annoying the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alerts]);

    if (!alerts.length) return null;

    const alert = getPriorityAlert(alerts);

    return (
        <>
            <AlertWidget
                type={alert.getAlertCSS()}
                isTemplate
                size="widget-wide"
                onClick={showModal}
            >
                <AlertInformation>
                    <h1>{alert.get("event")}</h1>
                    <p>
                        <em>Issued:</em> {alert.get("sent")}
                    </p>
                    <p>
                        <em>Until:</em> {alert.get("ends") ?? alert.get("expires")}
                    </p>
                </AlertInformation>

                {alerts.length > 1 && (
                    <ExcessAlerts>+{alerts.length - 1} more alert(s)</ExcessAlerts>
                )}
            </AlertWidget>
            <AlertModal alerts={alerts} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}

export default Alert;
