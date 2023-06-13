import { useWeather } from './Contexts/Weather';
import { WeatherConditionType } from 'ts/WeatherCondition';
import { Widget, WidgetSize } from './SimpleComponents';

import { useModal } from './Contexts/ModalContext';
import Chart, { ChartViews } from './Chart';

/**
 * Displays the current location name, temperature, condition, and feels like temperature along with having a gradient to match the condition
 * @returns The Now widget
 */
const Now = () => {
    const weather = useWeather();
    const now = weather.getNow();

    const { showModal } = useModal();

    //Determine what background should be applied
    let background;
    switch(now.conditionInfo.type) {
        case WeatherConditionType.OVERCAST:
            background = `overcast-${weather.isDay(weather.forecast.nowIndex) ? "day" : "night"}`;
            break;
        case WeatherConditionType.RAIN: 
        case WeatherConditionType.RAIN_SHOWERS:
            background = "rain";
            break;
        case WeatherConditionType.THUNDERSTORMS:
        case WeatherConditionType.THRUNDERSTORMS_HAIL:
            background = "thunderstorms";
            break;
        case WeatherConditionType.SNOW:
        case WeatherConditionType.SNOW_GRAINS:
        case WeatherConditionType.SNOW_SHOWERS:
            background = "snow";
            break;
        default:
            background = `clear-${weather.isDay(weather.forecast.nowIndex) ? "day" : "night"}`;
    }

    document.body.classList.add(background);

    return (
        <Widget id="now" size={WidgetSize.LARGE} className={background} onClick={() => showModal(<Chart showView={ChartViews.Temperature}/>)}>
            <p>{now.location}</p>
    
            <h1>{now.temperature}</h1>
    
            <p>{now.conditionInfo.intensity} {now.conditionInfo.type}</p>
            <p>Feels like <span>{now.feelsLike}</span>°</p>
        </Widget>
    );
};

export default Now;