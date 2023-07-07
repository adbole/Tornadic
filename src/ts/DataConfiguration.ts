import { UserSettings } from "Contexts/SettingsContext";
import { Forecast } from "Contexts/WeatherContext/index.types";


export default function configureForecast(forecast: Forecast, settings: UserSettings) {
    const visibilityDivisor = settings.precipitation === "inch" ? 5280 : 1000;

    //All data point arrays have the same length, so one loop is sufficient
    for(let i = 0; i < forecast.hourly.time.length; ++i) {
        //Get the current hour's index for the forecast data
        if(forecast.hourly.time[i] === forecast.current_weather.time) {
            forecast.nowIndex = i;
        }

        //Convert units
        forecast.hourly.surface_pressure[i] /= 33.864;
        forecast.hourly.visibility[i] /= visibilityDivisor;
    }

    const units = forecast.hourly_units;

    units.surface_pressure = "inHG";
    units.visibility = settings.precipitation === "inch" ? "mi" : "km";
    units.precipitation = settings.precipitation === "inch" ? "\"" : "mm";

    //Other data points have units that are inconsistent with app unit style
    units.apparent_temperature = units.temperature_2m = units.dewpoint_2m = "°";
    units.windspeed_10m = units.windgusts_10m = settings.windspeed;
}