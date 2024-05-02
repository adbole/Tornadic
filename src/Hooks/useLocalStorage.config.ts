declare global {
    interface StorageKeysAndTypes {
        userSettings: UserSettings;
        radarSettings: RadarSettings;
        userLocation: UserLocation;
    }

    type UserSettings = Readonly<{
        tempUnit: "fahrenheit" | "celsius";
        windspeed: "kmh" | "mph" | "kn";
        precipitation: "mm" | "inch";
        preferGradient: boolean;
        highContrastForLive: boolean;
    }>;

    type RadarSettings = Readonly<{
        mapTheme: "system" | "light" | "dark" | "light-grey" | "dark-grey";
        colorScheme: number;
        smoothing: boolean;
        snow: boolean;
        alertMode: boolean;
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
        preferGradient: false,
        highContrastForLive: false,
    },
    radarSettings: {
        mapTheme: "system",
        colorScheme: 6,
        smoothing: true,
        snow: false,
        alertMode: false,
    },
    userLocation: { useCurrent: false },
};

export default DEFAULTS;
