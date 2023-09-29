import React from "react";


type NullableKeysAndTypes = {
    [K in keyof StorageKeysAndTypes]: StorageKeysAndTypes[K] | null;
};

export default function useReadLocalStorage<K extends keyof StorageKeysAndTypes>(
    key: K
): NullableKeysAndTypes[K] {
    const read = React.useCallback((): NullableKeysAndTypes[K] => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch {
            console.error(`Failed to get ${key} from localStroage`);
            return null;
        }
    }, [key]);

    const [storedValue, setStoredValue] = React.useState<NullableKeysAndTypes[K]>(read);

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
        window.addEventListener("localStorage", onStorage);

        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("localStorage", onStorage);
        };
    }, [onStorage]);

    return storedValue;
}
