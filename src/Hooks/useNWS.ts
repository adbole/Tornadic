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
    const expires = React.useRef<number>(0);

    const { data: point, isLoading: pointLoading } = useSWR(
        latitude && longitude ? `https://api.weather.gov/points/${latitude},${longitude}` : null,
        url => fetchData<GridPoint>(url, "Error getting point from the NWS")
    );

    const alertEndpoint = React.useMemo(() => {
        if (!latitude || !longitude) return null;

        let endpoint = "https://api.weather.gov/alerts/active/";

        if (!radarAlertMode) {
            endpoint += `?point=${latitude},${longitude}`;
        }

        return endpoint;
    }, [radarAlertMode, latitude, longitude]);

    const { data: alerts, isLoading: alertsLoading } = useSWR(
        alertEndpoint,
        async url => {
            expires.current = 0;

            const response = await fetchDataAndHeaders<{ features: NWSAlert[] }>(
                url,
                "Error getting alerts from the NWS"
            );

            const expiresHeader = new Date(response.headers.get("expires")!);

            //5s buffer added to ensure a request isn't made so soon that the same expires
            //header is retreived again causing mutliple requests per refresh.
            const expiresAfter = expiresHeader.getTime() - Date.now() + 5000;
            expires.current = expiresAfter;

            return removeExpiredAlerts(response.data.features.map(alert => new NWSAlert(alert)));
        },
        { 
            refreshInterval: () => expires.current,
            refreshWhenHidden: true
        }
    );

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
            for (let i = index + 1; i < alerts.length; ++i) {
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
