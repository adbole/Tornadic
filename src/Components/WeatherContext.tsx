import React, { ReactNode } from 'react'
import Loader from './Loader'

const WeatherContext = React.createContext<WeatherData | undefined>(undefined);
const temp_unit = "fahrenheit"
const wind_unit = "mph"
const precip_unit = "inch"

export const useWeather = () => {
    const context = React.useContext(WeatherContext);

    if(!context) {
        console.error("Please use useWeather inside a WeatherContext provider");
        return null;
    } 
    else {
        return context;
    }
}

export type WeatherData = {
    forecast: Forecast
    airquality: AirQuality
}

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
    currentIndex: number
}

export type AirQuality = {
    hourly: {
        time: string[],
        uv_index: number[],
        us_aqi: number[]
    },
}

function GetData(url: string | URL, onSuccess: (t: any) => void, onErrorMessage: string) {
    fetch(url)
    .then((response) => response.ok ? response.json() : Promise.reject(onErrorMessage))
    .then((data) => onSuccess(data))
    .catch((error) => console.error(error))
}

const WeatherContextProvider = (props: {children: ReactNode}) => {
    const [position, setPosition] = React.useState<GeolocationPosition>();
    const [forecast, setForecast] = React.useState<Forecast>();
    const [airquality, setAirQuality] = React.useState<AirQuality>();
    const [weatherData, setWeather] = React.useState<WeatherData>();
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        async function GetPosition() {
            const pos: GeolocationPosition = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
        
            setPosition(pos);
        }

        GetPosition();
    }, [])

    //Once the position is obtained, make a request to NWS's points endpoint to determine where to get forecast data
    React.useEffect(() => {
        if(!position) return;

        const forecastURL = new URL("https://api.open-meteo.com/v1/forecast?timezone=auto&current_weather=true")
        const hourly_params = ["temperature_2m", "apparent_temperature", "precipitation", "weathercode", "relativehumidity_2m", "dewpoint_2m", "visibility", "windspeed_10m", "winddirection_10m"];
        const daily_params = ["temperature_2m_min", "temperature_2m_max", "weathercode", "sunrise", "sunset"];

        forecastURL.searchParams.set("latitude", position.coords.latitude.toString());
        forecastURL.searchParams.set("longitude", position.coords.longitude.toString());
        forecastURL.searchParams.set("temperature_unit", temp_unit);
        forecastURL.searchParams.set("windspeed_unit", wind_unit);
        forecastURL.searchParams.set("precipitation_unit", precip_unit);

        hourly_params.forEach(param => forecastURL.searchParams.append("hourly", param))
        daily_params.forEach(param => forecastURL.searchParams.append("daily", param))

        const forecastCallback = (data: any) => {
            const forecast = data as Forecast
            for(let i = 0; i < forecast.hourly.time.length; ++i) {
                if(forecast.hourly.time[i] == forecast.current_weather.time) {
                    forecast.currentIndex = i;
                    break;
                }
            }

            setForecast(forecast)
        }

        GetData(forecastURL, forecastCallback, "Failed to get data from open-meteo")
        GetData(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=uv_index,us_aqi&timezone=auto`, setAirQuality, "Failed to get air quality data from open-meteo")
    }, [position])


    React.useEffect(() => {
        if(!forecast || !airquality) return;

        setWeather({
            forecast: forecast,
            airquality: airquality
        })

        setReady(true);
    }, [forecast, airquality])

    return (
        <WeatherContext.Provider value={weatherData}>
            {ready ? props.children : <Loader />}
        </WeatherContext.Provider>
    )
}

export default WeatherContextProvider