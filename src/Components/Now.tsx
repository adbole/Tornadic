import { useRef } from "react";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Widget from "Components/Widget";
import { Gear } from "svgs/widget";

import { WeatherConditionType } from "ts/WeatherCondition";

import LocationInput from "./Input/LocationInput";
import Modal, { ModalContent } from "./Modals/Modal";
import SettingsModal from "./Modals/SettingsModal";

/**
 * Displays the current location name, temperature, condition, and feels like temperature along with having a gradient to match the condition
 * @returns The Now widget
 */
const Now = () => {
    const { weather } = useWeather();

    const [locationModalIsOpen, showLocationModal, hideLocationModal] = useBooleanState(false);
    const [settingsOpen, showSettings, hideSettings] = useBooleanState(false);

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
        <>
            <Widget id="now" size={"widget-large"} className={background.current}>
                <button className="settings-btn" type="button" onClick={() => showSettings() }><Gear/></button>

                <p onClick={() => showLocationModal()}>{now.location}</p>
        
                <h1>{now.temperature}</h1>
        
                <p>{now.conditionInfo.intensity} {now.conditionInfo.type}</p>
                <p>Feels like <span>{now.feelsLike}</span>°</p>
            </Widget>
            <SettingsModal isOpen={settingsOpen} onClose={hideSettings}/>
            <Modal isOpen={locationModalIsOpen} onClose={hideLocationModal}>
                <ModalContent>
                    <LocationInput/>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Now;