/* eslint-disable import/no-anonymous-default-export */
import { airQualityOpenMeteo, apiOpenMeteo, apiWeatherGov_alerts, apiWeatherGov_points } from "__tests__/__mocks__";

import DEFAULTS from "Hooks/useLocalStorage.config";

import NWSAlert from "ts/NWSAlert";
import Weather from "ts/Weather";


export default {
    ...[vi.importActual("Contexts/WeatherContext")],
    useWeather: () => ({
        weather: new Weather(apiOpenMeteo, airQualityOpenMeteo, DEFAULTS.userSettings),
        point: apiWeatherGov_points as GridPoint,
        alerts: apiWeatherGov_alerts.features.map(alert => new NWSAlert(alert)),
        nationAlerts: apiWeatherGov_alerts.features.map(alert => new NWSAlert(alert))
    })
}