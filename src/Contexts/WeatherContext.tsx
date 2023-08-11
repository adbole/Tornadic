/**
 * The WeatherContext makes multiple requests to various APIs to gather necessary weather data.
 * open-meteo is used for general weather information while NWS is used to get the location name and alerts.
 */

import type { ReactNode } from "react";
import React from "react";

import { useOpenMeteo, useUserLocation } from "Hooks";

import MessageScreen from "Components/MessageScreen";
import Skeleton from "Components/Skeleton";
import { ExclamationTriangle } from "svgs";

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

function WeatherContextProvider({ children }: { children: ReactNode }) {
    const { latitude, longitude, status } = useUserLocation()
    const { weather, alerts, error, getData } = useOpenMeteo(latitude, longitude);

    const value = React.useMemo(() => {
        if (!weather || !alerts) return null;

        return {
            weather,
            alerts,
        };
    }, [weather, alerts]);

    //TODO: Replace message screen with toast and a retry button
    if (error) {
        return (
            <MessageScreen>
                <ExclamationTriangle />
                <p>An error occured when requesting from the following source: </p>
                <p>{(error as unknown as Error).message}</p>

                {/* When there is an error, but data exists, allow the user to dismiss the error message */}
                {weather && (
                    <button type="button" onClick={getData}>
                        Retry
                    </button>
                )}
            </MessageScreen>
        );
    }

    //TODO: Once toast are added. Add another error message here
    // if status !== OK
    
    return value ? (
        <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
    ) : (
        <Skeleton />
    );
}

export default WeatherContextProvider;
