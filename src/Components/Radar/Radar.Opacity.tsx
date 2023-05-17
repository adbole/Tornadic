import React from 'react';
import { CircleSlashes } from '../../svgs/radar';

const Opacity = ({value, setOpacity}: {value: number, setOpacity: (x: number) => void}) => {
    const [hover, setHover] = React.useState(false);

    //Fallback for touch devices
    React.useEffect(() => {
        const reset = () => setHover(false);

        document.body.addEventListener("click", reset);
        return () => document.body.removeEventListener("click", reset);
    }, []);

    return (
        <div className="leaflet-custom-control leaflet-control" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {!hover && <div className='leaflet-control-toggle'><CircleSlashes/></div>}
            {hover && 
                <div id="opacity">
                    <p>Opacity: {(value * 100).toFixed(0)}</p>
                    <input type="range" min={0} max={100} value={value * 100} step={1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpacity(e.currentTarget.valueAsNumber / 100)}/>
                </div>
            }
        </div>
    );
};

export default Opacity;