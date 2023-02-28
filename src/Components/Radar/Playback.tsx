import React from 'react';
import ReactDOM from 'react-dom/client';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { createControlComponent } from '@react-leaflet/core';
import { FetchData } from '../../ts/Helpers';

import PlayPauseButtom from './PlayPauseButton';

//Uses floor function to keep remainder the same sign as divisor. 
function mod(x: number, div: number) {
    return x - div * Math.floor(x / div);
}

function getTimeDisplay(time: number) {
    return `${Date.now() > time * 1000 ? "Past" : "Forecast"}: ${new Date(time * 1000).toLocaleTimeString("en-us", {hour: "numeric", minute: "numeric", hour12: true})}`;
}

namespace RadarTypes {
    export type Tile = {
        time: number,
        path: string,
    }
    
    export type ApiResponse = {
        generated: number,
        host: string,
        radar: {
            nowcast: Tile[]
            past: Tile[]
        }
        satellite: {
            infrared: Tile[]
        }
    }
    
    //Last available layer is default
    export enum LayerTypes {
        Satellite = "Satellite",
        Radar = "Radar"
    }
    
    export type AvailableLayer = {
        frames: Tile[], //Frames available to show
        loadedLayers: { [index: number]: L.TileLayer }, //Layers representing a frame
        layerGroup: L.LayerGroup, //Layer group that houses the layers
        layerAnimPos: number, //Where in the animation we currently are
    }
    
    export type LayerDict = Record<LayerTypes, AvailableLayer>
    
    export type RadarData = {
        readonly host: string,
        readonly availableLayers: LayerDict,
        activeLayerData: AvailableLayer,
        animationTimer: NodeJS.Timeout | null,
        opacity: number
    }
}

