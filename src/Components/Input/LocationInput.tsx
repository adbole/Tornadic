import { useSettings } from "Contexts/SettingsContext";

import { Cursor } from "svgs/radar";

import { fetchData } from "ts/Fetch";

import SearchInput from "./SearchInput";
import { Button } from ".";


type QueryResult = {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    country: string,
    country_code: string,
    admin1: string,
}

async function getQueryResults(query: string) {
    const data = await fetchData<{ results: QueryResult[]; }>(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`, "");
    return (data.results ?? [])
        .filter(result => result.country_code === "US")
        .map(result_1 => ({ 
            key: result_1.id, 
            label: `${result_1.name}, ${result_1.admin1} @ ${result_1.latitude}, ${result_1.longitude}`, 
            payload: result_1 
        }));
}

const LocationInput = () => {
    const { settings, setSettings } = useSettings();

    const setUserLocation = (user_location: [number, number]) => setSettings({
        ...settings,
        user_location
    });

    return (
        <SearchInput<QueryResult> 
            onGetResults={(query) => getQueryResults(query)} 
            onSelect={(payload) => setUserLocation([payload.latitude, payload.longitude])}
        >
            <Button
                onClick={() => navigator.geolocation.getCurrentPosition((position) => setUserLocation([position.coords.latitude, position.coords.longitude]))}
            >
                <Cursor />
            </Button>
        </SearchInput>
    );
};

export default LocationInput;