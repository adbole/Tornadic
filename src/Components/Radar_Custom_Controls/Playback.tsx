import { useRef } from 'react'
import ReactDOM from 'react-dom/client';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { createControlComponent } from '@react-leaflet/core';

import { Play } from '../../svgs/svgs'

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

type AnimationData = {
    maxTime: number,
    minTime: number,
    currentPos: number
}

interface IStringDict<T> {
    [index: string]: T
}

//Last available layer is default
enum LayerTypes {
    Satellite = "Satellite",
    Radar = "Radar"
}

// type AvailableLayer = {
//     frames: Tile[],
//     loadedLayers: { [index: number]: L.TileLayer },
//     layerGroup: L.LayerGroup,
//     currentAnimPos: number
// }

const Playback = () => {
    const MAP = useMap();
    const SLIDER = useRef<HTMLInputElement>(null);
    let host: string;
    let layerFrames = {} as IStringDict<Tile[]>;
    let loadedLayers = {} as IStringDict<{ [index: number]: L.TileLayer }>;
    let layerGroups = {} as IStringDict<L.LayerGroup>
    let activeLayer: LayerTypes;

    let animationPos = {} as IStringDict<AnimationData>;
    let animationTimer: NodeJS.Timeout | null;

    MAP.on('baselayerchange', function(e) {
        activeLayer = e.name as LayerTypes
        console.log(activeLayer)
        const animData = animationPos[activeLayer];
        
        if(SLIDER.current !== null) {
            SLIDER.current!.min = animData.minTime.toString();
            SLIDER.current!.max = animData.maxTime.toString();
            SLIDER.current!.value = layerFrames[activeLayer][animData.currentPos].time.toString()
        }
        ShowFrame(animationPos[activeLayer].currentPos)
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
        layerFrames[LayerTypes.Radar] = response.radar.past.concat(response.radar.nowcast);
        layerFrames[LayerTypes.Satellite] = response.satellite.infrared;

        const layersControl = L.control.layers().addTo(MAP);
        
        //Prepare all other information and intialize needed objects
        Object.keys(LayerTypes).map((availableLayer) => {
            layerGroups[availableLayer] = L.layerGroup().addTo(MAP);
            loadedLayers[availableLayer] = [];
            const currentFrames = layerFrames[availableLayer];
            animationPos[availableLayer] = {
                maxTime: currentFrames[currentFrames.length - 1].time,
                minTime: currentFrames[0].time,
                currentPos: 0
            } as AnimationData;

            layersControl.addBaseLayer(layerGroups[availableLayer], availableLayer);
        })

        //Since the default is radar the lastFramePos will be determined by the last past frame
        activeLayer = LayerTypes.Radar;
        const lastFramePos = response.radar.past.length - 1; 

        ShowFrame(lastFramePos)
    }
    xhtml.send();

    function ShowFrame(loadPos: number) {
        //Determine how to load the frame after this one
        const preLoadDirection = loadPos - animationPos[activeLayer].currentPos > 0 ? 1 : -1

        ChangeRadarPos(loadPos, false); //Load this frame
        ChangeRadarPos(loadPos + preLoadDirection, true); //Preload the next frame
    }

    function ChangeRadarPos(position: number, preloadOnly: boolean) {
        const activeFrames = layerFrames[activeLayer];
        const activeLayers = loadedLayers[activeLayer];

        if(position < 0 || position > activeFrames.length - 1) {
            position = mod(position, activeFrames.length)
        }

        const currentFrame = activeFrames[animationPos[activeLayer].currentPos];
        const nextFrame = activeFrames[position];

        AddLayer(nextFrame);

        if(preloadOnly) return;

        animationPos[activeLayer].currentPos = position;

        if(activeLayers[currentFrame.time]) {
            activeLayers[currentFrame.time].setOpacity(0)
        }

        if(SLIDER.current !== null) {
            SLIDER.current!.value = nextFrame.time.toString();
        }
        activeLayers[nextFrame.time].setOpacity(1);
    }

    function AddLayer(frame: Tile) {
        const activeLayers = loadedLayers[activeLayer];

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
            layerGroups[activeLayer].addLayer(activeLayers[frame.time])
        }
    }

    //PlayAnim will show the next frame every 0.5s. PlayAnim cannot be called Play due to imported svg having same name
    function PlayAnim() {
        ShowFrame(animationPos[activeLayer].currentPos + 1);

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

    function PlayStop() {
        if(!Stop()) {
            PlayAnim();
        }
    }

    //Due to how layers are added, the baselayerchange event will not fire until the layers have been changed at least twice. 
    //To work aroundt this, a click is simulated on the controls at load to force the baselayerchange event to fire as expected.
    [...document.querySelectorAll('.leaflet-control-layers-selector')].forEach((el) => {
        el.dispatchEvent(new Event('click'))
    })

    const PlaybackComponent = () => (
        <>
            <div onClick={PlayStop}>
                <Play />
            </div>
            <div>
                <input type="range" ref={SLIDER} list={activeLayer} min={animationPos[activeLayer].minTime} max={animationPos[activeLayer].maxTime} defaultValue={layerFrames[activeLayer][animationPos[activeLayer].currentPos].time}/>
                {
                    Object.keys(LayerTypes).map((layer) => (
                        <datalist id={layer} key={layer}>
                            {
                                layerFrames[layer].map((tileLayer) => (
                                    <option value={tileLayer.time} key={tileLayer.time}></option>
                                ))
                            }
                        </datalist>
                    ))
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