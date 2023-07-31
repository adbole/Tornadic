/**
 * The WeatherContext makes multiple requests to various APIs to gather necessary weather data.
 * open-meteo is used for general weather information while NWS is used to get the location name and alerts. 
 */

import React, { ReactNode } from "react";

import { useNullableState } from "Hooks";

import { useSettings } from "Contexts/SettingsContext/index";
import { UserSettings } from "Contexts/SettingsContext/index.types";

import MessageScreen from "Components/MessageScreen";
import Skeleton from "Components/Skeleton";
import { ExclamationTriangle } from "svgs";

import configureForecast from "ts/DataConfiguration";
import { fetchData, fetchDataAndHeaders } from "ts/Fetch";
import { throwError } from "ts/Helpers";
import NWSAlert from "ts/NWSAlert";
import Weather from "ts/Weather";

import * as WeatherTypes from "./index.types";


const WeatherContext = React.createContext<{
    weather: Weather,
    alerts: NWSAlert[]
}>({} as any);
export const useWeather = () => React.useContext(WeatherContext) ?? throwError("Please use useWeather inside a WeatherContext provider");

async function getURLs(settings: UserSettings): Promise<WeatherTypes.EndpointURLs> {
    const [latitude, longitude] = settings.user_location!;

    //NOTE: Precipitation unit of in affects the unit of visibility to become ft
    const forecastURL = new URL("https://api.open-meteo.com/v1/gfs?timezone=auto&current_weather=true");

    //Type Array<keyof T> provides compile-time checking to ensure array values match a property on T
    const hourly_params: Array<keyof WeatherTypes.Forecast["hourly"]> = [
        "temperature_2m", "apparent_temperature", "precipitation", "weathercode", "relativehumidity_2m", "dewpoint_2m",
        "visibility", "windspeed_10m", "winddirection_10m", "surface_pressure", "precipitation_probability", "windgusts_10m", "uv_index", "is_day"
    ];
    const daily_params: Array<keyof WeatherTypes.Forecast["daily"]> = [
        "temperature_2m_min", "temperature_2m_max", "weathercode", "sunrise", "sunset", "precipitation_probability_max"
    ];

    forecastURL.searchParams.set("latitude", latitude.toString());
    forecastURL.searchParams.set("longitude", longitude.toString());
    forecastURL.searchParams.set("temperature_unit", settings.tempUnit);
    forecastURL.searchParams.set("windspeed_unit", settings.windspeed);
    forecastURL.searchParams.set("precipitation_unit", settings.precipitation);

    hourly_params.forEach(param => forecastURL.searchParams.append("hourly", param));
    daily_params.forEach(param => forecastURL.searchParams.append("daily", param));

    const airQualityURL = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi&timezone=auto`;
    const pointURL = `https://api.weather.gov/points/${latitude},${longitude}`;

    return {
        forecastURL,
        airQualityURL,
        pointURL
    };
}

/**
 * Gets alert data from the NWS. from will determine how this data is gathered and wheather to get old or new point data before getting alerts
 * @param from 
 * @returns 
 */
async function getAlertData(from: string | WeatherTypes.GridPoint): Promise<{
    point: WeatherTypes.GridPoint,
    alerts: NWSAlert[],
    expiresAfter: number
} | null> {
    let point;

    //If we are given a string then we must hit the point endpoint
    if(typeof from === "string") {
        point = await fetchData<WeatherTypes.GridPoint>(from, "National Weather Service API Point Endpoint");
    }
    //If we aren't given a string then we use exisiting point data
    else point = from;

    const lastIndex = point.properties.county.lastIndexOf("/") + 1;

    //Extract the county from the county url given by the point
    const county = point.properties.county.substring(lastIndex);
    const apiResponse = await fetchDataAndHeaders<{ features: NWSAlert[] }>(`https://api.weather.gov/alerts/active/zone/${county}`, "National Weather Service Alert Endpoint");

    const alerts = apiResponse.data.features.map(alert => new NWSAlert(alert));

    //Determine when the alert will expire
    const expiresHeader = new Date(apiResponse.headers.get("expires")!);
    
    //5s buffer added to ensure a request isn't made so soon that the same expires 
    //header is retreived again causing mutliple requests per refresh.
    const expiresAfter = (expiresHeader.getTime() - new Date().getTime()) + 5000;

    return {
        point,
        alerts,
        expiresAfter
    };
}

