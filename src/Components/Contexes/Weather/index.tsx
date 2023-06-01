/**
 * The WeatherContext makes multiple requests to various APIs to gather necessary weather data.
 * open-meteo is used for general weather information while NWS is used to get the location name and alerts. 
 */

import React, { ReactNode } from 'react';
import { WeatherData } from './WeatherData';
import { Loader } from '../../SimpleComponents';
import { FetchData } from '../../../ts/Helpers';
import { ExclamationTriangle } from "../../../svgs";
import MessageScreen from '../../MessageScreen';

const WeatherContext = React.createContext<WeatherData | undefined>(undefined);
const temp_unit = "fahrenheit";
const wind_unit = "mph";
const precip_unit = "inch";

export function useWeather() {
    const context = React.useContext(WeatherContext);

    if(!context) {
        throw new Error("Please use useWeather inside a WeatherContext provider");
    } 
    else {
        return context;
    }
}

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
type HourlyProperties<T extends number[] | string> = {
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
    precipitation_probability: T
}

//Helper type to ensure properties are consistent across daily_units and daily
type DailyProperties<T extends number[] | string, Q extends string[] | string> = {
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

//Certain data points in forecast are in units that aren't user friendly
//This method converts such points into better formats
function ConvertData(forecastData: Forecast) {
    //All data point arrays have the same length, so one loop is sufficient
    for(let i = 0; i < forecastData.hourly.time.length; ++i) {
        forecastData.hourly.surface_pressure[i] /= 33.864;
        forecastData.hourly.visibility[i] /= 5280;
    }

    let units = forecastData.hourly_units;

    units.surface_pressure = "inHG";
    units.visibility = "mi";
    units.precipitation = "\"";

    //Other data points have units that are inconsistent with app unit style
    units.apparent_temperature = units.temperature_2m = units.dewpoint_2m = "°";
    units.windspeed_10m = units.windgusts_10m = "mph";
}

const WeatherContextProvider = (props: {children: ReactNode}) => {
    const [error, setError] = React.useState<string[]>();
    const [weatherData, setWeather] = React.useState<WeatherData>();

    React.useMemo(() => {
        async function GetData() {
            const pos: GeolocationPosition = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));

            const [latitude, longitude] = [pos.coords.latitude, pos.coords.longitude];
        
            //NOTE: Precipitation unit of in affects the unit of visibility to become ft
            //Now that we have the pos begin making the needed requests
            const forecastURL = new URL("https://api.open-meteo.com/v1/forecast?timezone=auto&current_weather=true");

            //Type Array<keyof T> provides compile-time checking to ensure array values match a property on T
            const hourly_params: Array<keyof HourlyProperties<any>> = [
                "temperature_2m", "apparent_temperature", "precipitation", "weathercode", "relativehumidity_2m", "dewpoint_2m", 
                "visibility", "windspeed_10m", "winddirection_10m", "surface_pressure", "precipitation_probability", "windgusts_10m"
            ];
            const daily_params: Array<keyof DailyProperties<any, any>> = [
                "temperature_2m_min", "temperature_2m_max", "weathercode", "sunrise", "sunset", "precipitation_probability_max"
            ];
    
            forecastURL.searchParams.set("latitude", latitude.toString());
            forecastURL.searchParams.set("longitude", longitude.toString());
            forecastURL.searchParams.set("temperature_unit", temp_unit);
            forecastURL.searchParams.set("windspeed_unit", wind_unit);
            forecastURL.searchParams.set("precipitation_unit", precip_unit);
    
            hourly_params.forEach(param => forecastURL.searchParams.append("hourly", param));
            daily_params.forEach(param => forecastURL.searchParams.append("daily", param));

            console.log(`https://api.weather.gov/points/${latitude},${longitude}`);
    
            //Start the requests
            const [forecastRequest, airqualityRequest, pointRequest] = [
                FetchData<Forecast>(forecastURL, "Could not get forecast data from open-meteo"),
                FetchData<AirQuality>(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=uv_index,us_aqi&timezone=auto`, "Could not get air quality data from open-meteo"),
                FetchData<GridPoint>(`https://api.weather.gov/points/${latitude},${longitude}`, "Could not get point data from the NWS")
            ];

            //The nws alert endpoint cannot be hit unless the point data is provided
            const point = await pointRequest;
            if(!point) {
                setError(["National Weather Service API Point Endpoint"]);
                return;
            }

            const lastIndex = point.properties.county.lastIndexOf('/') + 1;

            //Extract the county from the county url given by the point
            const county = point.properties.county.substring(lastIndex);
            const alertRequest = FetchData<{ features: NWSAlert[] }>(`https://api.weather.gov/alerts/active/zone/${county}`, "Could not get alert data from the NWS");

            //Await all the requests to finish
            const [forecast, airquality, alertResponse] = await Promise.all([ forecastRequest, airqualityRequest, alertRequest ]);

            //If any of the requests failed then set the error array to the proper sources
            if(!forecast || !airquality || !alertResponse) {
                const errorSources: string[] = [];

                if(!forecast) errorSources.push("Open-Meteo Weather Forecast");
                if(!airquality) errorSources.push("Open-Meteo Air Quality");
                if(!alertResponse) errorSources.push("National Weather Service API Alert Endpoint");

                setError(errorSources);
                return;
            }

            //Get the current hour's index for the forecast data
            for(let i = 0; i < forecast.hourly.time.length; ++i) {
                if(forecast.hourly.time[i] === forecast.current_weather.time) {
                    forecast.nowIndex = i;
                    break;
                }
            }

            //Convert data to desired formats
            ConvertData(forecast);
            setWeather(new WeatherData(forecast, airquality, point, alertResponse.features));
        }

        GetData();
    }, []);

    if(error !== undefined && error.length !== 0) {
        return (
            <MessageScreen>
                <ExclamationTriangle />
                <p>An error occured when requesting from the following sources: </p>
                {error.map(source => (
                    <p>{source}</p>
                ))}
            </MessageScreen>
        );
    }

    return (
        <WeatherContext.Provider value={weatherData}>
            {weatherData ? props.children : <Loader />}
        </WeatherContext.Provider>
    );
};

export default WeatherContextProvider;