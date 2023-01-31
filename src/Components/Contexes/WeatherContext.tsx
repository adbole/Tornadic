/**
 * The WeatherContext makes multiple requests to various APIs to gather necessary weather data.
 * open-meteo is used for general weather information while NWS is used to get the location name and alerts. 
 */

import React, { ReactNode } from 'react';
import { WeatherData } from '../../ts/WeatherData';
import { Loader } from '../SimpleComponents';
import { FetchData } from '../../ts/Helpers';

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
    latitude: number,
    longitude: number,
    generationtime_ms: number,
    timezone: string,
    timezone_abbreviation: string,
    elevation: number,
    current_weather: {
        temperature: number,
        windspeed: number,
        winddirection: number,
        weathercode: number,
        time: string
    },
    hourly_units: {
        time: string,
        temperature_2m: string,
        apparent_temperature: string,
        precipitation: string,
        relativehumidity_2m: string,
        dewpoint_2m: string,
        visibility: string,
        windspeed_10m: string,
        winddirection_10m: string,
        weathercode: string
    },
    hourly: {
        time: string[]
        temperature_2m: number[]
        apparent_temperature: number[],
        relativehumidity_2m: number[],
        precipitation: number[],
        dewpoint_2m: number[],
        visibility: number[],
        windspeed_10m: number[],
        winddirection_10m: number[],
        weathercode: number[]
    },
    daily_units: {
        time: string,
        temperature_2m_min: string,
        temperature_2m_max: string,
        weathercode: string,
        sunrise: string,
        sunset: string
    },
    daily: {
        time: string[]
        temperature_2m_min: number[],
        temperature_2m_max: number[],
        weathercode: number[],
        sunrise: string[],
        sunset: string[]
    },
    nowIndex: number //Indicates the index where the value for now occurs in all hourly data arrays
}

//Airquality and forecast data are connected in that the current index for forecast will correlate to the
//correct UV index and AQI for that hour.
export type AirQuality = {
    hourly: {
        time: string[],
        uv_index: number[],
        us_aqi: number[]
    },
}

//Point and Alert data from NWS
export type GridPoint = {
    properties: {
        relativeLocation: {
            properties: {
                city: string,
                state: string
            }
        }
        county: string
    }
}

export type Alert = {
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
}

const WeatherContextProvider = (props: {children: ReactNode}) => {
    const [error, setError] = React.useState<boolean>();
    const [weatherData, setWeather] = React.useState<WeatherData>();

    React.useMemo(() => {
        async function GetData() {
            const pos: GeolocationPosition = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, (error) => {
                    alert(error.message);
                });
            });

            const [latitude, longitude] = [pos.coords.latitude, pos.coords.longitude];
        
            //Now that we have the pos begin making the needed requests
            const forecastURL = new URL("https://api.open-meteo.com/v1/forecast?timezone=auto&current_weather=true");
            const hourly_params = ["temperature_2m", "apparent_temperature", "precipitation", "weathercode", "relativehumidity_2m", "dewpoint_2m", "visibility", "windspeed_10m", "winddirection_10m"];
            const daily_params = ["temperature_2m_min", "temperature_2m_max", "weathercode", "sunrise", "sunset"];
    
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

            //The nws alert endpoint cannot be hit until the point data is provided
            const point = await pointRequest;
            if(!point) {
                setError(true);
                return;
            }

            const lastIndex = point.properties.county.lastIndexOf('/') + 1;

            //Extract the county from the county url given by the point
            const county = point.properties.county.substring(lastIndex);
            const alertReqest = FetchData<{ features: Alert[] }>(`https://api.weather.gov/alerts/active/zone/${county}`, "Could not get alert data from the NWS");

            //Await all the requests to finish
            const [forecast, airquality, alertResponse] = await Promise.all([ forecastRequest, airqualityRequest, alertReqest ]);

            //If any of the requests failed then set the error value to true and abort
            if(!forecast || !airquality || !alertResponse) {
                setError(true);
                return;
            }

            //Get the current hour's index for the forecast data
            for(let i = 0; i < forecast.hourly.time.length; ++i) {
                if(forecast.hourly.time[i] === forecast.current_weather.time) {
                    forecast.nowIndex = i;
                    break;
                }
            }

            //Compile all the data
            setWeather(new WeatherData(forecast, airquality, point, alertResponse.features));
        }

        GetData();
    }, []);

    if(error) {
        return (
            <>
                <h1>An error ocurred in one or more requests to third-party sources. See the console for details</h1>
            </>
        );
    }

    return (
        <WeatherContext.Provider value={weatherData}>
            {weatherData ? props.children : <Loader />}
        </WeatherContext.Provider>
    );
};

export default WeatherContextProvider;