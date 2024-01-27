
import DEFAULTS from "Hooks/useLocalStorage.config";

import Weather from "ts/Weather";

import airquality from "./airquality";
import apiWeatherGov_points from "./api.weather.gov_points";
import forecast from "./forecast";


const useWeather = () => ({
    weather: new Weather(forecast(), airquality(), DEFAULTS.userSettings),
    point: apiWeatherGov_points as GridPoint,
    alerts: [],
})

export default useWeather;
