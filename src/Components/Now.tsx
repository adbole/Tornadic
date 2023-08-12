import React from "react";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Modal, { ModalContent } from "Components/Modals/Modal";
import Settings from "Components/Modals/Settings";
import Widget from "Components/Widget";
import { Gear } from "svgs/widget";

import { LocationInput } from "./Input";

/**
 * Displays the current location name, temperature, condition, and feels like temperature along with having a gradient to match the condition
 * @returns The Now widget
 */
export default function Now({ displayOnly }: { displayOnly?: boolean }) {
    const { weather } = useWeather();

    const [locationModalIsOpen, showLocationModal, hideLocationModal] = useBooleanState(false);
    const [settingsOpen, showSettings, hideSettings] = useBooleanState(false);

    const now = weather.getNow();
    const background = React.useRef("clear-day");

    document.body.classList.remove(background.current);

    background.current = now.conditionInfo.background;
    React.useEffect(() => {
        if(displayOnly)
            return () => undefined

        return () => document.body.classList.remove(background.current)
    }, [background, displayOnly]);

    if(!displayOnly)
        document.body.classList.add(background.current);

    return (
        <>
            <Widget size={"widget-large"} className={`now ${background.current}`}>
                {!displayOnly && (
                    <button className="settings-btn" type="button" onClick={() => showSettings()}>
                        <Gear />
                    </button>
                )}

                <p onClick={() => (displayOnly ? undefined : showLocationModal())}>{now.location}</p>

                <h1>{now.temperature}</h1>

                <p>
                    {now.conditionInfo.intensity} {now.conditionInfo.type}
                </p>
                <p>
                    Feels like <span>{now.feelsLike}</span>°
                </p>
            </Widget>
            <Settings isOpen={settingsOpen} onClose={hideSettings} />
            <Modal isOpen={locationModalIsOpen} onClose={hideLocationModal}>
                <ModalContent>
                    <LocationInput />
                </ModalContent>
            </Modal>
        </>
    );
}
