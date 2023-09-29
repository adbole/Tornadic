import { useLocalStorage, usePermission } from "Hooks";

import { Cursor } from "svgs/radar";

import { fetchData } from "ts/Fetch";

import Button from "./Button";
import SearchInput from "./SearchInput";


type QueryResult = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    country_code: string;
    admin1: string;
};

async function getQueryResults(query: string) {
    const data = await fetchData<{ results: QueryResult[] }>(
        `https://geocoding-api.open-meteo.com/v1/search?name=${query}`,
        ""
    );
    return (data.results ?? [])
        .filter(result => result.country_code === "US")
        .map(result => ({
            key: result.id,
            label: `${result.name}, ${result.admin1} @ ${result.latitude}, ${result.longitude}`,
            payload: {
                latitude: result.latitude,
                longitude: result.longitude,
            },
        }));
}

export default function LocationInput() {
    const [, setUserLocation] = useLocalStorage("userLocation");
    const locationPermission = usePermission("geolocation");

    return (
        <SearchInput
            onGetResults={query => getQueryResults(query)}
            onSelect={({ latitude, longitude }) =>
                setUserLocation({
                    coords: {
                        latitude,
                        longitude,
                    },
                    useCurrent: false,
                })
            }
        >
            {locationPermission !== "denied" && navigator.geolocation && (
                <Button
                    onClick={() => setUserLocation({ useCurrent: true })}
                    title="Use Current Location"
                >
                    <Cursor />
                </Button>
            )}
        </SearchInput>
    );
}
