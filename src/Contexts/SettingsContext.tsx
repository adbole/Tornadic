import React from "react";

import { useBooleanState } from "Hooks";
import useLocalStorage from "Hooks/useLocalStorage";

import { throwError } from "ts/Helpers";


export type UserSettings = {
    tempUnit: "fahrenheit" | "celsius"
    windspeed: "kmh" | "mph" | "kn"
    precipitation: "mm" | "inch"
}

const Context = React.createContext<{
    settings: UserSettings,
    setSetting: <K extends keyof UserSettings>(setting: K, value: UserSettings[K]) => void
    requiresSave: boolean,
    saveSettings: () => void
}>({} as any);

export const useSettings = () => React.useContext(Context) ?? throwError("Please use useSettings in a SettingsContext provider");

const UserSettingsProvider = ({ children } : { children: React.ReactNode }) => {
    const [settings, setSettings] = useLocalStorage("userSettings", {
        tempUnit: "fahrenheit",
        windspeed: "mph",
        precipitation: "inch"
    });

    const [requiresSave, setRequiresSaveTrue, setRequiresSaveFalse] = useBooleanState(false);
    const [queue, setQueue] = React.useState<UserSettings>({} as any);

    React.useEffect(() => {
        if(Object.keys(queue).length > 0) setRequiresSaveTrue();
        else setRequiresSaveFalse();
    }, [queue, setRequiresSaveFalse, setRequiresSaveTrue]);

    const setSetting = React.useCallback(<K extends keyof UserSettings, >(setting: K, value: UserSettings[K]) => {
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
        <Context.Provider value={{ settings, setSetting, requiresSave, saveSettings }}>
            {children}
        </Context.Provider>
    );
};

export default UserSettingsProvider;