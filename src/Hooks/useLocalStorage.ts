import React from "react";

import { UserSettings } from "Contexts/SettingsContext/index.types";
// type KeysAndTypes = {"temperatureUnit" | "windspeedUnit" | "precipitationUnit" | "preferredLocation"


type KeysAndTypes = {
    userSettings: UserSettings
}

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>

export default function useLocalStorage<K extends keyof KeysAndTypes>(
    key: K, 
    defaultValue: KeysAndTypes[K]
): [KeysAndTypes[K], SetValue<KeysAndTypes[K]>] {
    const read = React.useCallback((): KeysAndTypes[K] => {
        try {
            const value = window.localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        }
        catch {
            console.error(`Failed to get ${key} from localStroage`);
            return defaultValue;
        }
    }, [key, defaultValue]);

    const [storedValue, setStoredValue] = React.useState<KeysAndTypes[K]>(read);

    const setValue: SetValue<KeysAndTypes[K]> = React.useCallback((value) => {
        try {
            const newValue = value instanceof Function ? value(storedValue) : value;

            window.localStorage.setItem(key, JSON.stringify(newValue));
            setStoredValue(newValue);
        }
        catch {
            console.error(`Failed to set ${key} in localstorage`);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
}