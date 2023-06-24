//Forecast and AirQuality are from open-meteo
export type Forecast = {
    readonly latitude: number,
    readonly longitude: number,
    readonly generationtime_ms: number,
    readonly timezone: string,
    readonly timezone_abbreviation: string,
    readonly elevation: number,
    readonly current_weather: Readonly<{
        temperature: number,
        windspeed: number,
        winddirection: number,
        weathercode: number,
        time: string
    }>,
    hourly_units: { time: string } & HourlyProperties<string>,
    hourly: { time: string[] } & HourlyProperties<number[]>,
    daily_units: { time: string } & DailyProperties<string, string>,
    daily: { time: string[] } & DailyProperties<number[], string[]>,
    nowIndex: number //Indicates the index where the value for now occurs in all hourly data arrays
}

//Helper type to ensure properties are consistent across hourly_units and hourly
export type HourlyProperties<T extends number[] | string> = {
    temperature_2m: T
    apparent_temperature: T,
    relativehumidity_2m: T,
    precipitation: T,
    dewpoint_2m: T,
    visibility: T,
    windspeed_10m: T,
    windgusts_10m: T,
    winddirection_10m: T,
    weathercode: T,
    surface_pressure: T, //hPa
    precipitation_probability: T,
    is_day: T
}

//Helper type to ensure properties are consistent across daily_units and daily
export type DailyProperties<T extends number[] | string, Q extends string[] | string> = {
    temperature_2m_min: T,
    temperature_2m_max: T,
    weathercode: T,
    sunrise: Q,
    sunset: Q,
    precipitation_probability_max: T
}

//Airquality and forecast data are connected in that the current index for forecast will correlate to the
//correct UV index and AQI for that hour.
export type AirQuality = Readonly<{
    hourly: {
        time: string[],
        uv_index: number[],
        us_aqi: number[]
    },
}>

//Point and Alert data from NWS
export type GridPoint = Readonly<{
    properties: {
        relativeLocation: {
            properties: {
                city: string,
                state: string
            }
        }
        county: string
    }
}>

export type NWSAlert = Readonly<{
    geometry: {
        coordinates: number[][][]
    }
    properties: {
        areaDesc: string
        sent: string
        effective: string
        expires: string
        ends: string
        severity: string
        certantiy: string
        urgency: string
        event: string
        senderName: string
        headline: string
        description: string
        instruction: string
        response: string
    }
}>

export type EndpointURLs = Readonly<{
    forecastURL: URL,
    airQualityURL: string,
    pointURL: string
}>