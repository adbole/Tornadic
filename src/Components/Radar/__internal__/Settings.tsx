import styled from "@emotion/styled";

import { useBooleanState, useLocalStorage } from "Hooks";
import { RADAR_PANE } from "Hooks/useRainViewer";

import { Button, ToggleSwitch } from "Components/Input";
import { Gear } from "svgs/widget";

import { vars } from "ts/StyleMixins";

import Opacity from "./Opacity";


const colors = [
    "Black and White",
    "Original",
    "Universal Blue",
    "TITAN",
    "The Weather Channel",
    "Meteored",
    "NEXRAD Level III",
    "Rainbow @ SELEX-SI",
    "Dark Sky",
];

const Select = styled.select({
    backgroundColor: vars.backgroundLayer,
    color: "inherit",
    borderRadius: vars.inputBorderRadius,
    border: "none",
    padding: "5px",
});

const SettingsPopup = styled.div({
    position: "absolute",
    right: "40px",
    backgroundColor: vars.background,
    borderRadius: vars.borderRadius,
    padding: "10px",
    margin: "10px",

    zIndex: vars.zLayer2,
});

const SettingsTitle = styled.div({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "10px",
});

export default function Settings() {
    const [show, setShowTrue, setShowFalse] = useBooleanState(false);

    const [settings, setSettings] = useLocalStorage("radarSettings");

    return (
        <>
            <div
                className="leaflet-custom-control leaflet-control"
                onClick={() => (show ? setShowFalse() : setShowTrue())}
                style={{ cursor: "pointer" }}
            >
                <Gear />
            </div>
            <SettingsPopup
                className="leaflet-control"
                style={{ display: show ? "initial" : "none" }}
            >
                <SettingsTitle>
                    <h1 style={{ fontWeight: 500 }}>Radar Settings</h1>
                    <Button varient="transparent" style={{ margin: 0 }} onClick={setShowFalse}>
                        &#10005;
                    </Button>
                </SettingsTitle>

                <label>
                    <h2>Color Scheme</h2>
                    <Select
                        style={{ fontSize: "1.05rem" }}
                        onChange={e =>
                            setSettings({ ...settings, colorScheme: parseInt(e.target.value) })
                        }
                        value={settings.colorScheme}
                    >
                        {colors.map((color, i) => (
                            <option key={color} value={i}>
                                {color}
                            </option>
                        ))}
                    </Select>
                </label>

                <ToggleSwitch
                    label="Smooth Radar"
                    onChange={() => {
                        setSettings({ ...settings, smoothing: !settings.smoothing });
                    }}
                    defaultChecked={settings.smoothing}
                />
                <ToggleSwitch
                    label="Show Snow"
                    onChange={() => {
                        setSettings({ ...settings, snow: !settings.snow });
                    }}
                    defaultChecked={settings.snow}
                />

                <Opacity defaultOpacity={0.75} targetPane={RADAR_PANE} />
            </SettingsPopup>
        </>
    );
}
