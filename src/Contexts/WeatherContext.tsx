/**
 * The WeatherContext makes multiple requests to various APIs to gather necessary weather data.
 * open-meteo is used for general weather information while NWS is used to get the location name and alerts.
 */

import React from "react";

import { useOpenMeteo } from "Hooks";

import Toast from "Components/Toast";

import { throwError } from "ts/Helpers";
import type NWSAlert from "ts/NWSAlert";
import type Weather from "ts/Weather";


const WeatherContext = React.createContext<{
    weather: Weather;
    alerts: NWSAlert[];
}>({} as any);
export const useWeather = () =>
    React.useContext(WeatherContext) ??
    throwError("Please use useWeather inside a WeatherContext provider");

function WeatherContextProvider({ 
    latitude,
    longitude,
    skeletonRender,
    fallbackRender,
    children 
}: { 
    latitude?: number,
    longitude?: number,
    skeletonRender: () => JSX.Element,
    fallbackRender: (getData: VoidFunction) => JSX.Element
    children: React.ReactNode
}) {
    const { weather, alerts, error, getData } = useOpenMeteo(latitude, longitude);

    const value = React.useMemo(() => {
        if (!weather || !alerts) return null;

        return {
            weather,
            alerts,
        };
    }, [weather, alerts]);

    if (error && !value) {
        return fallbackRender(getData)
    }
    
    return value ? (
        <>
            <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
            <Toast
                isOpen={error !== null}
                action={{
                    content: "Try Again",
                    onClick: getData
                }}
            >
                <p>Couldn't get weather data</p>
            </Toast>
        </>
    ) : (
        skeletonRender()
    );
}

export default WeatherContextProvider;
