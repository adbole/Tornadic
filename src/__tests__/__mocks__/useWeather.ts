import { airquality, apiWeatherGov_points, forecast } from "__tests__/__mocks__";

import DEFAULTS from "Hooks/useLocalStorage.config";

import Weather from "ts/Weather";


const useWeather = {
    ...[vi.importActual("Contexts/WeatherContext")],
    useWeather: () => ({
        weather: new Weather(forecast(), airquality(), DEFAULTS.userSettings),
        point: apiWeatherGov_points as GridPoint,
        alerts: []
    })
}

export default useWeather;