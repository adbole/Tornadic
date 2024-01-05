import React from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
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

enum LayerTypes {
    Satellite = "Satellite",
    Radar = "Radar",
}

type AvailableLayer = {
    frames: Tile[]; //Frames available to show
    tileLayers: (L.TileLayer | undefined)[]; //Layers representing a frame
    layerGroup: L.LayerGroup; //Layer group that houses the layers
    currentLayerIndex: number; //Where in the animation we currently are
};

export const RADAR_PANE = "radar";

const mod =(x: number, div: number) => 
    x - div * Math.floor(x / div);

const generateNewLayer = (frames: Tile[]): AvailableLayer => ({
    frames,
    tileLayers: [],
    layerGroup: L.layerGroup([], { pane: RADAR_PANE }),
    currentLayerIndex: 0,
})

export default function useRainViewer() {
    const expires = React.useRef(0);
    
    const map = useMap()
    const [active, setActive] = React.useState<LayerTypes>(LayerTypes.Radar)

    const { data, isLoading } = useSWR<ApiResponse>(
        "https://api.rainviewer.com/public/weather-maps.json",
        async (url) => {
            const response = await fetchData<ApiResponse>(url, "Cannot get RainViewer data");

            expires.current = response.radar.nowcast.slice(-1)[0].time * 1000;

            return response;
        },
        { 
            refreshInterval: () => expires.current - Date.now(),
            revalidateOnFocus: false
        }
    )

    const availableLayers: Record<LayerTypes, AvailableLayer> | null = React.useMemo(() => {
        if(!data) return null;

        const availableLayers: Record<LayerTypes, AvailableLayer> = {
            Radar: generateNewLayer(data.radar.past.concat(data.radar.nowcast)),
            Satellite: generateNewLayer(data.satellite.infrared)
        }

        availableLayers.Radar.currentLayerIndex = data.radar.past.length - 1;

        return availableLayers;
    }, [data])

    //Layers control logic and cleanup on availableLayers change
    React.useEffect(() => {
        if(!availableLayers) return () => {};

        if(!map.getPane("radar")) {
            const pane = map.createPane("radar");
            pane.style.zIndex = "250"
            pane.style.pointerEvents = "none";
        }

        const radarLayerGroup = availableLayers.Radar.layerGroup;
        const satelliteLayerGroup = availableLayers.Satellite.layerGroup;

        const layersControl = L.control.layers({
            "Radar": radarLayerGroup,
            "Satellite": satelliteLayerGroup
        }).addTo(map);

        availableLayers[active].layerGroup.addTo(map);

        const updateLayer = (e: L.LayersControlEvent) => setActive(e.name as LayerTypes);

        map.on("baselayerchange", updateLayer);

        return () => {
            layersControl.remove();
            radarLayerGroup.remove();
            satelliteLayerGroup.remove();
            
            map.off("baselayerchange", updateLayer)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableLayers, map])

    const addLayer = React.useCallback(
        (index: number) => {
            if(!availableLayers) return;
            const activeData = availableLayers[active];

            const loadedLayers = activeData.tileLayers;
            const frame = activeData.frames[index];

            //If frame hasn't been added as a layer yet do so now
            if (!loadedLayers[index]) {
                const color = active === LayerTypes.Radar ? 6 : 0;
                loadedLayers[index] = L.tileLayer(
                    data!.host + frame.path + "/512/{z}/{x}/{y}/" + color + "/1_0.png",
                    {
                        opacity: 0.0,
                        zIndex: frame.time,
                        pane: RADAR_PANE,
                    }
                );
            }

            //If the layer of the frame hasn't been added yet do so now
            if (!map.hasLayer(loadedLayers[index]!)) {
                activeData.layerGroup.addLayer(loadedLayers[index]!);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [map, active, availableLayers]
    );

    const changeRadarPos = React.useCallback(
        (position: number, preloadOnly: boolean) => {
            if (!data || !availableLayers) return;
            const activeData = availableLayers[active];

            const activeFrames = activeData.frames;
            const activeLayers = activeData.tileLayers;

            //In the event of overflow or underflow of the position(index) relative to the length of activeFrames,
            //perform a modulo operation to correct the error.
            if (position < 0 || position > activeFrames.length - 1) {
                position = mod(position, activeFrames.length);
            }

            addLayer(position);

            if (preloadOnly) return;

            if (activeLayers[activeData.currentLayerIndex]) {
                activeLayers[activeData.currentLayerIndex]!.setOpacity(0);
            }

            activeLayers[position]!.setOpacity(1);
            activeData.currentLayerIndex = position;
        },
        [data, addLayer, active, availableLayers]
    );

    const showFrame = React.useCallback(
        (loadPos: number) => {
            if (!data || !availableLayers) return;
            const activeData = availableLayers[active];

            //Determine how to load the frame after one
            const preLoadDirection = loadPos - activeData.currentLayerIndex >= 0 ? 1 : -1;

            changeRadarPos(loadPos, false); //Load frame
            changeRadarPos(loadPos + preLoadDirection, true); //Preload the next frame
        },
        [data, active, changeRadarPos, availableLayers]
    );

    return {
        availableLayers,
        active,
        showFrame, 
        isLoading
    }
}