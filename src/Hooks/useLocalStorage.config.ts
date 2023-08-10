declare global {
    interface StorageKeysAndTypes {
        userSettings: UserSettings;
        userLocation: UserLocation;
    }

    type UserSettings = {
        tempUnit: "fahrenheit" | "celsius";
        windspeed: "kmh" | "mph" | "kn";
        precipitation: "mm" | "inch";
    };

    type UserLocation = {
        coords?: {
            latitude: number;
            longitude: number;
        };
        useCurrent: boolean;
    };
}

type LocalStorageDefaults = {
    [K in keyof StorageKeysAndTypes]: StorageKeysAndTypes[K];
};

const DEFAULTS: LocalStorageDefaults = {
    userSettings: {
        tempUnit: "fahrenheit",
        windspeed: "mph",
        precipitation: "inch",
    },
    userLocation: { useCurrent: false },
};

export default DEFAULTS;
