declare global {
    interface StorageKeysAndTypes {
        userSettings: UserSettings;
        userLocation: UserLocation;
    }

    type UserSettings = Readonly<{
        tempUnit: "fahrenheit" | "celsius";
        windspeed: "kmh" | "mph" | "kn";
        precipitation: "mm" | "inch";
        radarAlertMode: boolean;
        preferGradient: boolean;
        highContrastForLive: boolean
    }>;

    type UserLocation = Readonly<{
        coords?: {
            readonly latitude: number;
            readonly longitude: number;
        };
        useCurrent: boolean;
    }>;
}

type LocalStorageDefaults = {
    readonly [K in keyof StorageKeysAndTypes]: StorageKeysAndTypes[K];
};

const DEFAULTS: LocalStorageDefaults = {
    userSettings: {
        tempUnit: "fahrenheit",
        windspeed: "mph",
        precipitation: "inch",
        radarAlertMode: false,
        preferGradient: false,
        highContrastForLive: false,
    },
    userLocation: { useCurrent: false },
};

export default DEFAULTS;
