import React from "react";
import useSWR from "swr";

import { fetchData } from "ts/Fetch";
import Weather from "ts/Weather";

import useReadLocalStorage from "./useReadLocalStorage";


export default function useOpenMeteo(
    latitude?: number,
    longitude?: number
): {
    weather: Weather | undefined;
    isLoading: boolean;
} {
    const settings = useReadLocalStorage("userSettings");
    const urls = React.useMemo(() => {
        if (latitude !== undefined && longitude !== undefined && settings)
            return getUrls(latitude, longitude, settings);
    }, [latitude, longitude, settings]);

    const key = urls ? JSON.stringify(urls) : null;
    const { data: weather, isLoading } = useSWR<Weather, string>(
        key,
        async () => {
            const [forecast, airquality] = await Promise.all([
                fetchData<Forecast>(urls!.forecastURL, "Error getting Open-Meteo forecast"),
                fetchData<AirQuality>(urls!.airQualityURL, "Error getting Open-Meteo air quality"),
            ]);

            return new Weather(forecast, airquality, settings!);
        },
        { refreshInterval: () => 3.6e6 - (Date.now() % 3.6e6) }
    );

    return {
        weather,
        isLoading,
    };
}

function getUrls(
    latitude: number,
    longitude: number,
    userSettings: UserSettings
): {
    forecastURL: URL;
    airQualityURL: string;
} {
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

    return {
        forecastURL,
        airQualityURL,
    };
}
