import React from "react";

import { useLocalStorage } from "Hooks";

import { throwError } from "ts/Helpers";

import { UserSettings } from "./index.types";


const Context = React.createContext<{
    settings: UserSettings;
    setSettings: (value: UserSettings) => void;
}>({} as any);

export const useSettings = () =>
    React.useContext(Context) ?? throwError("Please use useSettings in a SettingsContext provider");

export default function UserSettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useLocalStorage("userSettings", {
        tempUnit: "fahrenheit",
        windspeed: "mph",
        precipitation: "inch",
        user_location: undefined,
    });

    return <Context.Provider value={{ settings, setSettings }}>{children}</Context.Provider>;
}
