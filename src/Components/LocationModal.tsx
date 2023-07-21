import { useSettings } from "Contexts/SettingsContext";

import { Cursor } from "svgs/radar";

import { fetchData } from "ts/Fetch";

import SearchModal from "./Input/SearchModal";
import { Button } from "./Input";


type QueryResult = {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    country: string,
    country_code: string,
    admin1: string,
}

function getQueryResults(query: string) {
    return fetchData<{ results: QueryResult[] }>(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`, "")
        .then(
            data => (data.results ?? [])
                .filter(result => result.country_code === "US")
                .map(result => ({ key: result.id, label: `${result.name}, ${result.admin1} @ ${result.latitude}, ${result.longitude}`, payload: result }))
        );
}

const LocationModal = () => {
    const { quickSaveSetting } = useSettings();

    return (
        <SearchModal<QueryResult> onGetResults={(query) => getQueryResults(query)} onSelect={(payload) => quickSaveSetting("user_location", [payload.latitude, payload.longitude])}>
            <Button
                onClick={() => navigator.geolocation.getCurrentPosition((position) => quickSaveSetting("user_location", [position.coords.latitude, position.coords.longitude]))}
            >
                <Cursor />
            </Button>
        </SearchModal>
    );
};

export default LocationModal;