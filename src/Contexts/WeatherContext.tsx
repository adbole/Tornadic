/**
 * The WeatherContext makes multiple requests to various APIs to gather necessary weather data.
 * open-meteo is used for general weather information while NWS is used to get the location name and alerts.
 */

import React from "react";

import { useOpenMeteo, useReadLocalStorage } from "Hooks";
import useNWS from "Hooks/useNWS";

import { throwError } from "ts/Helpers";
import type NWSAlert from "ts/NWSAlert";
import type Weather from "ts/Weather";


const WeatherContext = React.createContext<{
    weather: Weather;
    point: GridPoint;
    alerts: NWSAlert[];
    nationAlerts: NWSAlert[];
}>({} as any);

export const useWeather = () =>
    React.useContext(WeatherContext) ??
    throwError("Please use useWeather inside a WeatherContext provider");

export default function WeatherContextProvider({
    latitude,
    longitude,
    skeletonRender,
    children,
}: {
    latitude?: number;
    longitude?: number;
    skeletonRender: () => JSX.Element;
    children: React.ReactNode;
}) {
    const { weather, isLoading: openLoading } = useOpenMeteo(latitude, longitude);
    const { point, alerts, isLoading: nwsLoading } = useNWS(latitude, longitude);
    const { radarAlertMode } = useReadLocalStorage("userSettings")!;

    const value = React.useMemo(() => {
        if (!weather || !point || !alerts) return null;

        return {
            weather,
            point,
            alerts: radarAlertMode
                ? alerts.filter(alert =>
                      alert.get("affectedZones").includes(point.properties.forecastZone)
                  )
                : alerts,
            nationAlerts: alerts,
        };
    }, [weather, point, alerts, radarAlertMode]);

    const isLoading = openLoading || nwsLoading;

    return !isLoading && value ? (
        <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
    ) : (
        skeletonRender()
    );
}

//Modified WeatherContext only providing alert information
export function AlertProvider({
    latitude,
    longitude,
    skeletonRender,
    children,
}: {
    latitude?: number;
    longitude?: number;
    skeletonRender: () => JSX.Element;
    children: React.ReactNode;
}) {
    const { point, alerts, isLoading } = useNWS(latitude, longitude);
    const { radarAlertMode } = useReadLocalStorage("userSettings")!;

    const value = React.useMemo(() => {
        if (!point || !alerts) return null;

        return {
            point,
            alerts: radarAlertMode
                ? alerts.filter(alert =>
                      alert.get("affectedZones").includes(point.properties.forecastZone)
                  )
                : alerts,
            nationAlerts: alerts,
        };
    }, [point, alerts, radarAlertMode]);

    return !isLoading && value ? (
        <WeatherContext.Provider value={value as any}>{children}</WeatherContext.Provider>
    ) : (
        skeletonRender()
    );
}
