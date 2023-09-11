import React from "react";
import { Global } from "@emotion/react";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import { Button, LocationInput } from "Components/Input";
import Modal, { ModalContent } from "Components/Modals/Modal";
import Settings from "Components/Modals/Settings";
import { Gear } from "svgs/widget";

import { varNames } from "ts/StyleMixins";

import NowWidget, { Temperature } from "./style";

/**
 * Displays the current location name, temperature, condition, and feels like temperature along with having a gradient to match the condition
 * @returns The Now widget
 */
export default function Now({ displayOnly }: { displayOnly?: boolean }) {
    const { weather, point } = useWeather();

    const [locationModalIsOpen, showLocationModal, hideLocationModal] = useBooleanState(false);
    const [settingsOpen, showSettings, hideSettings] = useBooleanState(false);

    const now = weather.getNow();
    const background = now.conditionInfo.background;

    const gradient = `linear-gradient(to bottom, ${background[0]}, ${background[1]})`;

    return (
        <>
            {!displayOnly && <Global styles={{ body: { background: gradient } }} />}
            <NowWidget size="widget-large" isTemplate style={{ background: gradient }}>
                {!displayOnly && (
                    <Button
                        varient="transparent"
                        onClick={() => showSettings()}
                        style={{
                            position: "absolute",
                            left: "10px",
                            top: "10px",
                            margin: 0,
                            [varNames.svgSize]: "1.5rem",
                        }}
                        title="Open Settings"
                    >
                        <Gear />
                    </Button>
                )}

                <p onClick={() => (displayOnly ? undefined : showLocationModal())}>
                    {point.properties.relativeLocation.properties.city}
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
