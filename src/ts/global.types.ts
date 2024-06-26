import type { CombinedHourly } from "./Weather";


export {};

//Helper type to ensure properties are consistent across hourly_units and hourly
type HourlyProperties<T extends number[] | string> = {
    temperature_2m: T;
    apparent_temperature: T;
    relativehumidity_2m: T;
    precipitation: T;
    dewpoint_2m: T;
    visibility: T;
    windspeed_10m: T;
    windgusts_10m: T;
    winddirection_10m: T;
    weathercode: T;
    surface_pressure: T; //hPa
    precipitation_probability: T;
    uv_index: T;
    is_day: T;
    cape: T;
};

//Helper type to ensure properties are consistent across daily_units and daily
type DailyProperties<T extends number[] | string, Q extends string[] | string> = {
    temperature_2m_min: T;
    temperature_2m_max: T;
    weathercode: T;
    sunrise: Q;
    sunset: Q;
    precipitation_probability_max: T;
};

declare global {
    type Forecast = {
        hourly_units: { time: string } & HourlyProperties<string>;
        hourly: { time: string[] } & HourlyProperties<number[]>;
        daily_units: { time: string } & DailyProperties<string, string>;
        daily: { time: string[] } & DailyProperties<number[], string[]>;
    };

    //Airquality and forecast data are connected in that the current index for forecast will correlate to the
    //correct UV index and AQI for that hour.
    type AirQuality = Readonly<{
        hourly: {
            time: string[];
            us_aqi: number[];
        };
    }>;

    //Point and Alert data from NWS
    type GridPoint = Readonly<{
        geometry: {
            coordinates: [number, number];
        };
        properties: {
            relativeLocation: {
                geometry: {
                    coordinates: [number, number];
                };
                properties: {
                    city: string;
                    state: string;
                };
            };
            forecastZone: string;
            county: string;
        };
    }>;

    type ChartViews = keyof Pick<
        CombinedHourly,
        | "temperature_2m"
        | "relativehumidity_2m"
        | "precipitation"
        | "dewpoint_2m"
        | "visibility"
        | "windspeed_10m"
        | "surface_pressure"
        | "us_aqi"
        | "uv_index"
        | "cape"
    >;
}
