import React from "react";
import { Play, Pause } from '../../svgs/radar';

const PlayPauseButton = (props: {play: VoidFunction, pause: Function}) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    function onClick(e: React.MouseEvent) {
        e.stopPropagation();

        if(props.pause()) { //We are now paused, set isPlaying accordingly
            setIsPlaying(false);
        }
        else { // Pause() returns false when it isn't possible to pause, therefore we should begin playing
            setIsPlaying(true);
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