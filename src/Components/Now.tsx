import { useWeather } from './WeatherContext';
import { WeatherCondition, WeatherData } from '../ts/WeatherData';
import { Widget } from './SimpleComponents';

const Now = () => {
    const weatherData = useWeather();
    const forecastData = weatherData.forecast;
    const pointData = weatherData.point;

    const conditionInfo = WeatherData.GetWeatherCondition(forecastData.current_weather.weathercode);

    //Determine what background should be applied
    let background;
    switch(conditionInfo.condition) {
        case WeatherCondition.OVERCAST:
            background = `overcast-${weatherData.IsDay() ? "day" : "night"}`;
            break;
        case WeatherCondition.RAIN: 
        case WeatherCondition.RAIN_SHOWERS:
            background = "rain";
            break;
        case WeatherCondition.SNOW:
        case WeatherCondition.SNOW_GRAINS:
        case WeatherCondition.SNOW_SHOWERS:
            background = "snow";
            break;
        default:
            background = `clear-${weatherData.IsDay() ? "day" : "night"}`;
    }

    return (
        <Widget id="now" className={background}>
            <p>{pointData.properties.relativeLocation.properties.city}</p>
    
            <p id="current">{forecastData.current_weather.temperature.toFixed(0)}</p>
    
            <p>{conditionInfo.condition}</p>
            <p>Feels like <span>{forecastData.hourly.apparent_temperature[forecastData.nowIndex].toFixed(0)}</span>°</p>
        </Widget>
    );
};

export default Now;