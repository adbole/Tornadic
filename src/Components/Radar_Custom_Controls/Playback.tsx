import React from 'react'
import ReactDOM from 'react-dom/client';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { createControlComponent } from '@react-leaflet/core';

import {Play, Pause} from '../../svgs/svgs'

//Uses floor function to keep remainder the same sign as divisor. 
const mod = (x: number, div: number) => {
    return x - div * Math.floor(x / div)
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
    currentAnimPos: number, //Where in the animation we currently are
    slider: React.RefObject<HTMLInputElement> //The slider showing animation progress
}

type LayerDict = Record<LayerTypes, AvailableLayer>

const Playback = () => {
    const MAP = useMap();
    let host: string;
    const availableLayers = {Satellite: {}, Radar: {}} as LayerDict;
    
    let activeLayer: LayerTypes;
    let animationTimer: NodeJS.Timeout | null;

    MAP.on('baselayerchange', function(e) {
        availableLayers[activeLayer].slider?.current?.classList.toggle('hide');
        activeLayer = e.name as LayerTypes
        availableLayers[activeLayer].slider?.current?.classList.toggle('hide');

        ShowFrame(availableLayers[activeLayer].currentAnimPos)
    })

    //Get radar data
    const xhtml = new XMLHttpRequest()
    xhtml.open("GET", "https://api.rainviewer.com/public/weather-maps.json", false);
    xhtml.onload = () => {
        if(xhtml.status !== 200) {
            console.error("Couldn't receive radar data")
            return;
        }

        const response: ApiResponse = JSON.parse(xhtml.response)
        
        host = response.host

        //Prepare frames
        availableLayers.Radar.frames = response.radar.past.concat(response.radar.nowcast);
        availableLayers.Satellite.frames = response.satellite.infrared;

        const layersControl = L.control.layers().addTo(MAP);
        
        //Prepare all other information and intialize needed objects
        for(const key in availableLayers) {
            const layerKey = key as LayerTypes;
            availableLayers[layerKey].layerGroup = L.layerGroup().addTo(MAP);
            availableLayers[layerKey].loadedLayers = [];
            availableLayers[layerKey].currentAnimPos = 0;

            layersControl.addBaseLayer(availableLayers[layerKey].layerGroup, layerKey);
        }

        //Since the default is radar the lastFramePos will be determined by the last past frame
        activeLayer = LayerTypes.Radar;
        const lastFramePos = response.radar.past.length - 1; 

        ShowFrame(lastFramePos)
    }
    xhtml.send();

    function ShowFrame(loadPos: number) {
        //Determine how to load the frame after this one
        const preLoadDirection = loadPos - availableLayers[activeLayer].currentAnimPos > 0 ? 1 : -1

        ChangeRadarPos(loadPos, false); //Load this frame
        ChangeRadarPos(loadPos + preLoadDirection, true); //Preload the next frame
    }

    function ChangeRadarPos(position: number, preloadOnly: boolean) {
        const activeFrames = availableLayers[activeLayer].frames;
        const activeLayers = availableLayers[activeLayer].loadedLayers;

        if(position < 0 || position > activeFrames.length - 1) {
            position = mod(position, activeFrames.length)
        }

        const currentFrame = activeFrames[availableLayers[activeLayer].currentAnimPos];
        const nextFrame = activeFrames[position];

        AddLayer(nextFrame);

        if(preloadOnly) return;

        availableLayers[activeLayer].currentAnimPos = position;

        if(activeLayers[currentFrame.time]) {
            activeLayers[currentFrame.time].setOpacity(0)
        }

        if(availableLayers[activeLayer].slider?.current !== undefined) {
            availableLayers[activeLayer].slider.current!.value = nextFrame.time.toString();
        }
        activeLayers[nextFrame.time].setOpacity(1);
    }

    function AddLayer(frame: Tile) {
        const activeLayers = availableLayers[activeLayer].loadedLayers;

        //If this frame hasn't been added as a layer yet do so now
        if(!activeLayers[frame.time]) {
            const color = activeLayer === LayerTypes.Radar ? 6 : 0
            activeLayers[frame.time] = new L.TileLayer(host + frame.path + "/512/{z}/{x}/{y}/" + color + "/1_0.png", {
                opacity: 0.0,
                zIndex: frame.time
            });
        }

        //If the layer of the frame hasn't been added yet do so now
        if(!MAP.hasLayer(activeLayers[frame.time])) {
            availableLayers[activeLayer].layerGroup.addLayer(activeLayers[frame.time])
        }
    }

    //Play will show the next frame every 0.5s.
    function PlayAnim() {
        ShowFrame(availableLayers[activeLayer].currentAnimPos + 1);

        animationTimer = setTimeout(PlayAnim, 500);
    }

    function Stop() {
        if(animationTimer) {
            clearTimeout(animationTimer);
            animationTimer = null
            return true;
        }

        return false;
    }



    //Due to how layers are added, the baselayerchange event will not fire until the layers have been changed at least twice. 
    //To work aroundt this, a click is simulated on the controls at load to force the baselayerchange event to fire as expected.
    [...document.querySelectorAll('.leaflet-control-layers-selector')].forEach((el) => {
        el.dispatchEvent(new Event('click'))
    })

    const PlayPauseComponent = () => {
        const [isPlaying, setIsPlaying] = React.useState(false);

        function PlayStop(e: React.MouseEvent) {
            e.stopPropagation()

            if(!Stop()) {
                setIsPlaying(true)
                PlayAnim();
            }
            else setIsPlaying(false)
        }

        return (
            <div onClick={PlayStop}>
                { isPlaying ? <Pause /> : <Play /> }
            </div>
        )
    }
    const PlaybackComponent = () => (
        <>
            <PlayPauseComponent />
            <div>
                {
                    Object.entries(availableLayers).map((pair) => {
                        const className = activeLayer === pair[0] ? "" : "hide";
                        availableLayers[pair[0] as LayerTypes].slider = React.createRef<HTMLInputElement>();

                        return (
                            <React.Fragment key={pair[0]}>
                                <input key={pair[0]} ref={pair[1].slider} type="range" className={className} list={"radar-" + pair[0]} min={pair[1].frames[0].time} max={pair[1].frames[pair[1].frames.length - 1].time} step={600} defaultValue={pair[1].frames[pair[1].currentAnimPos].time} />
                                <datalist id={"radar-" + pair[0]}>
                                    {
                                        pair[1].frames.map(frame => (
                                            <option key={frame.time} value={frame.time}></option>
                                        ))
                                    }
                                </datalist>
                            </React.Fragment>
                        )
                    })
                }
            </div>
        </>
    )

    const Home = L.Control.extend({
        options: {
            position: "bottomcenter"
        },
        onAdd: () => {
            const div = L.DomUtil.create("div", "leaflet-custom-control");
            div.id = "playback"
            L.DomEvent.disableClickPropagation(div)
            ReactDOM.createRoot(div).render(<PlaybackComponent />)
            return div;
        }
    });

    return new Home();
};

export default createControlComponent(Playback)