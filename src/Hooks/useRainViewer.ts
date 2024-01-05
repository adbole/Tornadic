import React from "react";
import useSWR from "swr";

import { fetchData } from "ts/Fetch";


export type Tile = Readonly<{
    time: number;
    path: string;
}>;

type ApiResponse = Readonly<{
    generated: number;
    host: string;
    radar: {
        nowcast: Tile[];
        past: Tile[];
    };
    satellite: {
        infrared: Tile[];
    };
}>;

export default function useRainViewer() {
    const expires = React.useRef(0);

    const { data, isLoading } = useSWR<ApiResponse>(
        "https://api.rainviewer.com/public/weather-maps.json",
        async (url) => {
            const response = await fetchData<ApiResponse>(url, "Cannot get RainViewer data");

            expires.current = response.radar.nowcast.slice(-1)[0].time * 1000;

            return response;
        },
        { refreshInterval: () => expires.current - Date.now() }
    )

    return {
        data, 
        isLoading
    }
}