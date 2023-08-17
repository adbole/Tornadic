import React from "react";

import { fetchData, fetchDataAndHeaders } from "ts/Fetch";
import NWSAlert from "ts/NWSAlert";
import Weather from "ts/Weather";

import useNullableState from "./useNullableState";
import useReadLocalStorage from "./useReadLocalStorage";


function getUrls(latitude: number, longitude: number, userSettings: UserSettings): EndpointURLs {
    //NOTE: Precipitation unit of in affects the unit of visibility to become ft
    const forecastURL = new URL(
        "https://api.open-meteo.com/v1/gfs?timezone=auto&current_weather=true"
    );

    //Type Array<keyof T> provides compile-time checking to ensure array values match a property on T
    const hourly_params: Array<keyof Forecast["hourly"]> = [
        "temperature_2m",
        "apparent_temperature",
        "precipitation",
        "weathercode",
        "relativehumidity_2m",
        "dewpoint_2m",
        "visibility",
        "windspeed_10m",
        "winddirection_10m",
        "surface_pressure",
        "precipitation_probability",
        "windgusts_10m",
        "uv_index",
        "is_day",
    ];
    const daily_params: Array<keyof Forecast["daily"]> = [
        "temperature_2m_min",
        "temperature_2m_max",
        "weathercode",
        "sunrise",
        "sunset",
        "precipitation_probability_max",
    ];

    forecastURL.searchParams.set("latitude", latitude.toString());
    forecastURL.searchParams.set("longitude", longitude.toString());
    forecastURL.searchParams.set("temperature_unit", userSettings.tempUnit);
    forecastURL.searchParams.set("windspeed_unit", userSettings.windspeed);
    forecastURL.searchParams.set("precipitation_unit", userSettings.precipitation);

    hourly_params.forEach(param => forecastURL.searchParams.append("hourly", param));
    daily_params.forEach(param => forecastURL.searchParams.append("daily", param));

    const airQualityURL = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi&timezone=auto`;
    const pointURL = `https://api.weather.gov/points/${latitude},${longitude}`;

    return {
        forecastURL,
        airQualityURL,
        pointURL,
    };
}

/**
 * Gets alert data from the NWS. from will determine how this data is gathered and wheather to get old or new point data before getting alerts
 * @param from
 * @returns
 */
async function getAlertData(from: string | GridPoint): Promise<{
    point: GridPoint;
    alerts: NWSAlert[];
    expiresAfter: number;
} | null> {
    let point;

    if (typeof from === "string") {
        point = await fetchData<GridPoint>(from, "National Weather Service API Point Endpoint");
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

export default function useOpenMeteo(
    latitude?: number,
    longitude?: number
): {
    weather: Weather | null;
    alerts: NWSAlert[] | null;
    error: string | null;
    getData: () => Promise<void>;
} {
    const settings = useReadLocalStorage("userSettings");
    const [urls, setUrls] = React.useState<EndpointURLs>();

    const [error, setError, unsetError] = useNullableState<string>();

    const [weather, setWeather, unsetWeather] = useNullableState<Weather>();
    const [alerts, setAlerts] = useNullableState<NWSAlert[]>();

    //null here will indicate a refresh is needed as a stored value indicates a timer is running
    const [refresh, setRefresh, unsetRefresh] = useNullableState<NodeJS.Timeout>();
    const [alertRefresh, setAlertRefresh, unsetAlertRefresh] = useNullableState<NodeJS.Timeout>();

    React.useEffect(() => {
        if (latitude && longitude && settings) setUrls(getUrls(latitude, longitude, settings));
    }, [latitude, longitude, settings]);

    React.useEffect(() => {
        if (urls) unsetWeather();
    }, [urls, unsetWeather]);

    React.useEffect(() => {
        unsetWeather();
    }, [settings, unsetWeather]);

    const getData = React.useCallback(async () => {
        if (!urls) return;
        
        //Perform a full refresh on all data
        if (!refresh || !weather) {
            if (refresh) clearTimeout(refresh);
            if (alertRefresh) clearTimeout(alertRefresh);

            const [forecast, airquality, alertResponse] = await Promise.all([
                fetchData<Forecast>(urls.forecastURL, "Open-Meteo Weather Forecast").catch(e =>
                    setError(e)
                ),
                fetchData<AirQuality>(urls.airQualityURL, "Open-Meteo Air Quality").catch(e =>
                    setError(e)
                ),
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

        unsetError()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alertRefresh, refresh, settings, urls, weather]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    return {
        weather,
        alerts,
        error,
        getData,
    };
}
