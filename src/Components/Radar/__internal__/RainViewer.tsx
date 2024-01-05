import React from "react"

import { useRainViewer } from "Hooks";

import getTimeFormatted from "ts/TimeConversion";

import ControlPortal, { Position } from "./ControlPortal";
import PlayPauseButton from "./PlayPauseButton";
import { Datalist, Message, Option,Playback, Slider, Time, Timeline } from "./RainViewer.style";


const getTimeDisplay = (time: number) => 
    `${Date.now() > time * 1000 ? "Past" : "Forecast"}: ${getTimeFormatted(
        time * 1000,
        "hourMinute"
    )}`;

export default function RainViewer() {
    const { availableLayers, active, showFrame, isLoading } = useRainViewer()
    const [currentFrame, setCurrentFrame] = React.useState<number>(0)

    const radarList = React.useId();

    const animationTimer = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        if(!availableLayers) return;

        showFrame(availableLayers[active].currentLayerIndex);
        setCurrentFrame(availableLayers[active].currentLayerIndex);
    }, [active, availableLayers, showFrame])

    //Play will show the next frame every 0.5s.
    const play = React.useCallback(() => {
        if(!availableLayers) return;

        showFrame(availableLayers[active].currentLayerIndex + 1);
        setCurrentFrame(availableLayers[active].currentLayerIndex);

        animationTimer.current = setTimeout(play, 500);
    }, [active, availableLayers, showFrame]);

    const pause = React.useCallback(() => {
        if (!availableLayers) return true;

        if (animationTimer.current) {
            clearTimeout(animationTimer.current);
            animationTimer.current = null;
            return true; // We are now paused
        }

        return false; //Failed to pause
    }, [availableLayers]);
    
    if(isLoading) return (
        <ControlPortal position={Position.BOTTOM_CENTER}>
            <Message className="leaflet-control">Loading Radar...</Message>
        </ControlPortal>
    );

    if(!availableLayers) return (
        <ControlPortal position={Position.BOTTOM_CENTER}>
            <Message className="leaflet-control">Radar Unavailable</Message>
        </ControlPortal>
    )

    const activeData = availableLayers[active];

    return (
        <ControlPortal position={Position.BOTTOM_CENTER}>
            <Playback className="leaflet-control">
                <Time>
                    {getTimeDisplay(activeData.frames[activeData.currentLayerIndex].time)}
                </Time>
                <PlayPauseButton play={play} pause={pause} />
                <Timeline>
                    <Slider
                        type="range"
                        list={radarList}
                        min={0}
                        max={activeData.frames.length - 1}
                        value={currentFrame}
                        onChange={e => {
                            showFrame(e.currentTarget.valueAsNumber);
                            setCurrentFrame(activeData.currentLayerIndex)
                        }}
                    />
                    <Datalist id={radarList}>
                        {activeData.frames.map((frame, index) => (
                            <Option key={frame.time} value={index} />
                        ))}
                    </Datalist>
                </Timeline>
            </Playback>
        </ControlPortal>
    )
}
