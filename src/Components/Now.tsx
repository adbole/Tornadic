import React from "react";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Modal, { ModalContent } from "Components/Modals/Modal";
import SettingsModal from "Components/Modals/SettingsModal";
import Widget from "Components/Widget";
import { Gear } from "svgs/widget";

import { LocationInput } from "./Input";

/**
 * Displays the current location name, temperature, condition, and feels like temperature along with having a gradient to match the condition
 * @returns The Now widget
 */
export default function Now() {
    const { weather } = useWeather();

    const [locationModalIsOpen, showLocationModal, hideLocationModal] = useBooleanState(false);
    const [settingsOpen, showSettings, hideSettings] = useBooleanState(false);

    const now = weather.getNow();
    const background = React.useRef("clear-day");

    document.body.classList.remove(background.current);

    React.useEffect(() => () => document.body.classList.remove(background.current), [background]);

    //Determine what background should be applied
    switch (now.conditionInfo.type) {
        case "Overcast":
            background.current = `overcast-${weather.isDay() ? "day" : "night"}`;
            break;
        case "Rain":
        case "Rain Showers":
            background.current = "rain";
            break;
        case "Thunderstorms":
        case "Thunderstorms and Hail":
            background.current = "thunderstorms";
            break;
        case "Snow":
        case "Snow Grains":
        case "Snow Showers":
            background.current = "snow";
            break;
        default:
            background.current = `clear-${weather.isDay() ? "day" : "night"}`;
    }

    document.body.classList.add(background.current);

    return (
        <>
            <Widget id="now" size={"widget-large"} className={background.current}>
                <button className="settings-btn" type="button" onClick={() => showSettings()}>
                    <Gear />
                </button>

                <p onClick={() => showLocationModal()}>{now.location}</p>

                <h1>{now.temperature}</h1>

                <p>
                    {now.conditionInfo.intensity} {now.conditionInfo.type}
                </p>
                <p>
                    Feels like <span>{now.feelsLike}</span>°
                </p>
            </Widget>
            <SettingsModal isOpen={settingsOpen} onClose={hideSettings} />
            <Modal isOpen={locationModalIsOpen} onClose={hideLocationModal}>
                <ModalContent>
                    <LocationInput />
                </ModalContent>
            </Modal>
        </>
    );
}
