import React from "react";

import { useBooleanState } from "Hooks";

import { Button } from "Components/Input";
import { Pause, Play } from "svgs/radar";

import { varNames } from "ts/StyleMixins";


export default function PlayPauseButton({
    play,
    pause,
}: {
    play: VoidFunction;
    pause: () => boolean;
}) {
    const [isPlaying, setIsPlayingTrue, setIsPlayingFalse] = useBooleanState(false);

    function onClick(e: React.MouseEvent) {
        e.stopPropagation();

        if (pause()) {
            setIsPlayingFalse();
        } else {
            setIsPlayingTrue();
            play();
        }
    }

    return (
        <Button 
            varient="transparent" 
            onClick={onClick} 
            style={{ [varNames.svgSize]: "1.5rem" }}
            title={isPlaying ? "Pause" : "Play"}
        >
            {isPlaying ? <Pause /> : <Play />}
        </Button>
    );
}
