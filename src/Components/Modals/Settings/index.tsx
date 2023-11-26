import React from "react";

import { useBooleanState, useLocalStorage } from "Hooks";

import { Button, InputGroup, ToggleButton, ToggleSwitch } from "Components/Input";
import type { ModalProps } from "Components/Modals/Modal";
import Modal, { ModalContent, ModalTitle } from "Components/Modals/Modal";


export default function Settings({ ...modalProps }: ModalProps) {
    const [settings, setSettings] = useLocalStorage("userSettings");

    const [isSaved, setIsSavedTrue, setIsSavedFalse] = useBooleanState(false);
    const [queue, setQueue] = React.useState<UserSettings>({} as any);

    const tempUnit = React.useId();
    const precipUnit = React.useId();
    const windUnit = React.useId();

    React.useEffect(() => {
        if (Object.keys(queue).length > 0) setIsSavedFalse();
        else setIsSavedTrue();
    }, [queue, setIsSavedFalse, setIsSavedTrue]);

    const queueSetting = React.useCallback(
        <K extends keyof UserSettings>(setting: K, value: UserSettings[K]) => {
            if (settings[setting] !== value) {
                setQueue(oldValue => ({ ...oldValue, [setting]: value }));
            } else {
                setQueue(({ [setting]: _, ...rest }) => rest as UserSettings);
            }
        },
        [settings]
    );

    return (
        <Modal {...modalProps}>
            <ModalTitle>Settings</ModalTitle>
            <ModalContent>
                <h3>Temperature Unit</h3>
                <InputGroup isUniform>
                    <ToggleButton
                        name={tempUnit}
                        label="Fahrenheit"
                        onClick={() => queueSetting("tempUnit", "fahrenheit")}
                        defaultChecked={settings.tempUnit === "fahrenheit"}
                    />
                    <ToggleButton
                        name={tempUnit}
                        label="Celsius"
                        onClick={() => queueSetting("tempUnit", "celsius")}
                        defaultChecked={settings.tempUnit === "celsius"}
                    />
                </InputGroup>

                <h3>Precipitation Unit</h3>
                <InputGroup isUniform>
                    <ToggleButton
                        name={precipUnit}
                        label="Inches"
                        onClick={() => queueSetting("precipitation", "inch")}
                        defaultChecked={settings.precipitation === "inch"}
                    />
                    <ToggleButton
                        name={precipUnit}
                        label="Milimeters"
                        onClick={() => queueSetting("precipitation", "mm")}
                        defaultChecked={settings.precipitation === "mm"}
                    />
                </InputGroup>

                <h3>Windspeed Unit</h3>
                <InputGroup isUniform>
                    <ToggleButton
                        name={windUnit}
                        label="mph"
                        onClick={() => queueSetting("windspeed", "mph")}
                        defaultChecked={settings.windspeed === "mph"}
                    />
                    <ToggleButton
                        name={windUnit}
                        label="Km/h"
                        onClick={() => queueSetting("windspeed", "kmh")}
                        defaultChecked={settings.windspeed === "kmh"}
                    />
                    <ToggleButton
                        name={windUnit}
                        label="Knots"
                        onClick={() => queueSetting("windspeed", "kn")}
                        defaultChecked={settings.windspeed === "kn"}
                    />
                </InputGroup>

                <ToggleSwitch
                    label="Radar Alert Mode"
                    title="Display all active National Weather Service Alerts within the radar. Alert widget will only display alerts relevant to your location"
                    defaultChecked={settings.radarAlertMode}
                    onChange={e => queueSetting("radarAlertMode", e.target.checked)}
                />

                <Button
                    disabled={isSaved}
                    onClick={() => {
                        if (!isSaved) {
                            setSettings({
                                ...settings,
                                ...queue,
                            });

                            setQueue({} as any)
                        }
                    }}
                >
                    Save
                </Button>
            </ModalContent>
        </Modal>
    );
}
