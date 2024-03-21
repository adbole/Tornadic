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
export default function Now({ displayOnly = false }) {
    const { weather, point } = useWeather();

    const [locationModalIsOpen, showLocationModal, hideLocationModal] = useBooleanState(false);
    const [settingsOpen, showSettings, hideSettings] = useBooleanState(false);

    const condition = weather.getWeatherCondition()

    return (
        <>
            <NowWidget size="widget-large" isTemplate>
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

                <p
                    onClick={() => (displayOnly ? undefined : showLocationModal())}
                    style={!displayOnly ? { cursor: "pointer" } : undefined}
                >
                    {point.properties.relativeLocation.properties.city}
                </p>

                <Temperature>{Math.round(weather.getForecast("temperature_2m"))}</Temperature>

                <p>
                    {condition.intensity} {condition.type}
                </p>
                <p>
                    Feels like <span>{Math.round(weather.getForecast("apparent_temperature"))}</span>°
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
