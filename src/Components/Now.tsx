import { useWeather } from './WeatherContext'
import { WeatherHelper } from '../ts/WeatherHelper';

const Now = () => {
    const forecastData = useWeather()!.forecast;
    const pointData = useWeather()!.point;

    return (
        <div id="now">
            <p>{pointData.properties.relativeLocation.properties.city}</p>
    
            <p id="current">{forecastData.current_weather.temperature.toFixed(0)}</p>
    
            <p>{WeatherHelper.GetWeatherCondition(forecastData.current_weather.weathercode).condition}</p>
            <p>Feels like <span>{forecastData.hourly.apparent_temperature[forecastData.currentIndex].toFixed(0)}</span>°</p>
        </div>
    )
}

export default Now;