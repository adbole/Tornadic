/**
 * The WeatherContext makes multiple requests to various APIs to gather necessary weather data.
 * open-meteo is used for general weather information while NWS is used to get the location name and alerts.
 */

import type { ReactNode } from "react";
import React from "react";

import { useAPIUrls, useNullableState, useReadLocalStorage } from "Hooks";

import MessageScreen from "Components/MessageScreen";
import Skeleton from "Components/Skeleton";
import { ExclamationTriangle } from "svgs";

import { fetchData, fetchDataAndHeaders } from "ts/Fetch";
import { throwError } from "ts/Helpers";
import NWSAlert from "ts/NWSAlert";
import Weather from "ts/Weather";

import type * as WeatherTypes from "./index.types";


const WeatherContext = React.createContext<{
    weather: Weather;
    alerts: NWSAlert[];
}>({} as any);
export const useWeather = () =>
    React.useContext(WeatherContext) ??
    throwError("Please use useWeather inside a WeatherContext provider");

/**
 * Gets alert data from the NWS. from will determine how this data is gathered and wheather to get old or new point data before getting alerts
 * @param from
 * @returns
 */
async function getAlertData(from: string | WeatherTypes.GridPoint): Promise<{
    point: WeatherTypes.GridPoint;
    alerts: NWSAlert[];
    expiresAfter: number;
} | null> {
    let point;

    if (typeof from === "string") {
        point = await fetchData<WeatherTypes.GridPoint>(
            from,
            "National Weather Service API Point Endpoint"
        );
    } else point = from;

    const lastIndex = point.properties.county.lastIndexOf("/") + 1;

    //Extract the county from the county url given by the point
    const county = point.properties.county.substring(lastIndex);
    const apiResponse = await fetchDataAndHeaders<{ features: NWSAlert[] }>(
        `https://api.weather.gov/alerts/active/zone/${county}`,
        "National Weather Service Alert Endpoint"
    );

    const alerts = apiResponse.data.features.map(alert => new NWSAlert(alert));

    //Determine when the alert will expire
    const expiresHeader = new Date(apiResponse.headers.get("expires")!);

    //5s buffer added to ensure a request isn't made so soon that the same expires
    //header is retreived again causing mutliple requests per refresh.
    const expiresAfter = expiresHeader.getTime() - new Date().getTime() + 5000;

    return {
        point,
        alerts,
        expiresAfter,
    };
}

function smartTimeout(fn: () => void, ms: number) {
    return setTimeout(() => {
        if (document.visibilityState === "hidden") {
            document.addEventListener("visibilitychange", fn, { once: true });
        } else {
            fn();
        }
    }, ms);
}

function WeatherContextProvider({ children }: { children: ReactNode }) {
    const settings = useReadLocalStorage("userSettings");

    const urls = useAPIUrls();
    const [error, setError, unsetError] = useNullableState<string>();

    const [weather, setWeather, unsetWeather] = useNullableState<Weather>();
    const [alerts, setAlerts] = useNullableState<NWSAlert[]>();

    //null here will indicate a refresh is needed as a stored value indicates a timer is running
    const [refresh, setRefresh, unsetRefresh] = useNullableState<NodeJS.Timeout>();
    const [alertRefresh, setAlertRefresh, unsetAlertRefresh] = useNullableState<NodeJS.Timeout>();

    React.useEffect(() => {
        if(urls)
            unsetWeather()
    }, [urls, unsetWeather])

    React.useEffect(() => {
        unsetWeather();
    }, [settings, unsetWeather]);

    React.useEffect(() => {
        async function getData() {
            if (!urls) return;

            //Perform a full refresh on all data
            if (!refresh || !weather) {
                if (refresh) clearTimeout(refresh);
                if (alertRefresh) clearTimeout(alertRefresh);

                //Await all the requests to finish
                const [forecast, airquality, alertResponse] = await Promise.all([
                    fetchData<WeatherTypes.Forecast>(
                        urls.forecastURL,
                        "Open-Meteo Weather Forecast"
                    ).catch(e => setError(e)),
                    fetchData<WeatherTypes.AirQuality>(
                        urls.airQualityURL,
                        "Open-Meteo Air Quality"
                    ).catch(e => setError(e)),
                    getAlertData(weather?.point ?? urls.pointURL).catch(e => setError(e)),
                ]);

                if (!forecast || !airquality || !alertResponse) return;

                //Determine when the next hour is
                const ms = 3.6e6 - (new Date().getTime() % 3.6e6);
                setRefresh(smartTimeout(unsetRefresh, ms));
                setAlertRefresh(smartTimeout(unsetAlertRefresh, alertResponse.expiresAfter));

                //Convert data to desired formats
                setWeather(new Weather(forecast, airquality, alertResponse.point, settings!));
                setAlerts(alertResponse.alerts);
            } else if (!alertRefresh && weather) {
                const alertResponse = await getAlertData(weather.point).catch(e => setError(e));

                if (!alertResponse) return;

                setAlertRefresh(smartTimeout(unsetAlertRefresh, alertResponse.expiresAfter));
                setAlerts(alertResponse.alerts);
            }
        }

        getData();
    }, [
        urls,
        refresh,
        settings,
        alertRefresh,
        weather,
        setAlertRefresh,
        unsetAlertRefresh,
        setRefresh,
        unsetRefresh,
        setWeather,
        setError,
        setAlerts,
    ]);

    const value = React.useMemo(() => {
        if (!weather || !alerts) return null;

        return {
            weather,
            alerts,
        };
    }, [weather, alerts]);

    if (error) {
        return (
            <MessageScreen>
                <ExclamationTriangle />
                <p>An error occured when requesting from the following source: </p>
                <p>{error}</p>

                {/* When there is an error, but data exists, allow the user to dismiss the error message */}
                {value?.weather && (
                    <button type="button" onClick={unsetError}>
                        Dismiss (A refresh is required to get new data)
                    </button>
                )}
            </MessageScreen>
        );
    }

    return value ? (
        <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
    ) : (
        <Skeleton />
    );
}

export default WeatherContextProvider;
