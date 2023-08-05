import React from "react";

import { useBooleanState } from "Hooks";

import { Pause, Play } from "svgs/radar";


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
            //We are now paused, set isPlaying accordingly
            setIsPlayingFalse();
        } else {
            // Pause() returns false when it isn't possible to pause, therefore we should begin playing
            setIsPlayingTrue();
            play();
        }
    }

    return (
        <div className="play-pause" onClick={onClick}>
            {isPlaying ? <Pause /> : <Play />}
        </div>
    );
}
