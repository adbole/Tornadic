import ReactDOM from 'react-dom/client';
import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import { ReactComponent as Play } from '../../svgs/play-fill.svg'

const PlaybackComponent = (props) => (
    <>
        <Play />
        <div>
            <input type="range" min="0" max="1" step="0.01"/>
        </div>
    </>
)

const Playback = (props) => {
    const Home = L.Control.extend({
        options: {
            position: "bottomcenter"
        },
        onAdd: () => {
            const div = L.DomUtil.create("div", "leaflet-custom-control playback");
            L.DomEvent.disableClickPropagation(div)
            ReactDOM.createRoot(div).render(<PlaybackComponent {...props}/>)
            return div;
        }
    });

    return new Home();
  };

export default createControlComponent(Playback)