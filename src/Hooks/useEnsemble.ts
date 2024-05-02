import React from "react";
import type { KeyedMutator } from "swr";
import useSWR from "swr";

import DataConverter from "ts/DataConverter";
import { fetchData } from "ts/Fetch";
import { getTimeToNextHour } from "ts/Helpers";

import useReadLocalStorage from "./useReadLocalStorage";


type EnsembleVariables = keyof Omit<Forecast["hourly"], "time">;

//Ensemble data is unique because the requested variable will have n members (observed to usually be 30 + 1 for the deterministic forecast),
//It would be inefficient (and very long) to have a property for each member, when all this data is converted by useEnsemble
type EnsembleApiResponse = {
    hourly: {
        time: string[];
    };
} & {
    hourly: {
        [key: string]: number[];
    };
};

type Ensemble = {
    time: string[];
    data: number[][];
};

/**
 * Gets ensemble data for a variable at a given location
 * and prepares it for application use
 */
export default function useEnsemble<K extends EnsembleVariables>(
    variable: K | undefined,
    latitude?: number,
    longitude?: number
): {
    ensemble: Ensemble | undefined;
    isLoading: boolean;
    isValidating: boolean;
    error: string | undefined;
    mutate: KeyedMutator<Ensemble>;
} {
    const settings = useReadLocalStorage("userSettings");
    const url = React.useMemo(() => {
        if (latitude === undefined || longitude === undefined || !settings || !variable)
            return undefined;

        const ensembleURL = new URL(
            "https://ensemble-api.open-meteo.com/v1/ensemble?models=gfs_seamless&timezone=auto"
        );

        ensembleURL.searchParams.set("latitude", latitude.toString());
        ensembleURL.searchParams.set("longitude", longitude.toString());
        ensembleURL.searchParams.set("hourly", variable as string);
        ensembleURL.searchParams.set("temperature_unit", settings.tempUnit);
        ensembleURL.searchParams.set("windspeed_unit", settings.windspeed);
        ensembleURL.searchParams.set("precipitation_unit", settings.precipitation);

        return ensembleURL;
    }, [variable, latitude, longitude, settings]);

    const {
        data: ensemble,
        isLoading,
        isValidating,
        error,
        mutate,
    } = useSWR(
        url?.toString(),
        async url => {
            const converter = new DataConverter(settings!);

            const ensemble = await fetchData<EnsembleApiResponse>(
                url,
                "Could not get ensemble data"
            );

            const memberKeys = Object.keys(ensemble.hourly).filter(key => key !== "time");
            const members = memberKeys.map(key =>
                converter.convert(variable!, ensemble.hourly[key])
            );

            return {
                time: ensemble.hourly.time,
                data: members,
            };
        },
        {
            //Only allow one request per 30 minutes per key
            dedupingInterval: 1000 * 60 * 30,
            refreshInterval: getTimeToNextHour,
            //Don't retry on error, instead the user can manually retry at their discretion
            shouldRetryOnError: false,
            onError: () => undefined, //Disable so FetchErrorHandler doesn't catch
        }
    );

    return {
        ensemble,
        isLoading,
        isValidating,
        error,
        mutate,
    };
}
