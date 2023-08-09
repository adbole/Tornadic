import React from "react";

import type { EndpointURLs,Forecast } from "Contexts/WeatherContext/index.types";

import useReadLocalStorage from "./useReadLocalStorage";
import useUserLocation from "./useUserLocation";


export default function useAPIUrls(): EndpointURLs | undefined {
    const [urls, setUrls] = React.useState<EndpointURLs>()
    const userSettings = useReadLocalStorage("userSettings")
    const { latitude, longitude, status } = useUserLocation()

    React.useEffect(() => {
        if(status !== "OK" || !userSettings)
            return;
    
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

        forecastURL.searchParams.set("latitude", latitude!.toString());
        forecastURL.searchParams.set("longitude", longitude!.toString());
        forecastURL.searchParams.set("temperature_unit", userSettings.tempUnit);
        forecastURL.searchParams.set("windspeed_unit", userSettings.windspeed);
        forecastURL.searchParams.set("precipitation_unit", userSettings.precipitation);

        hourly_params.forEach(param => forecastURL.searchParams.append("hourly", param));
        daily_params.forEach(param => forecastURL.searchParams.append("daily", param));

        const airQualityURL = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi&timezone=auto`;
        const pointURL = `https://api.weather.gov/points/${latitude},${longitude}`;

        setUrls (
            {
                forecastURL,
                airQualityURL,
                pointURL,
            }
        );

    }, [userSettings, latitude, longitude, status])

    return urls
}