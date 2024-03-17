/**
 * The WeatherContext uses hooks to make multiple requests to various APIs to gather necessary weather data.
 * open-meteo is used for general weather information while NWS is used to get the location name and alerts.
 */

import testIds from "@test-consts/testIDs";

import React from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import { useNWS, useOpenMeteo } from "Hooks";

import { throwError } from "ts/Helpers";
import type NWSAlert from "ts/NWSAlert";
import { vars } from "ts/StyleMixins";
import type Weather from "ts/Weather";


const WeatherContext = React.createContext<{
    weather: Weather;
    point: GridPoint;
    alerts: NWSAlert[];
} | null>(null);

const shine = keyframes({ to: { backgroundPositionX: "-200%" } });

const LoadingBar = styled.div({
    position: "fixed",
    left: 0,
    top: 0,
    width: "100%",
    height: "5px",
    background: `linear-gradient(90deg, #070c84, #3d9fa5, #8538b3, #070c84)`,
    backgroundSize: "200%, 100%",
    animation: `${shine} 2s linear infinite`,
    zIndex: vars.zLayer2
})

export const useWeather = () =>
    React.useContext(WeatherContext) ??
    throwError("Please use useWeather inside a WeatherContext provider");

export default function WeatherContextProvider({
    latitude,
    longitude,
    skeleton,
    children,
}: {
    latitude?: number;
    longitude?: number;
    skeleton: React.ReactNode;
    children: React.ReactNode;
}) {
    const { weather, isLoading: openLoading, isValidating } = useOpenMeteo(latitude, longitude);
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

    return value ? (
        <>
            { (isLoading || isValidating) && <LoadingBar data-testid={testIds.WeatherContext.LoadingBar}/> }
            <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
        </>
    ) : (
        <>{skeleton}</>
    );
}