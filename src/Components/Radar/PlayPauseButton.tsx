import React from "react";
import { Play, Pause } from '../../svgs/radar';
import { useBooleanState } from "Hooks";

const PlayPauseButton = (props: {play: VoidFunction, pause: Function}) => {
    const [isPlaying, setIsPlayingTrue, setIsPlayingFalse] = useBooleanState(false);

    function onClick(e: React.MouseEvent) {
        e.stopPropagation();

        if(props.pause()) { //We are now paused, set isPlaying accordingly
            setIsPlayingFalse();
        }
        else { // Pause() returns false when it isn't possible to pause, therefore we should begin playing
            setIsPlayingTrue();
            props.play();
        }
    }

    return (
        <div className='play-pause' onClick={onClick}>
            { isPlaying ? <Pause /> : <Play /> }
        </div>
    );
};

export default PlayPauseButton;