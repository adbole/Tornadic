import React from "react"
import { useMap } from "react-leaflet";
import L from "leaflet";

import { useRainViewer } from "Hooks";
import type { Tile } from "Hooks/useRainViewer";

import { throwError } from "ts/Helpers"
import getTimeFormatted from "ts/TimeConversion";

import ControlPortal, { Position } from "./ControlPortal";
import PlayPauseButton from "./PlayPauseButton";
import { Datalist, Message, Option,Playback, Slider, Time, Timeline } from "./RadarContext.style";


enum LayerTypes {
    Satellite = "Satellite",
    Radar = "Radar",
}

type AvailableLayer = {
    frames: Tile[]; //Frames available to show
    loadedLayers: L.TileLayer[]; //Layers representing a frame
    layerGroup: L.LayerGroup; //Layer group that houses the layers
    layerAnimPos: number; //Where in the animation we currently are
};

export const RADAR_PANE = "radar";

const RadarContext = React.createContext(null)

export const useRadar = () => 
    React.useContext(RadarContext) ??
    throwError("Please use useRadar inside a RadarContext provider");

const mod =(x: number, div: number) => 
    x - div * Math.floor(x / div);

const generateNewLayer = (frames: Tile[]): AvailableLayer => ({
    frames,
    loadedLayers: [],
    layerGroup: L.layerGroup([], { pane: RADAR_PANE }),
    layerAnimPos: 0,
})

const getTimeDisplay = (time: number) => 
    `${Date.now() > time * 1000 ? "Past" : "Forecast"}: ${getTimeFormatted(
        time * 1000,
        "hourMinute"
    )}`;

export default function RadarContextProvider() {
    const { data, isLoading } = useRainViewer()

    const map = useMap()
    const [active, setActive] = React.useState<LayerTypes>(LayerTypes.Radar)

    const timeLine = React.useRef<HTMLInputElement>(null);
    const timeP = React.useRef<HTMLParagraphElement>(null);

    const radarList = React.useId();

    const availableLayers: Record<LayerTypes, AvailableLayer> | null = React.useMemo(() => {
        if(!data) return null;

        const availableLayers: Record<LayerTypes, AvailableLayer> = {
            Radar: generateNewLayer(data.radar.past.concat(data.radar.nowcast)),
            Satellite: generateNewLayer(data.satellite.infrared)
        }

        availableLayers.Radar.layerAnimPos = data.radar.past.length - 1;

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

            const loadedLayers = activeData.loadedLayers;
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
            if (!map.hasLayer(loadedLayers[index])) {
                activeData.layerGroup.addLayer(loadedLayers[index]);
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
            const activeLayers = activeData.loadedLayers;

            //In the event of overflow or underflow of the position(index) relative to the length of activeFrames,
            //perform a modulo operation to correct the error.
            if (position < 0 || position > activeFrames.length - 1) {
                position = mod(position, activeFrames.length);
            }

            addLayer(position);

            if (preloadOnly) return;

            if (activeLayers[activeData.layerAnimPos]) {
                activeLayers[activeData.layerAnimPos].setOpacity(0);
            }

            activeLayers[position].setOpacity(1);
            activeData.layerAnimPos = position;
        },
        [data, addLayer, active, availableLayers]
    );

    const showFrame = React.useCallback(
        (loadPos: number) => {
            if (!data || !availableLayers) return;
            const activeData = availableLayers[active];

            //Determine how to load the frame after one
            const preLoadDirection = loadPos - activeData.layerAnimPos >= 0 ? 1 : -1;

            changeRadarPos(loadPos, false); //Load frame
            changeRadarPos(loadPos + preLoadDirection, true); //Preload the next frame

            if (timeLine.current) {
                timeLine.current.value = activeData.layerAnimPos.toString();
            }

            if (timeP.current) {
                timeP.current.innerText = getTimeDisplay(
                    activeData.frames[activeData.layerAnimPos].time
                );
            }
        },
        [data, active, changeRadarPos, availableLayers]
    );

    React.useEffect(() => {
        if(!data || !availableLayers) return;

        showFrame(availableLayers[active].layerAnimPos);
    }, [active, availableLayers, data, showFrame])
    
    if(isLoading) return (
        <ControlPortal position={Position.BOTTOM_CENTER}>
            <Message className="leaflet-control">Loading Radar...</Message>
        </ControlPortal>
    );

    if(!data || !availableLayers) return (
        <ControlPortal position={Position.BOTTOM_CENTER}>
            <Message className="leaflet-control">Radar Unavailable</Message>
        </ControlPortal>
    )

    const activeData = availableLayers[active];

    return (
        <RadarContext.Provider value={null}>
            <ControlPortal position={Position.BOTTOM_CENTER}>
                <Playback className="leaflet-control">
                    <Time ref={timeP}>
                        {getTimeDisplay(activeData.frames[activeData.layerAnimPos].time)}
                    </Time>
                    <Timeline>
                        <Slider
                            ref={timeLine}
                            type="range"
                            list={radarList}
                            min={0}
                            max={activeData.frames.length - 1}
                            defaultValue={activeData.layerAnimPos}
                            onChange={e => showFrame(e.currentTarget.valueAsNumber)}
                        />
                        <Datalist id={radarList}>
                            {activeData.frames.map((frame, index) => (
                                <Option key={frame.time} value={index} />
                            ))}
                        </Datalist>
                    </Timeline>
                </Playback>
            </ControlPortal>
        </RadarContext.Provider>
    )
}
