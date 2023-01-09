import { Forecast, useWeather } from './WeatherContext'
import { WeatherHelper } from '../ts/WeatherHelper';

const Now = (props: {
    location: string,
}
) => {
    const forecastData = useWeather()!.forecast;
    return (
        <div id="now">
            <p>{props.location}</p>
    
            <p id="current">{forecastData.current_weather.temperature.toFixed(0)}</p>
    
            <p>{WeatherHelper.GetWeatherCondition(forecastData.current_weather.weathercode).condition}</p>
            <p>Feels like <span>{forecastData.hourly.apparent_temperature[forecastData.currentIndex].toFixed(0)}</span>°</p>
        </div>
    )
}

export default Now;