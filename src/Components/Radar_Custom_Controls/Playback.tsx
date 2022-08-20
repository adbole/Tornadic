import React from 'react'
import ReactDOM from 'react-dom/client';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { createControlComponent } from '@react-leaflet/core';

import { Play, Pause } from '../../svgs/svgs'

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
type PlaybackProps = { MAP: L.Map }

class PlayPauseButton extends React.PureComponent<{Play: VoidFunction, Stop: Function}, {isPlaying: boolean}> {
    state = {
        isPlaying: false
    }

    OnCLick(e: React.MouseEvent) {
        e.stopPropagation();

        if(!this.props.Stop()) {
            this.setState({isPlaying: true})
            this.props.Play();
        }
        else this.setState({isPlaying: false})
    }

    render() {
        return (
            <div onClick={this.OnCLick.bind(this)}>
                { this.state.isPlaying ? <Pause /> : <Play /> }
            </div>
        )
    }
}

class Playback extends React.Component<PlaybackProps, { active: LayerTypes}> {
    host!: string;
    availableLayers = {Satellite: {}, Radar: {}} as LayerDict;
    animationTimer!: NodeJS.Timeout | null;
    timeLine!: React.RefObject<HTMLInputElement>

    constructor(props: PlaybackProps) {
        super(props);

        this.state = {
            active: LayerTypes.Radar
        }
        this.timeLine = React.createRef<HTMLInputElement>();

        this.Setup();

        this.props.MAP.on('baselayerchange', (e) => this.UpdateLayer(e.name as LayerTypes));

        //Due to how layers are added, the baselayerchange event will not fire until the layers have been changed at least twice. 
        //To work aroundt this, a click is simulated on the controls at load to force the baselayerchange event to fire as expected.
        [...document.querySelectorAll('.leaflet-control-layers-selector')].forEach((el) => {
            el.dispatchEvent(new Event('click'))
        })
    }

    Setup() {
        const xhtml = new XMLHttpRequest()
        xhtml.open("GET", "https://api.rainviewer.com/public/weather-maps.json", false);
        xhtml.onload = () => {
            if(xhtml.status !== 200) {
                console.error("Couldn't receive radar data")
                return;
            }

            const response: ApiResponse = JSON.parse(xhtml.response)
            
            this.host = response.host

            //Prepare frames
            this.availableLayers.Radar.frames = response.radar.past.concat(response.radar.nowcast);
            this.availableLayers.Satellite.frames = response.satellite.infrared;

            const layersControl = L.control.layers().addTo(this.props.MAP);
            
            //Prepare all other information and intialize needed objects
            for(const key in this.availableLayers) {
                const layerKey = key as LayerTypes;
                this.availableLayers[layerKey].layerGroup = L.layerGroup().addTo(this.props.MAP);
                this.availableLayers[layerKey].loadedLayers = [];
                this.availableLayers[layerKey].currentAnimPos = 0;

                layersControl.addBaseLayer(this.availableLayers[layerKey].layerGroup, layerKey);
            }

            //Since the default is radar the lastFramePos will be determined by the last past frame
            const lastFramePos = response.radar.past.length - 1; 

            this.ShowFrame(lastFramePos)
        }
        xhtml.send();
    }

    UpdateLayer(layer: LayerTypes) {
        this.setState({active: layer})
        this.ShowFrame(this.availableLayers[layer].currentAnimPos)
    }

    ShowFrame(loadPos: number) {
        //Determine how to load the frame after this one
        const preLoadDirection = loadPos - this.availableLayers[this.state.active].currentAnimPos > 0 ? 1 : -1

        this.ChangeRadarPos(loadPos, false); //Load this frame
        this.ChangeRadarPos(loadPos + preLoadDirection, true); //Preload the next frame
    }

    ChangeRadarPos(position: number, preloadOnly: boolean) {
        const activeFrames = this.availableLayers[this.state.active].frames;
        const activeLayers = this.availableLayers[this.state.active].loadedLayers;

        if(position < 0 || position > activeFrames.length - 1) {
            position = mod(position, activeFrames.length)
        }

        const currentFrame = activeFrames[this.availableLayers[this.state.active].currentAnimPos];
        const nextFrame = activeFrames[position];

        this.AddLayer(nextFrame);

        if(preloadOnly) return;

        this.availableLayers[this.state.active].currentAnimPos = position;

        if(activeLayers[currentFrame.time]) {
            activeLayers[currentFrame.time].setOpacity(0)
        }

        if(this.availableLayers[this.state.active].slider?.current !== undefined) {
            this.availableLayers[this.state.active].slider.current!.value = nextFrame.time.toString();
        }

        if(this.timeLine.current !== null) {
            this.timeLine.current.value = nextFrame.time.toString()
        }
        activeLayers[nextFrame.time].setOpacity(1);
    }

    AddLayer(frame: Tile) {
        const activeLayers = this.availableLayers[this.state.active].loadedLayers;

        //If this frame hasn't been added as a layer yet do so now
        if(!activeLayers[frame.time]) {
            const color = this.state.active === LayerTypes.Radar ? 6 : 0
            activeLayers[frame.time] = new L.TileLayer(this.host + frame.path + "/512/{z}/{x}/{y}/" + color + "/1_0.png", {
                opacity: 0.0,
                zIndex: frame.time
            });
        }

        //If the layer of the frame hasn't been added yet do so now
        if(!this.props.MAP.hasLayer(activeLayers[frame.time])) {
            this.availableLayers[this.state.active].layerGroup.addLayer(activeLayers[frame.time])
        }
    }

    //Play will show the next frame every 0.5s.
    PlayAnim() {
        this.ShowFrame(this.availableLayers[this.state.active].currentAnimPos + 1);

        this.animationTimer = setTimeout(this.PlayAnim.bind(this), 500);
    }

    Stop() {
        if(this.animationTimer) {
            clearTimeout(this.animationTimer);
            this.animationTimer = null
            return true;
        }

        return false;
    }

    render() {
        return (
        <>
            <PlayPauseButton Play={this.PlayAnim.bind(this)} Stop={this.Stop.bind(this)}/>
            <div>
                <input type="range" list="radar-list" ref={this.timeLine} min={this.availableLayers[this.state.active].frames[0].time} 
                    max={this.availableLayers[this.state.active].frames[this.availableLayers[this.state.active].frames.length - 1].time} 
                    step={600}
                    defaultValue={this.availableLayers[this.state.active].frames[this.availableLayers[this.state.active].currentAnimPos].time} 
                />
                <datalist id="radar-list">
                    {
                        this.availableLayers[this.state.active].frames.map(frame => (
                            <option key={frame.time} value={frame.time}></option>
                        ))
                    }
                </datalist>
            </div>
        </>
    )}
}

const PlaybackLeafletWrapper = () => {
    const MAP = useMap();

    const Home = L.Control.extend({
        options: {
            position: "bottomcenter"
        },
        onAdd: () => {
            const div = L.DomUtil.create("div", "leaflet-custom-control");
            div.id = "playback"
            L.DomEvent.disableClickPropagation(div)
            ReactDOM.createRoot(div).render(<Playback MAP={MAP}/>)
            return div;
        }
    });

    return new Home();
}

export default createControlComponent(PlaybackLeafletWrapper)