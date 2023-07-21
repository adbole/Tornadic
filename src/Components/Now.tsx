import { useRef } from "react";

import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/WeatherContext";

import Widget from "Components/Widget";
import { Gear } from "svgs/widget";

import { WeatherConditionType } from "ts/WeatherCondition";

import LocationModal from "./LocationModal";
import SettingsModal from "./SettingsModal";

/**
 * Displays the current location name, temperature, condition, and feels like temperature along with having a gradient to match the condition
 * @returns The Now widget
 */
const Now = () => {
    const { weather } = useWeather();
    const { showModal } = useModal();

    const now = weather.getNow();
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
        <Widget id="now" size={"widget-large"} className={background.current}>
            <button className="settings-btn" type="button" onClick={() => showModal(<SettingsModal/>) }><Gear/></button>

            <p onClick={() => showModal(<LocationModal/>)}>{now.location}</p>
    
            <h1>{now.temperature}</h1>
    
            <p>{now.conditionInfo.intensity} {now.conditionInfo.type}</p>
            <p>Feels like <span>{now.feelsLike}</span>°</p>
        </Widget>
    );
};

export default Now;