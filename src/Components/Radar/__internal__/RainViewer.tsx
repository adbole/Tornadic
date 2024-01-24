import React from "react";

import { useBooleanState, useRainViewer } from "Hooks";

import { Button } from "Components/Input";
import { Spinner } from "svgs";
import { Pause, Play } from "svgs/radar";

import { varNames } from "ts/StyleMixins";
import getTimeFormatted from "ts/TimeConversion";

import ControlPortal, { Position } from "./ControlPortal";
import { Message, Playback, Slider, Tick, TickArray, Time, Timeline } from "./RainViewer.style";


const getTimeDisplay = (time: number) =>
    `${Date.now() >= time * 1000 ? "Past" : "Forecast"}: ${getTimeFormatted(
        time * 1000,
        "hourMinute"
    )}`;

export default function RainViewer() {
    //showFrame will change the currentLayerIndex of the active layer,
    //therefore when calling showFrame and setCurrentFrame, always call showFrame first to stay up to date.
    //Tests will expect this behavior.

    const { availableLayers, active, showFrame, isLoading } = useRainViewer();
    const [currentFrame, setCurrentFrame] = React.useState<number>(0);

    const animationTimer = React.useRef<NodeJS.Timeout | null>(null);

    const awaitResume = React.useRef<boolean>(false);
    const [loadingLayer, setLoadingLayerTrue, setLoadingLayerFalse] = useBooleanState(false);
    const [isPlaying, setIsPlayingTrue, setIsPlayingFalse] = useBooleanState(false);

    const getNextTile = () => {
        if (!availableLayers) return undefined;

        const currentLayer = availableLayers[active];
        return currentLayer.tileLayers[
            (currentLayer.currentLayerIndex + 1) % currentLayer.tileLayers.length
        ];
    }

    React.useEffect(() => {
        if (!availableLayers) return;

        const nextTile = getNextTile();
        if (!nextTile) return;

        if (nextTile.isLoading()) setLoadingLayerTrue();

        nextTile.on("loading", setLoadingLayerTrue);
        nextTile.on("load", setLoadingLayerFalse);
        nextTile.on("remove", setLoadingLayerFalse);

        return () => {
            nextTile.off("loading", setLoadingLayerTrue);
            nextTile.off("load", setLoadingLayerFalse);
            nextTile.off("remove", setLoadingLayerFalse);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, availableLayers, currentFrame]);

    //Play will show the next frame every 0.5s.
    const play = React.useCallback(() => {
        if (!availableLayers) return;

        if(getNextTile()?.isLoading() || awaitResume.current) {
            awaitResume.current = true;
            return;
        }

        setIsPlayingTrue();
        showFrame(availableLayers[active].currentLayerIndex + 1);
        setCurrentFrame(availableLayers[active].currentLayerIndex);

        animationTimer.current = setTimeout(play, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, availableLayers, showFrame, ]);

    const pause = React.useCallback(() => {
        if (!availableLayers) return true;

        if (animationTimer.current) {
            clearTimeout(animationTimer.current);

            setIsPlayingFalse();
            animationTimer.current = null;
        }

    }, [availableLayers, setIsPlayingFalse]);

    React.useEffect(() => {
        if(!loadingLayer && awaitResume.current) {
            awaitResume.current = false;
            play();
        }
    }, [loadingLayer, play]);

    React.useEffect(() => {
        if (!availableLayers) return;

        if (isPlaying) {
            pause();
            play();
        };

        showFrame(availableLayers[active].currentLayerIndex);
        setCurrentFrame(availableLayers[active].currentLayerIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, availableLayers, showFrame]);

    if (isLoading)
        return (
            <ControlPortal position={Position.BOTTOM_CENTER}>
                <Message className="leaflet-control">Loading Radar...</Message>
            </ControlPortal>
        );

    if (!availableLayers)
        return (
            <ControlPortal position={Position.BOTTOM_CENTER}>
                <Message className="leaflet-control">Radar Unavailable</Message>
            </ControlPortal>
        );

    const activeData = availableLayers[active];

    return (
        <ControlPortal position={Position.BOTTOM_CENTER}>
            <Playback className="leaflet-control">
                <Time>{getTimeDisplay(activeData.frames[activeData.currentLayerIndex].time)}</Time>
                <Button
                    varient="transparent"
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();

                        if (loadingLayer) {
                            //CLick will pause no matter what during load
                            pause();
                            awaitResume.current = false;
                        } else if (isPlaying) {
                            pause();
                        } else {
                            play();
                        }
                    }}
                    style={{ [varNames.svgSize]: "1.5rem" }}
                    title={loadingLayer ? "Loading" : isPlaying ? "Pause" : "Play"}
                >
                    {loadingLayer ? <Spinner /> : isPlaying ? <Pause /> : <Play />}
                </Button>
                <Timeline>
                    <Slider
                        type="range"
                        min={0}
                        max={activeData.frames.length - 1}
                        value={currentFrame}
                        onChange={e => {
                            if (isPlaying) {
                                pause();
                                setIsPlayingFalse();
                            }

                            showFrame(e.currentTarget.valueAsNumber);
                            setCurrentFrame(activeData.currentLayerIndex);
                        }}
                    />
                    <TickArray>
                        {activeData.frames.map(frame => (
                            <Tick key={frame.time} />
                        ))}
                    </TickArray>
                </Timeline>
            </Playback>
        </ControlPortal>
    );
}