function smartTimeout(fn: () => void, ms: number) {
    return setTimeout(() => {
        if(document.visibilityState === "hidden") {
            document.addEventListener("visibilitychange", fn, { once: true });
        }
        else {
            fn();
        }
    }, ms);
}

const WeatherContextProvider = ({ children }: { children: ReactNode }) => {
    const { settings } = useSettings();

    const [urls, setURLs] = React.useState<WeatherTypes.EndpointURLs>();
    const [error, setError, unsetError] = useNullableState<string>();

    const [weather, setWeather, unsetWeather] = useNullableState<Weather>();
    const [alerts, setAlerts] = useNullableState<NWSAlert[]>();

    //null here will indicate a refresh is needed as a stored value indicates a timer is running
    const [refresh, setRefresh, unsetRefresh] = useNullableState<NodeJS.Timeout>();
    const [alertRefresh, setAlertRefresh, unsetAlertRefresh] = useNullableState<NodeJS.Timeout>();

    //Setup the urls for all future requests
    React.useMemo(() => getURLs(settings).then(urls => setURLs(urls)), [settings]);

    React.useEffect(() => {
        unsetWeather();
    }, [settings, unsetWeather]);

    React.useEffect(() => {
        async function getData() {    
            if(!urls) return;

            //Perform a full refresh on all data
            if(!refresh || !weather) { 
                if(refresh) clearTimeout(refresh);
                if(alertRefresh) clearTimeout(alertRefresh);

                //Await all the requests to finish
                const [forecast, airquality, alertResponse] = await Promise.all([
                    fetchData<WeatherTypes.Forecast>(urls.forecastURL, "Open-Meteo Weather Forecast").catch(e => setError(e)),
                    fetchData<WeatherTypes.AirQuality>(urls.airQualityURL, "Open-Meteo Air Quality").catch(e => setError(e)),
                    getAlertData(weather?.point ?? urls.pointURL).catch(e => setError(e))
                ]);

                if(!forecast || !airquality ||!alertResponse) return;
                
                //Determine when the next hour is
                const ms = 3.6e6 - new Date().getTime() % 3.6e6;
                setRefresh(smartTimeout(unsetRefresh, ms));
                setAlertRefresh(smartTimeout(unsetAlertRefresh, alertResponse.expiresAfter));

                //Convert data to desired formats
                configureForecast(forecast, settings);
                setWeather(new Weather(forecast, airquality, alertResponse.point));
                setAlerts(alertResponse.alerts);
            }
            else if(!alertRefresh && weather) {
                const alertResponse = await getAlertData(weather.point).catch(e => setError(e));

                if(!alertResponse) return;

                setAlertRefresh(smartTimeout(unsetAlertRefresh, alertResponse.expiresAfter));
                setAlerts(alertResponse.alerts);
            }
        }

        getData();
    }, [urls, refresh, settings, alertRefresh, weather, setAlertRefresh, unsetAlertRefresh, setRefresh, unsetRefresh, setWeather, setError, setAlerts]);

    if(error) {
        return (
            <MessageScreen>
                <ExclamationTriangle />
                <p>An error occured when requesting from the following source: </p>
                <p>{error}</p>

                {/* When there is an error, but data exists, allow the user to dismiss the error message */}
                {weather && <button type="button" onClick={unsetError}>Dismiss (A refresh is required to get new data)</button>}
            </MessageScreen>
        );
    }

    return (
        weather && alerts ? 
            <WeatherContext.Provider value={{ weather, alerts }}>
                {children}
            </WeatherContext.Provider> 
            : <Skeleton />
    );
};

export default WeatherContextProvider;