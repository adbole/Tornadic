import React from "react";
import styled from "@emotion/styled";

import { useBooleanState } from "Hooks";

import { Pause, Play } from "svgs/radar";


const Button = styled.button({
    padding: 0,
    border: "none",
    background: "none",
    "svg": {
        width: "1.5rem",
        height: "1.5rem"
    }
})


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
        <Button type="button" onClick={onClick}>
            {isPlaying ? <Pause /> : <Play />}
        </Button>
    );
}