const Playback = ({MAP} : {MAP: L.Map}) => {
    const [active, setActive] = React.useState(RadarTypes.LayerTypes.Radar);
    const [data, setData] = React.useState<RadarTypes.RadarData>();

    const timeLine = React.useRef<HTMLInputElement>(null);
    const timeP = React.useRef<HTMLParagraphElement>(null);

    const addLayer = React.useCallback((frame: RadarTypes.Tile) => {
        const activeLayer = data!.activeLayerData.loadedLayers;

        //If frame hasn't been added as a layer yet do so now
        if(!activeLayer[frame.time]) {
            const color = active === RadarTypes.LayerTypes.Radar ? 6 : 0;
            activeLayer[frame.time] = new L.TileLayer(data!.host + frame.path + "/512/{z}/{x}/{y}/" + color + "/1_0.png", {
                opacity: 0.0,
                zIndex: frame.time
            });
        }

        //If the layer of the frame hasn't been added yet do so now
        if(!MAP.hasLayer(activeLayer[frame.time])) {
            data!.activeLayerData.layerGroup.addLayer(activeLayer[frame.time]);
        }
    }, [MAP, active, data]);

    const changeRadarPos = React.useCallback((position: number, preloadOnly: boolean) => {
        if(!data) return;

        const activeFrames = data.activeLayerData.frames;
        const activeLayers = data.activeLayerData.loadedLayers;

        //In the event of overflow or underflow of the position(index) relative to the length of activeFrames,
        //perform a modulo operation to correct the error. 
        if(position < 0 || position > activeFrames.length - 1) {
            position = mod(position, activeFrames.length);
        }

        const currentFrame = activeFrames[data.activeLayerData.layerAnimPos];
        const nextFrame = activeFrames[position];

        addLayer(nextFrame);

        if(preloadOnly) return;

        data.activeLayerData.layerAnimPos = position;

        if(activeLayers[currentFrame.time]) {
            activeLayers[currentFrame.time].setOpacity(0);
        }

        activeLayers[nextFrame.time].setOpacity(data.opacity);
    }, [data, addLayer]);


    const showFrame = React.useCallback((loadPos: number) => {
        if(!data) return;

        const activeData = data.availableLayers[active];

        //Determine how to load the frame after one
        const preLoadDirection = loadPos - activeData.layerAnimPos > 0 ? 1 : -1;

        changeRadarPos(loadPos, false); //Load frame
        changeRadarPos(loadPos + preLoadDirection, true); //Preload the next frame

        if(timeLine.current) {
            timeLine.current.value = activeData.layerAnimPos.toString();
        }

        if(timeP.current) {
            timeP.current.innerText = getTimeDisplay(activeData.frames[activeData.layerAnimPos].time);
        }
    }, [data, active, changeRadarPos]);

    
    //Play will show the next frame every 0.5s.
    const playAnim = React.useCallback(() => {
        if(!data) return;

        showFrame(data.availableLayers[active].layerAnimPos + 1);

        data.animationTimer = setTimeout(playAnim, 500);
    }, [data, active, showFrame]);

    const pause = React.useCallback(() => {
        if(!data) return;

        if(data.animationTimer) {
            clearTimeout(data.animationTimer);
            data.animationTimer = null;
            return true; // We are now paused
        }

        return false; //Failed to pause
    }, [data]);

    React.useMemo(() => {
        async function GetData() {
            const response = await FetchData<RadarTypes.ApiResponse>("https://api.rainviewer.com/public/weather-maps.json", "Could not get radar data");
            if(response === null) return;

            const radarData = {
                host: response.host,
                availableLayers: {Satellite: {}, Radar: {}} as RadarTypes.LayerDict,
                opacity: 0.8,
            } as RadarTypes.RadarData;

            radarData.activeLayerData = radarData.availableLayers[active];

            //Prepare frames
            radarData.availableLayers.Radar.frames = response.radar.past.concat(response.radar.nowcast);
            radarData.availableLayers.Satellite.frames = response.satellite.infrared;

            const layersControl = L.control.layers().addTo(MAP);
            
            //Prepare all other information and intialize needed objects
            for(const key in radarData.availableLayers) {
                const layerKey = key as RadarTypes.LayerTypes;
                radarData.availableLayers[layerKey].layerGroup = L.layerGroup().addTo(MAP);
                radarData.availableLayers[layerKey].loadedLayers = [];
                radarData.availableLayers[layerKey].layerAnimPos = 0;

                layersControl.addBaseLayer(radarData.availableLayers[layerKey].layerGroup, layerKey);
            }
            
            MAP.on('baselayerchange', (e) => setActive(e.name as RadarTypes.LayerTypes));

            //Due to how layers are added, the baselayerchange event will not fire until the layers have been changed at least twice. 
            //To work around it a click is simulated on the controls at load to force the baselayerchange event to fire as expected.
            [...document.querySelectorAll('.leaflet-control-layers-selector')].forEach((el) => {
                el.dispatchEvent(new Event('click'));
            });

            //Since the default is radar the lastFramePos will be determined by the last past frame
            radarData.activeLayerData.layerAnimPos = response.radar.past.length - 1;
            setData(radarData);
        }

        GetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if(!data) return;

        data.activeLayerData = data.availableLayers[active];
        showFrame(data.activeLayerData.layerAnimPos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, data]);

    // function SetOpacty(e: React.ChangeEvent<HTMLInputElement>) {
    //     opacity.current = e.currentTarget.valueAsNumber;

    //     activeData.loadedLayers[activeData.frames[activeData.layerAnimPos].time].setOpacity(opacity.current);
    // }
    
    if(data) {
        const activeData = data.availableLayers[active];
        
        return (
            <>
                <p ref={timeP} className='time'>{getTimeDisplay(activeData.frames[activeData.layerAnimPos].time)}</p>
                <PlayPauseButtom Play={playAnim} Pause={pause}/>
                <div className="timeline">
                    <input ref={timeLine} type="range" list="radar-list" min={0} max={activeData.frames.length - 1} defaultValue={activeData.layerAnimPos} onChange={(e) => showFrame(e.currentTarget.valueAsNumber)}/>
                    <datalist id="radar-list">
                        {
                            activeData.frames.map((frame, index) => (
                                <option key={frame.time} value={index}></option>
                            ))
                        }
                    </datalist>
                </div>
            </>
        );
    }
    else {
        return null;
    }
};

const PlaybackLeafletWrapper = () => {
    const MAP = useMap();

    const Control = L.Control.extend({
        options: {
            position: "bottomcenter"
        },
        onAdd: () => {
            const div = L.DomUtil.create("div", "leaflet-custom-control");
            div.id = "playback";
            L.DomEvent.disableClickPropagation(div);
            ReactDOM.createRoot(div).render(<Playback MAP={MAP}/>);
            return div;
        }
    });

    return new Control();
};

export default createControlComponent(PlaybackLeafletWrapper);