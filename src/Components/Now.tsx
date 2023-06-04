import { useWeather } from './Contexts/Weather';
import { WeatherCondition } from './Contexts/Weather/WeatherData';
import { Widget } from './SimpleComponents';

import { useModal } from './Contexts/ModalContext';
import Chart, { ChartViews } from './Chart';

/**
 * Displays the current location name, temperature, condition, and feels like temperature along with having a gradient to match the condition
 * @returns The Now widget
 */
const Now = () => {
    const weatherData = useWeather();
    const nowData = weatherData.GetNow();

    const {showModal} = useModal();

    //Determine what background should be applied
    let background;
    switch(nowData.conditionInfo.condition) {
        case WeatherCondition.OVERCAST:
            background = `overcast-${weatherData.IsDay() ? "day" : "night"}`;
            break;
        case WeatherCondition.RAIN: 
        case WeatherCondition.RAIN_SHOWERS:
            background = "rain";
            break;
        case WeatherCondition.THUNDERSTORMS:
        case WeatherCondition.THRUNDERSTORMS_HAIL:
            background = "thunderstorms";
            break;
        case WeatherCondition.SNOW:
        case WeatherCondition.SNOW_GRAINS:
        case WeatherCondition.SNOW_SHOWERS:
            background = "snow";
            break;
        default:
            background = `clear-${weatherData.IsDay() ? "day" : "night"}`;
    }

    document.body.classList.add(background);

    return (
        <Widget id="now" className={background} onClick={() => showModal(<Chart showProperty={ChartViews.Temperature}/>)}>
            <p>{nowData.location}</p>
    
            <h1>{nowData.temperature}</h1>
    
            <p>{nowData.conditionInfo.condition}</p>
            <p>Feels like <span>{nowData.feelsLike}</span>°</p>
        </Widget>
    );
};

export default Now;