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

type Tile = {
    time: number,
    path: string,
}

type ApiResponse = {
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
enum LayerTypes {
    Satellite = "Satellite",
    Radar = "Radar"
}

type AvailableLayer = {
    frames: Tile[], //Frames available to show
    loadedLayers: { [index: number]: L.TileLayer }, //Layers representing a frame
    layerGroup: L.LayerGroup, //Layer group that houses the layers
    layerAnimPos: number, //Where in the animation we currently are
}

type LayerDict = Record<LayerTypes, AvailableLayer>

const Playback = ({MAP} : {MAP: L.Map}) => {
    const [active, setActive] = React.useState(LayerTypes.Radar);

    const availableLayers = React.useRef({Satellite: {}, Radar: {}} as LayerDict).current;
    const host = React.useRef("");
    const animationTimer = React.useRef<NodeJS.Timeout>();
    const opacity = React.useRef(0.8);
    const timeLine = React.useRef<HTMLInputElement>(null);
    const timeP = React.useRef<HTMLParagraphElement>(null);

    const activeData = availableLayers[active];

    React.useMemo(() => {
        //TODO: Switch to using Fetch with async
        // async function GetData() {
        //     const response = await FetchData<ApiResponse>("https://api.rainviewer.com/public/weather-maps.json", "Could not get radar data");
        //     if(response === null) return;

            
        // }

        const xhtml = new XMLHttpRequest();
        xhtml.open("GET", "https://api.rainviewer.com/public/weather-maps.json", false);
        xhtml.onload = () => {
            if(xhtml.status !== 200) {
                console.error("Couldn't receive radar data");
                return;
            }

            const response: ApiResponse = JSON.parse(xhtml.response);
            
            host.current = response.host;

            //Prepare frames
            availableLayers.Radar.frames = response.radar.past.concat(response.radar.nowcast);
            availableLayers.Satellite.frames = response.satellite.infrared;

            const layersControl = L.control.layers().addTo(MAP);
            
            //Prepare all other information and intialize needed objects
            for(const key in availableLayers) {
                const layerKey = key as LayerTypes;
                availableLayers[layerKey].layerGroup = L.layerGroup().addTo(MAP);
                availableLayers[layerKey].loadedLayers = [];
                availableLayers[layerKey].layerAnimPos = 0;

                layersControl.addBaseLayer(availableLayers[layerKey].layerGroup, layerKey);
            }

            //Since the default is radar the lastFramePos will be determined by the last past frame
            const lastFramePos = response.radar.past.length - 1; 

            ShowFrame(lastFramePos);
        };
        xhtml.send();

        MAP.on('baselayerchange', (e) => setActive(e.name as LayerTypes));

        //Due to how layers are added, the baselayerchange event will not fire until the layers have been changed at least twice. 
        //To work around it a click is simulated on the controls at load to force the baselayerchange event to fire as expected.
        [...document.querySelectorAll('.leaflet-control-layers-selector')].forEach((el) => {
            el.dispatchEvent(new Event('click'));
        });
    }, []);

    React.useEffect(() => ShowFrame(activeData.layerAnimPos), [active]);

    function ShowFrame(loadPos: number) {
        //Determine how to load the frame after one
        const preLoadDirection = loadPos - activeData.layerAnimPos > 0 ? 1 : -1;

        ChangeRadarPos(loadPos, false); //Load frame
        ChangeRadarPos(loadPos + preLoadDirection, true); //Preload the next frame

        if(timeLine.current !== null) {
            timeLine.current.value = activeData.layerAnimPos.toString();
        }

        if(timeP.current !== null) {
            timeP.current.innerText = getTimeDisplay(activeData.frames[activeData.layerAnimPos].time);
        }
    }

    function ChangeRadarPos(position: number, preloadOnly: boolean) {
        const activeFrames = activeData.frames;
        const activeLayers = activeData.loadedLayers;

        //In the event of overflow or underflow of the position(index) relative to the length of activeFrames,
        //perform a modulo operation to correct the error. 
        if(position < 0 || position > activeFrames.length - 1) {
            position = mod(position, activeFrames.length);
        }

        const currentFrame = activeFrames[activeData.layerAnimPos];
        const nextFrame = activeFrames[position];

        AddLayer(nextFrame);

        if(preloadOnly) return;

        activeData.layerAnimPos = position;

        if(activeLayers[currentFrame.time]) {
            activeLayers[currentFrame.time].setOpacity(0);
        }

        activeLayers[nextFrame.time].setOpacity(opacity.current);
    }

    function AddLayer(frame: Tile) {
        const activeLayer = activeData.loadedLayers;

        //If frame hasn't been added as a layer yet do so now
        if(!activeLayer[frame.time]) {
            const color = active === LayerTypes.Radar ? 6 : 0;
            activeLayer[frame.time] = new L.TileLayer(host.current + frame.path + "/512/{z}/{x}/{y}/" + color + "/1_0.png", {
                opacity: 0.0,
                zIndex: frame.time
            });
        }

        //If the layer of the frame hasn't been added yet do so now
        if(!MAP.hasLayer(activeLayer[frame.time])) {
            activeData.layerGroup.addLayer(activeLayer[frame.time]);
        }
    }

    //Play will show the next frame every 0.5s.
    function PlayAnim() {
        ShowFrame(activeData.layerAnimPos + 1);

        animationTimer.current = setTimeout(PlayAnim, 500);
    }

    function Pause() {
        if(animationTimer.current) {
            clearTimeout(animationTimer.current);
            animationTimer.current = undefined;
            return true; // We are now paused
        }

        return false; //Failed to pause
    }

    function SetOpacty(e: React.ChangeEvent<HTMLInputElement>) {
        opacity.current = e.currentTarget.valueAsNumber;

        activeData.loadedLayers[activeData.frames[activeData.layerAnimPos].time].setOpacity(opacity.current);
    }

    return (
        <>
            <p ref={timeP} className='time'>{getTimeDisplay(activeData.frames[activeData.layerAnimPos].time)}</p>
            <PlayPauseButtom Play={PlayAnim} Pause={Pause}/>
            <div className="timeline">
                <input ref={timeLine} type="range" list="radar-list" min={0} max={activeData.frames.length - 1} defaultValue={activeData.layerAnimPos} onChange={(e) => ShowFrame(e.currentTarget.valueAsNumber)}/>
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