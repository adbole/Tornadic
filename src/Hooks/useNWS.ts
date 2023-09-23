import React from "react";
import useSWR from "swr";

import { fetchData, fetchDataAndHeaders } from "ts/Fetch";
import NWSAlert from "ts/NWSAlert";

import useReadLocalStorage from "./useReadLocalStorage";


export default function useNWS(
    latitude?: number,
    longitude?: number
): {
    point: GridPoint | undefined;
    alerts: NWSAlert[] | undefined;
    isLoading: boolean;
} {
    const { radarAlertMode } = useReadLocalStorage("userSettings") || {};
    const timeout = React.useRef<NodeJS.Timeout>();

    const { data: point, isLoading: pointLoading } = useSWR(
        latitude && longitude ? `https://api.weather.gov/points/${latitude},${longitude}` : null,
        url => fetchData<GridPoint>(url, "Cannot get point from NWS")
    );

    const alertEndpoint = React.useMemo(() => {
        if (!point) return null;

        let base = "https://api.weather.gov/alerts/active/";

        if (!radarAlertMode) {
            const lastIndex = point.properties.forecastZone.lastIndexOf("/") + 1;
            const zone = point.properties.forecastZone.substring(lastIndex);

            base += `zone/${zone}`;
        }

        return base;
    }, [point, radarAlertMode]);

    const {
        data: alerts,
        isLoading: alertsLoading,
        mutate,
    } = useSWR(alertEndpoint, async url => {
        clearTimeout(timeout.current);

        const response = await fetchDataAndHeaders<{ features: NWSAlert[] }>(
            url,
            "Cannot get alerts form NWS"
        );

        const expiresHeader = new Date(response.headers.get("expires")!);

        //5s buffer added to ensure a request isn't made so soon that the same expires
        //header is retreived again causing mutliple requests per refresh.
        const expiresAfter = expiresHeader.getTime() - new Date().getTime() + 5000;
        timeout.current = setTimeout(() => mutate(), expiresAfter);

        return removeExpiredAlerts(response.data.features.map(alert => new NWSAlert(alert)));
    });

    return {
        point,
        alerts,
        isLoading: pointLoading || alertsLoading,
    };
}

function removeExpiredAlerts(alerts: NWSAlert[]) {
    const markedForDeletion: number[] = [];

    alerts.forEach((alert, index) => {
        const references = alert.get("references");
        const expiredReferences = alert.getParameter("expiredReferences");

        if (
            alert.get("messageType") === "Update" ||
            references.length ||
            expiredReferences?.length
        ) {
            for (let i = index; i < alerts.length; ++i) {
                const id = alerts[i].get("id");

                if (
                    references.some(alert => alert.identifier === id) ||
                    expiredReferences?.some(str => str.includes(id))
                ) {
                    markedForDeletion.push(i);
                }
            }
        }
    });

    return alerts.filter((_, i) => !markedForDeletion.includes(i));
}