/**
 * The WeatherContext makes multiple requests to various APIs to gather necessary weather data.
 * open-meteo is used for general weather information while NWS is used to get the location name and alerts. 
 */

import React, { ReactNode } from 'react';
import { Loader } from 'Components/SimpleComponents';
import MessageScreen from 'Components/MessageScreen';
import { ExclamationTriangle } from "svgs";

import { fetchData, FetchResponse, fetchDataAndHeaders } from 'ts/Fetch';
import { throwError } from 'ts/Helpers';

import { WeatherData } from './WeatherData';
import { 
    Forecast, 
    AirQuality, 
    GridPoint, NWSAlert, 
    EnpointURLs, 
    HourlyProperties, 
    DailyProperties 
} from './index.types';

const WeatherContext = React.createContext<WeatherData | null>(null);
export const useWeather = () => React.useContext(WeatherContext) ?? throwError("Please use useWeather inside a WeatherContext provider");

const TEMP_UNIT = "fahrenheit";
const WIND_UNIT = "mph";
const PRECIP_UNIT = "inch";

async function getURLs(): Promise<EnpointURLs> {
    const pos: GeolocationPosition = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
    
    const [latitude, longitude] = [pos.coords.latitude, pos.coords.longitude];

    //NOTE: Precipitation unit of in affects the unit of visibility to become ft
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
    forecastURL.searchParams.set("temperature_unit", TEMP_UNIT);
    forecastURL.searchParams.set("windspeed_unit", WIND_UNIT);
    forecastURL.searchParams.set("precipitation_unit", PRECIP_UNIT);

    hourly_params.forEach(param => forecastURL.searchParams.append("hourly", param));
    daily_params.forEach(param => forecastURL.searchParams.append("daily", param));

    const airQualityURL = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=uv_index,us_aqi&timezone=auto`;
    const pointURL = `https://api.weather.gov/points/${latitude},${longitude}`;

    return {
        forecastURL: forecastURL,
        airQualityURL: airQualityURL,
        pointURL: pointURL
    };
}

/**
 * Gets alert data from the NWS. from will determine how this data is gathered and wheather to get old or new point data before getting alerts
 * @param from 
 * @returns 
 */
async function getAlertData(from: string | GridPoint): Promise<{
    point: GridPoint,
    alerts: NonNullable<FetchResponse<{features: NWSAlert[]}>>
} | null> {
    let point;

    //If we are given a string then we must hit the point endpoint
    if(typeof from === "string") {
        point = await fetchData<GridPoint>(from, "National Weather Service API Point Endpoint");
    }
    //If we aren't given a string then we use exisiting point data
    else point = from;

    const lastIndex = point.properties.county.lastIndexOf('/') + 1;

    //Extract the county from the county url given by the point
    const county = point.properties.county.substring(lastIndex);
    const alerts = await fetchDataAndHeaders<{features: NWSAlert[]}>(`https://api.weather.gov/alerts/active/zone/${county}`, "National Weather Service Alert Endpoint");

    return {
        point: point,
        alerts: alerts
    };
}

//Configure the forecast data adding and chaning values to be more friendly later on
function configureData(forecastData: Forecast) {
    //All data point arrays have the same length, so one loop is sufficient
    for(let i = 0; i < forecastData.hourly.time.length; ++i) {
        //Get the current hour's index for the forecast data
        if(forecastData.hourly.time[i] === forecastData.current_weather.time) {
            forecastData.nowIndex = i;
        }

        //Convert units
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

const WeatherContextProvider = ({children}: {children: ReactNode}) => {
    const [urls, setURLs] = React.useState<EnpointURLs>();
    const [error, setError] = React.useState<string | null>(null);
    const [weatherData, setWeather] = React.useState<WeatherData | null>(null);

    //null here will indicate a refresh is needed as a stored value indicates a timer is running
    const [refresh, setRefresh] = React.useState<NodeJS.Timeout | null>(null);
    const [alertRefresh, setAlertRefresh] = React.useState<NodeJS.Timeout | null>(null);

    //Setup the urls for all future requests
    React.useMemo(() => getURLs().then(urls => setURLs(urls)), []);

    React.useEffect(() => {
        function configureAlertRefresh(headers: Headers, buffer: boolean = false) {
            //Determine when the alert will expire
            const expires = new Date(headers.get("expires")!);
            //Add a buffer of 30 seconds to prevent sending a request too soon.
            if(buffer) expires.setSeconds(expires.getSeconds() + 30);

            const remainingTime = expires.getTime() - new Date().getTime();

            setAlertRefresh(setTimeout(() => setAlertRefresh(null), remainingTime));
        }

        async function getData() {    
            if(!urls) return;

            //Perform a full refresh on all data
            if(!refresh) { 
                if(alertRefresh) {
                    clearTimeout(alertRefresh);
                    setAlertRefresh(null);
                }

                //Await all the requests to finish
                const [forecast, airquality, alertResponse] = await Promise.all([
                    fetchData<Forecast>(urls.forecastURL, "Open-Meteo Weather Forecast").catch(e => setError(e)),
                    fetchData<AirQuality>(urls.airQualityURL, "Open-Meteo Air Quality").catch(e => setError(e)),
                    getAlertData(weatherData ? weatherData.point : urls.pointURL).catch(e => setError(e))
                ]);

                if(!forecast || !airquality ||!alertResponse) return;
                
                //Determine when the next hour is
                const ms = 3.6e6 - new Date().getTime() % 3.6e6;
                setRefresh(setTimeout(() => setRefresh(null), ms));
                configureAlertRefresh(alertResponse.alerts.headers, true);

                //Convert data to desired formats
                configureData(forecast);
                setWeather(new WeatherData(forecast, airquality, alertResponse.point, alertResponse.alerts.data.features));
            }
            else if(!alertRefresh && weatherData) {
                const alertResponse = await getAlertData(weatherData.point).catch(e => setError(e));

                if(!alertResponse) return;

                configureAlertRefresh(alertResponse.alerts.headers);
                setWeather(new WeatherData(weatherData.forecast, weatherData.airQuality, alertResponse.point, alertResponse.alerts.data.features));
            }
        }

        getData();
    }, [urls, refresh, alertRefresh, weatherData]);

    if(error) {
        return (
            <MessageScreen>
                <ExclamationTriangle />
                <p>An error occured when requesting from the following source: </p>
                <p>{error}</p>

                {/* When there is an error, but data exists, allow the user to dismiss the error message */}
                {weatherData && <button type="button" onClick={() => setError(null)}>Dismiss (A refresh is required to get new data)</button>}
            </MessageScreen>
        );
    }

    return (
        <WeatherContext.Provider value={weatherData}>
            {weatherData ? children : <Loader />}
        </WeatherContext.Provider>
    );
};

export default WeatherContextProvider;