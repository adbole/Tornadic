import styled from "@emotion/styled";

import { useBooleanState, useLocalStorage } from "Hooks";
import { RADAR_PANE } from "Hooks/useRainViewer";

import { Button, ToggleSwitch } from "Components/Input";
import { Gear } from "svgs/widget";

import { vars } from "ts/StyleMixins";

import Opacity from "./Opacity";


const themes: RadarSettings["mapTheme"][] = [
    "system",
    "light",
    "light-grey",
    "dark",
    "dark-grey",
] as const;

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
] as const;

const Select = styled.select({
    backgroundColor: vars.backgroundLayer,
    color: "inherit",
    borderRadius: vars.inputBorderRadius,
    border: "none",
    padding: "5px",
    width: "100%",
});

const SettingsPopup = styled.div({
    position: "absolute",
    right: "40px",
    padding: "10px",
    margin: "10px",

    zIndex: vars.zLayer2,
    width: "200px",
});

const SettingsTitle = styled.div({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "10px",
});

const toUpperCase = (str: string) =>
    str
        .split("-")
        .map(s => s[0].toUpperCase() + s.slice(1))
        .join(" ");

export default function Settings() {
    const [show, setShowTrue, setShowFalse] = useBooleanState(false);

    const [settings, setSettings] = useLocalStorage("radarSettings");

    return (
        <>
            <Button
                varient="transparent"
                className="leaflet-custom-control leaflet-control"
                onClick={() => (show ? setShowFalse() : setShowTrue())}
            >
                <Gear />
            </Button>
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
                    <h2>Map Theme</h2>
                    <Select
                        style={{ fontSize: "1.05rem" }}
                        onChange={e =>
                            setSettings({
                                ...settings,
                                mapTheme: e.target.value as RadarSettings["mapTheme"],
                            })
                        }
                        value={settings.mapTheme}
                    >
                        {themes.map(theme => (
                            <option key={theme} value={theme}>
                                {toUpperCase(theme)}
                            </option>
                        ))}
                    </Select>
                </label>

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
                    label="Alert Mode"
                    title="Display all active National Weather Service Alerts within the radar. Alert widget will only display alerts relevant to your location"
                    onChange={e => setSettings({ ...settings, alertMode: e.currentTarget.checked })}
                    defaultChecked={settings.alertMode}
                />
                <ToggleSwitch
                    label="Smooth Radar"
                    title="Smooths the radar imagry removing pixelation."
                    onChange={e => {
                        setSettings({ ...settings, smoothing: e.currentTarget.checked });
                    }}
                    defaultChecked={settings.smoothing}
                />
                <ToggleSwitch
                    label="Show Snow"
                    title="Displays snow on the radar in a different color."
                    onChange={e => {
                        setSettings({ ...settings, snow: e.currentTarget.checked });
                    }}
                    defaultChecked={settings.snow}
                />

                <Opacity defaultOpacity={0.75} targetPane={RADAR_PANE} />
            </SettingsPopup>
        </>
    );
}
