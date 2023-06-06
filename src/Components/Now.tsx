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
    const weather = useWeather();
    const now = weather.GetNow();

    const {showModal} = useModal();

    //Determine what background should be applied
    let background;
    switch(now.conditionInfo.condition) {
        case WeatherCondition.OVERCAST:
            background = `overcast-${weather.IsDay() ? "day" : "night"}`;
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
            background = `clear-${weather.IsDay() ? "day" : "night"}`;
    }

    document.body.classList.add(background);

    return (
        <Widget id="now" className={background} onClick={() => showModal(<Chart showView={ChartViews.Temperature}/>)}>
            <p>{now.location}</p>
    
            <h1>{now.temperature}</h1>
    
            <p>{now.conditionInfo.condition}</p>
            <p>Feels like <span>{now.feelsLike}</span>°</p>
        </Widget>
    );
};

export default Now;