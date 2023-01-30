import React from "react";
import { Play, Pause } from '../../svgs/radar/radar.svgs';


const PlayPauseButton = (props: {Play: VoidFunction, Pause: Function}) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    function OnCLick(e: React.MouseEvent) {
        e.stopPropagation();

        if(props.Pause()) { //We are now paused, set isPlaying accordingly
            setIsPlaying(false);
        }
        else { // Pause() returns false when it isn't possible to pause, therefore we should begin playing
            setIsPlaying(true);
            props.Play();
        }
    }

    return (
        <div className='play-pause' onClick={OnCLick}>
            { isPlaying ? <Pause /> : <Play /> }
        </div>
    );
};

export default PlayPauseButton;