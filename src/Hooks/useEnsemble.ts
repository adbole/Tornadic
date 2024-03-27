import React from "react";
import useSWRImmutable from "swr/immutable";

import { fetchData } from "ts/Fetch";
import type { CombinedHourly } from "ts/Weather";

import useReadLocalStorage from "./useReadLocalStorage";


export default function useEnsemble(
    variable: keyof CombinedHourly,
    latitude?: number,
    longitude?: number
): {
    ensemble: Ensemble | undefined;
    isLoading: boolean;
    isValidating: boolean;
} {
    const settings = useReadLocalStorage("userSettings");
    const url = React.useMemo(() => {
        if (latitude !== undefined && longitude !== undefined && settings)
            return getUrl(variable, latitude, longitude, settings);
    }, [variable, latitude, longitude, settings]);

    const { data: ensemble, isLoading, isValidating } = useSWRImmutable<Ensemble>(
        url,
        async url => {
            const ensemble = await fetchData<Ensemble>(url, "Could not get ensemble data");

            return ensemble;
        },
        { refreshInterval: () => 3.6e6 - (Date.now() % 3.6e6) }
    );

    return {
        ensemble,
        isLoading,
        isValidating
    };
}

function getUrl(
    variable: keyof CombinedHourly,
    latitude: number,
    longitude: number,
    userSettings: UserSettings
): URL {
    const ensembleURL = new URL(
        "https://ensemble-api.open-meteo.com/v1/ensemble?models=gfs_seamless&timezone=auto"
    );

    ensembleURL.searchParams.set("latitude", latitude.toString());
    ensembleURL.searchParams.set("longitude", longitude.toString());
    ensembleURL.searchParams.set("hourly", variable);
    ensembleURL.searchParams.set("temperature_unit", userSettings.tempUnit);
    ensembleURL.searchParams.set("windspeed_unit", userSettings.windspeed);
    ensembleURL.searchParams.set("precipitation_unit", userSettings.precipitation);

    return ensembleURL
}
