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

    background.current = now.conditionInfo.background
    React.useEffect(() => () => document.body.classList.remove(background.current), [background]);

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
