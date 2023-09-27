import React from "react";

import DEFAULTS from "./useLocalStorage.config";


const LOCAL_STORAGE_EVENT = "localStorage";

declare global {
    interface StorageKeysAndTypes {}

    interface WindowEventMap {
        [LOCAL_STORAGE_EVENT]: CustomEvent;
    }
}

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;

export default function useLocalStorage<K extends keyof StorageKeysAndTypes>(
    key: K,
    defaultValueOverride?: StorageKeysAndTypes[K]
): [StorageKeysAndTypes[K], SetValue<StorageKeysAndTypes[K]>] {
    const defaultValue = defaultValueOverride || DEFAULTS[key];

    const read = React.useCallback((): StorageKeysAndTypes[K] => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            console.error(`Failed to get ${key} from localStroage`);
            return defaultValue;
        }
    }, [key, defaultValue]);

    const [storedValue, setStoredValue] = React.useState<StorageKeysAndTypes[K]>(read);

    const setValue: SetValue<StorageKeysAndTypes[K]> = React.useCallback(
        value => {
            try {
                const newValue = value instanceof Function ? value(storedValue) : value;

                localStorage.setItem(key, JSON.stringify(newValue));
                setStoredValue(newValue);

                window.dispatchEvent(new CustomEvent(LOCAL_STORAGE_EVENT, { detail: key }));
            } catch {
                console.error(`Failed to set ${key} in localstorage`);
            }
        },
        [key, storedValue]
    );

    const onStorage = React.useCallback(
        (event: StorageEvent | CustomEvent) => {
            if (event instanceof StorageEvent && event.key !== key) return;
            else if (event instanceof CustomEvent && event.detail !== key) return;

            setStoredValue(read());
        },
        [key, read]
    );

    React.useEffect(() => {
        window.addEventListener("storage", onStorage);
        window.addEventListener(LOCAL_STORAGE_EVENT, onStorage);

        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener(LOCAL_STORAGE_EVENT, onStorage);
        };
    }, [onStorage]);

    return [storedValue, setValue];
}
