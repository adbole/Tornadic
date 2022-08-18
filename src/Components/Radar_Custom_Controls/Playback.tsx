import ReactDOM from 'react-dom/client';
import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import { Play } from '../../svgs/svgs'
import { hasOnlyExpressionInitializer } from 'typescript';
import { useMap } from 'react-leaflet';

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
}

interface IDictionary {
    [index: number]: L.TileLayer
}


const Playback = () => {
    const map = useMap();
    let timeStamps: ApiResponse;
    let animationPos = 0;
    let frames: Tile[];
    let layers = {} as IDictionary
    let animationTimer: NodeJS.Timeout | null;

    const xhtml = new XMLHttpRequest()
    xhtml.open("GET", "https://api.rainviewer.com/public/weather-maps.json", false);
    xhtml.onload = () => {
        if(xhtml.status !== 200) {
            console.error("Couldn't receive radar data")
            return;
        }

        timeStamps = JSON.parse(xhtml.response)
        frames = timeStamps.radar.past.concat(timeStamps.radar.nowcast);

        const lastFramePos = timeStamps.radar.past.length - 1; 
        ShowFrame(lastFramePos)
    }
    xhtml.send()

    function ShowFrame(loadPos: number) {
        const preLoadDirection = loadPos - animationPos > 0 ? 1 : -1

        ChangeRadarPos(loadPos, false);
        ChangeRadarPos(loadPos + preLoadDirection, true);
    }

    function ChangeRadarPos(position: number, preloadOnly: boolean) {
        while (position >= frames.length) {
            position -= frames.length;
        }
        while (position < 0) {
            position += frames.length;
        }

        const currentFrame = frames[animationPos];
        const nextFrame = frames[position];

        AddLayer(nextFrame);

        if(preloadOnly) return;

        animationPos = position;

        if(layers[currentFrame.time]) {
            layers[currentFrame.time].setOpacity(0)
        }

        layers[nextFrame.time].setOpacity(1);
    }

    function AddLayer(frame: Tile) {
        if(!layers[frame.time]) {
            layers[frame.time] = new L.TileLayer(timeStamps.host + frame.path + "/512/{z}/{x}/{y}/6/1_0.png", {
                opacity: 0.0,
                zIndex: frame.time
            });
        }

        if(!map.hasLayer(layers[frame.time])) {
            map.addLayer(layers[frame.time])
        }
    }

    function PlayAnim() {
        ShowFrame(animationPos + 1);

        animationTimer = setTimeout(PlayAnim, 1000);
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

    const PlaybackComponent = () => (
        <>
            <div onClick={PlayStop}>
                <Play />
            </div>
            <div>
                <input type="range" min="0" max="1" step="0.01" />
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