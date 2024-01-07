/**
 * The WeatherContext makes multiple requests to various APIs to gather necessary weather data.
 * open-meteo is used for general weather information while NWS is used to get the location name and alerts.
 */

import React from "react";

import { useNWS, useOpenMeteo } from "Hooks";

import { throwError } from "ts/Helpers";
import type NWSAlert from "ts/NWSAlert";
import type Weather from "ts/Weather";


const WeatherContext = React.createContext<{
    weather: Weather;
    point: GridPoint;
    alerts: NWSAlert[];
} | null>(null);

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

    const value = React.useMemo(() => {
        if (!weather || !point || !alerts) return null;

        return {
            weather,
            point,
            alerts,
        };
    }, [weather, point, alerts]);

    const isLoading = openLoading || nwsLoading;

    return !isLoading && value ? (
        <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
    ) : (
        skeletonRender()
    );
}

//Modified WeatherContext only providing alert information
//Not in use yet
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

    const value = React.useMemo(() => {
        if (!point || !alerts) return null;

        return {
            point,
            alerts,
        };
    }, [point, alerts]);

    return !isLoading && value ? (
        <WeatherContext.Provider value={value as any}>{children}</WeatherContext.Provider>
    ) : (
        skeletonRender()
    );
}
