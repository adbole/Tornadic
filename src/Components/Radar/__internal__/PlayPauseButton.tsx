import React from "react";
import styled from "@emotion/styled";

import { useBooleanState } from "Hooks";

import { Button } from "Components/Input";
import { Pause, Play } from "svgs/radar";


const PlayPause = styled(Button)({
    svg: {
        width: "1.5rem",
        height: "1.5rem",
    },
});

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
        <PlayPause varient="transparent" onClick={onClick}>
            {isPlaying ? <Pause /> : <Play />}
        </PlayPause>
    );
}
