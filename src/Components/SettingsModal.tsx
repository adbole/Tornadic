import { Modal, ModalContent, ModalTitle } from "Contexts/ModalContext";
import { useSettings } from "Contexts/SettingsContext";

import { Button, InputGroup, ToggleButton } from "./Input";


const SettingsModal = () => {
    const { settings, setSetting, requiresSave, saveSettings }  = useSettings();

    return (
        <Modal>
            <ModalTitle>
                Settings
            </ModalTitle>
            <ModalContent>
                <h3>Temperature Unit</h3>
                <InputGroup isUniform>
                    <ToggleButton 
                        name="tempUnit" 
                        label="Fahrenheit" 
                        onClick={() => setSetting("tempUnit", "fahrenheit")}
                        defaultChecked={settings.tempUnit === "fahrenheit"}
                    />
                    <ToggleButton 
                        name="tempUnit" 
                        label="Celsius" 
                        onClick={() => setSetting("tempUnit", "celsius")}
                        defaultChecked={settings.tempUnit === "celsius"}
                    />
                </InputGroup>

                <h3>Precipitation Unit</h3>
                <InputGroup isUniform>
                    <ToggleButton 
                        name="precipUnit" 
                        label="Inches" 
                        onClick={() => setSetting("precipitation", "inch")}
                        defaultChecked={settings.precipitation === "inch"}
                    />
                    <ToggleButton 
                        name="precipUnit" 
                        label="Milimeters" 
                        onClick={() => setSetting("precipitation", "mm")}
                        defaultChecked={settings.precipitation === "mm"}
                    />
                </InputGroup>

                <h3>Windspeed Unit</h3>
                <InputGroup isUniform>
                    <ToggleButton 
                        name="windUnit" 
                        label="mph" 
                        onClick={() => setSetting("windspeed", "mph")}
                        defaultChecked={settings.windspeed === "mph"}
                    />
                    <ToggleButton 
                        name="windUnit" 
                        label="Km/h" 
                        onClick={() => setSetting("windspeed", "kmh")}
                        defaultChecked={settings.windspeed === "kmh"}
                    />
                    <ToggleButton 
                        name="windUnit" 
                        label="Knots" 
                        onClick={() => setSetting("windspeed", "kn")}
                        defaultChecked={settings.windspeed === "kn"}
                    />
                </InputGroup>

                <Button disabled={!requiresSave} onClick={saveSettings}>Save</Button>
            </ModalContent>
        </Modal>
    );
};

export default SettingsModal;