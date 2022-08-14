import ReactDOM from 'react-dom/client';
import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import {ReactComponent as Grid} from '../../svgs/grid.svg'

const createHomeButton = (props) => {
    const Home = L.Control.extend({
            onAdd: () => {
                const button = L.DomUtil.create("a", "leaflet-custom-control home");
                button.addEventListener("click", props.onClick);
                ReactDOM.createRoot(button).render(<Grid />)

                return button;
            }
    });

  return new Home();
};

export default createControlComponent(createHomeButton);