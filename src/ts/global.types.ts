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
        readonly latitude: number;
        readonly longitude: number;
        readonly generationtime_ms: number;
        readonly timezone: string;
        readonly timezone_abbreviation: string;
        readonly elevation: number;
        readonly current_weather: Readonly<{
            temperature: number;
            windspeed: number;
            winddirection: number;
            weathercode: number;
            time: string;
        }>;
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
        properties: {
            relativeLocation: {
                properties: {
                    city: string;
                    state: string;
                };
            };
            forecastZone: string;
        };
    }>;
}
