import React from "react";
import { Global } from "@emotion/react";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import { LocationInput } from "Components/Input";
import Modal, { ModalContent } from "Components/Modals/Modal";
import Settings from "Components/Modals/Settings";
import { Gear } from "svgs/widget";

import NowWidget, { SettingsButton, Temperature } from "./style"


/**
 * Displays the current location name, temperature, condition, and feels like temperature along with having a gradient to match the condition
 * @returns The Now widget
 */
export default function Now({ displayOnly, className }: { displayOnly?: boolean } & ClassNameProp) {
    const { weather } = useWeather();

    const [locationModalIsOpen, showLocationModal, hideLocationModal] = useBooleanState(false);
    const [settingsOpen, showSettings, hideSettings] = useBooleanState(false);

    const now = weather.getNow();
    const background = now.conditionInfo.background;

    return (
        <>
            {!displayOnly && (
                <Global
                    styles={{ body: { background: `linear-gradient(to bottom, ${background[0]}, ${background[1]})`, }, }}
                />
            )}
            <NowWidget
                className={className}
                size={"widget-large"}
                isTemplate
                background={now.conditionInfo.background}
            >
                {!displayOnly && (
                    <SettingsButton varient="transparent" onClick={() => showSettings()}>
                        <Gear />
                    </SettingsButton>
                )}

                <p onClick={() => (displayOnly ? undefined : showLocationModal())}>
                    {now.location}
                </p>

                <Temperature>{now.temperature}</Temperature>

                <p>
                    {now.conditionInfo.intensity} {now.conditionInfo.type}
                </p>
                <p>
                    Feels like <span>{now.feelsLike}</span>°
                </p>
            </NowWidget>
            <Settings isOpen={settingsOpen} onClose={hideSettings} />
            <Modal isOpen={locationModalIsOpen} onClose={hideLocationModal}>
                <ModalContent>
                    <LocationInput />
                </ModalContent>
            </Modal>
        </>
    );
}
