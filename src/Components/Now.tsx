import { useRef } from "react";

import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Chart";
import { Widget, WidgetSize } from "Components/SimpleComponents";

import { WeatherConditionType } from "ts/WeatherCondition";

/**
 * Displays the current location name, temperature, condition, and feels like temperature along with having a gradient to match the condition
 * @returns The Now widget
 */
const Now = () => {
    const { weather } = useWeather();
    const now = weather.getNow();

    const { showModal } = useModal();
    const background = useRef("clear-day");

    document.body.classList.remove(background.current);

    //Determine what background should be applied
    switch(now.conditionInfo.type) {
        case WeatherConditionType.OVERCAST:
            background.current = `overcast-${weather.isDay() ? "day" : "night"}`;
            break;
        case WeatherConditionType.RAIN: 
        case WeatherConditionType.RAIN_SHOWERS:
            background.current = "rain";
            break;
        case WeatherConditionType.THUNDERSTORMS:
        case WeatherConditionType.THRUNDERSTORMS_HAIL:
            background.current = "thunderstorms";
            break;
        case WeatherConditionType.SNOW:
        case WeatherConditionType.SNOW_GRAINS:
        case WeatherConditionType.SNOW_SHOWERS:
            background.current = "snow";
            break;
        default:
            background.current = `clear-${weather.isDay() ? "day" : "night"}`;
    }

    document.body.classList.add(background.current);

    return (
        <Widget id="now" size={WidgetSize.LARGE} className={background.current} onClick={() => showModal(<Chart showView={"temperature_2m"}/>)}>
            <p>{now.location}</p>
    
            <h1>{now.temperature}</h1>
    
            <p>{now.conditionInfo.intensity} {now.conditionInfo.type}</p>
            <p>Feels like <span>{now.feelsLike}</span>°</p>
        </Widget>
    );
};

export default Now;