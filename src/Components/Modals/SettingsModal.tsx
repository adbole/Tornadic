import React from "react";

import { useBooleanState } from "Hooks";

import { useSettings } from "Contexts/SettingsContext";
import { UserSettings } from "Contexts/SettingsContext/index.types";

import { TornadicFull } from "svgs/icon";

import { Button, InputGroup, ToggleButton } from "../Input";

import Modal, { ModalContent, ModalProps, ModalTitle } from "./Modal";


const SettingsModal = ({ ...modalProps }: ModalProps) => {
    const { settings, setSettings } = useSettings();

    const [requiresSave, setRequiresSaveTrue, setRequiresSaveFalse] = useBooleanState(false);
    const [queue, setQueue] = React.useState<UserSettings>({} as any);

    React.useEffect(() => {
        if(Object.keys(queue).length > 0) setRequiresSaveTrue();
        else setRequiresSaveFalse();
    }, [queue, setRequiresSaveFalse, setRequiresSaveTrue]);

    const queueSetting = React.useCallback(<K extends keyof UserSettings, >(setting: K, value: UserSettings[K]) => {
        if(settings[setting] !== value) {
            setQueue(oldValue => ({
                ...oldValue,
                [setting]: value
            }));
        }
        else {
            setQueue(oldValue => {
                const { [setting]: _, ...rest } = oldValue;

                return rest as UserSettings;
            });
        }
    }, [settings]);

    const saveSettings = () => {
        if(requiresSave) {
            setSettings({
                ...settings,
                ...queue
            });
        }
    };

    return (
        <Modal {...modalProps}>
            <ModalTitle>
                Settings
            </ModalTitle>
            <ModalContent>
                <h3>Temperature Unit</h3>
                <InputGroup isUniform>
                    <ToggleButton
                        name="tempUnit"
                        label="Fahrenheit"
                        onClick={() => queueSetting("tempUnit", "fahrenheit")}
                        defaultChecked={settings.tempUnit === "fahrenheit"}
                    />
                    <ToggleButton
                        name="tempUnit"
                        label="Celsius"
                        onClick={() => queueSetting("tempUnit", "celsius")}
                        defaultChecked={settings.tempUnit === "celsius"}
                    />
                </InputGroup>

                <h3>Precipitation Unit</h3>
                <InputGroup isUniform>
                    <ToggleButton
                        name="precipUnit"
                        label="Inches"
                        onClick={() => queueSetting("precipitation", "inch")}
                        defaultChecked={settings.precipitation === "inch"}
                    />
                    <ToggleButton
                        name="precipUnit"
                        label="Milimeters"
                        onClick={() => queueSetting("precipitation", "mm")}
                        defaultChecked={settings.precipitation === "mm"}
                    />
                </InputGroup>

                <h3>Windspeed Unit</h3>
                <InputGroup isUniform>
                    <ToggleButton
                        name="windUnit"
                        label="mph"
                        onClick={() => queueSetting("windspeed", "mph")}
                        defaultChecked={settings.windspeed === "mph"}
                    />
                    <ToggleButton
                        name="windUnit"
                        label="Km/h"
                        onClick={() => queueSetting("windspeed", "kmh")}
                        defaultChecked={settings.windspeed === "kmh"}
                    />
                    <ToggleButton
                        name="windUnit"
                        label="Knots"
                        onClick={() => queueSetting("windspeed", "kn")}
                        defaultChecked={settings.windspeed === "kn"}
                    />
                </InputGroup>

                <Button disabled={!requiresSave} onClick={saveSettings}>Save</Button>

                <div id="about">
                    <TornadicFull />
                </div>
            </ModalContent>
        </Modal>
    );
};

export default SettingsModal;