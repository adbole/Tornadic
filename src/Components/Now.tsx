import React from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Modal, { ModalContent } from "Components/Modals/Modal";
import Settings from "Components/Modals/Settings";
import Widget from "Components/Widget";
import { Gear } from "svgs/widget";

import { LocationInput } from "./Input";


const NowWidget = styled(Widget)<{
    background: [string, string];
}>(({ background }) => ({
    alignItems: "center",
    gap: "10px",
    fontSize: "1.5rem",
    background: `linear-gradient(to bottom, ${background[0]}, ${background[1]})`,
}));

const SettingsButton = styled.button({
    position: "absolute",
    left: "10px",
    top: "10px",
    margin: "0px",
    padding: "0px",
    border: "none",
    boxShadow: "none",
    svg: { width: "1.5rem" },
});

const Temperature = styled.h1({
    position: "relative",
    fontSize: "6rem",
    fontWeight: "200",

    "&::after": {
        position: "absolute",
        content: "'°'",
    },
});

/**
 * Displays the current location name, temperature, condition, and feels like temperature along with having a gradient to match the condition
 * @returns The Now widget
 */
export default function Now({ displayOnly }: { displayOnly?: boolean }) {
    const { weather } = useWeather();

    const [locationModalIsOpen, showLocationModal, hideLocationModal] = useBooleanState(false);
    const [settingsOpen, showSettings, hideSettings] = useBooleanState(false);

    const now = weather.getNow();
    const background = now.conditionInfo.background;

    return (
        <>
            {!displayOnly && (
                <Global
                    styles={{ "body": { background: `linear-gradient(to bottom, ${background[0]}, ${background[1]})`, } }}
                />
            )}
            <NowWidget size={"widget-large"} isTemplate background={now.conditionInfo.background}>
                {!displayOnly && (
                    <SettingsButton type="button" onClick={() => showSettings()}>
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
