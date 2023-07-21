import React from "react";

import { useBooleanState, useLocalStorage } from "Hooks";

import { throwError } from "ts/Helpers";


export type UserSettings = {
    tempUnit: "fahrenheit" | "celsius"
    windspeed: "kmh" | "mph" | "kn"
    precipitation: "mm" | "inch"
    user_location: [number, number] | undefined
}

const Context = React.createContext<{
    settings: UserSettings,
    queueSetting: <K extends keyof UserSettings>(setting: K, value: UserSettings[K]) => void
    requiresSave: boolean,
    saveSettings: () => void,
    quickSaveSetting: <K extends keyof UserSettings>(setting: K, value: UserSettings[K]) => void
}>({} as any);

export const useSettings = () => React.useContext(Context) ?? throwError("Please use useSettings in a SettingsContext provider");

const UserSettingsProvider = ({ children } : { children: React.ReactNode }) => {
    const [settings, setSettings] = useLocalStorage("userSettings", {
        tempUnit: "fahrenheit",
        windspeed: "mph",
        precipitation: "inch",
        user_location: undefined
    });

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

    const quickSaveSetting = <K extends keyof UserSettings>(setting: K, value: UserSettings[K]) => {
        setSettings(old => ({
            ...old,
            [setting]: value
        }));
    };

    return (
        <Context.Provider value={{ settings, queueSetting, requiresSave, saveSettings, quickSaveSetting }}>
            {children}
        </Context.Provider>
    );
};

export default UserSettingsProvider;