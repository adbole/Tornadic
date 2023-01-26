import { useWeather } from './WeatherContext'
import { WeatherHelper } from '../ts/WeatherHelper';
import { Widget } from './SimpleComponents';

const Now = () => {
    const forecastData = useWeather()!.forecast;
    const pointData = useWeather()!.point;

    const conditionInfo = WeatherHelper.GetWeatherCondition(forecastData.current_weather.weathercode);

    return (
        <Widget id="now" className='clear-night'>
            <p>{pointData.properties.relativeLocation.properties.city}</p>
    
            <p id="current">{forecastData.current_weather.temperature.toFixed(0)}</p>
    
            <p>{conditionInfo.condition}</p>
            <p>Feels like <span>{forecastData.hourly.apparent_temperature[forecastData.currentIndex].toFixed(0)}</span>°</p>
        </Widget>
    )
}

export default Now;