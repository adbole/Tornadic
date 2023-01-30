/**
 * Some hazards like AQ and UV have indexes that can be easily represented using the HazardLevelView
 * Simply input the index into WeatherHelper to get the needed information to populate the view
 */

import { Widget } from './SimpleComponents';
import { HazardInfo } from '../ts/WeatherData';
import { Normalize } from '../ts/Helpers';

export const HazardLevelView = (props: {
    info: HazardInfo
}) => {
    //Extracts everything but value, min, and max which are spread on the input
    const {id, title, titleIcon, message, value, min, max} = props.info;

    const clipID = "clip-" + id;
    const maskID = "mask-" + id;
    const rotation = 20 + (320 * Normalize.Decimal(value, min, max));

    return (
        <Widget className={`level-info`} id={id} widgetTitle={title} widgetIcon={titleIcon}>
            <div>
                <svg viewBox="0 0 100 100">
                    <clipPath id={clipID}>
                        <path d="m46.004 0.13243c-22.03 1.7671-40.35 18.023-44.916 39.87-0.44437 2.126-0.90007 5.623-1.0156 7.7904-1.1883 22.301 12.347 42.796 33.179 50.259 2.0749 0.74336 4.2612-0.50746 4.8186-2.6081l0.02597-0.09788c0.5574-2.1006-0.73318-4.2289-2.8108-4.9645-15.993-5.6622-27.264-20.059-28.841-36.847-0.20306-2.161-0.20852-5.6889-0.013465-7.8506 1.8806-20.841 18.589-37.442 39.575-39.328 2.1992-0.19764 5.7898-0.19764 7.989 3e-7 20.986 1.886 37.695 18.487 39.575 39.328 0.19506 2.1617 0.1896 5.6896-0.01347 7.8506-1.5775 16.787-12.848 31.184-28.841 36.847-2.0776 0.73556-3.3682 2.8639-2.8108 4.9645l0.02597 0.09788c0.5574 2.1006 2.7437 3.3515 4.8186 2.6081 20.832-7.4631 34.367-27.958 33.179-50.259-0.11549-2.1674-0.57119-5.6644-1.0156-7.7904-4.5666-21.847-22.887-38.103-44.916-39.87-2.2012-0.17657-5.79-0.17657-7.9912 4.3e-7z" fill="#a51d2d"/>
                        {/* <path d="M 46.004409,0.13475963 C 23.974904,1.9329745 5.6545371,18.475398 1.0879858,40.707882 0.64361324,42.871332 0.18791781,46.429993 0.07242607,48.635591 -1.1158928,71.32946 12.419156,92.185613 33.251066,99.780294 c 2.074944,0.756466 4.261238,-0.516401 4.81864,-2.654063 l 0.02597,-0.0996 c 0.557402,-2.137662 -0.733184,-4.30346 -2.810824,-5.05199 C 19.291608,86.212611 8.02098,71.561831 6.4435062,54.4787 6.2404436,52.279649 6.2349858,48.68951 6.4300409,46.489722 8.3106089,25.281097 25.019288,8.3873632 46.005521,6.4680871 c 2.199195,-0.2011253 5.789763,-0.2011252 7.988958,3e-7 20.986232,1.9192774 37.69491,18.8130116 39.575478,40.0216346 0.195055,2.199788 0.189597,5.789929 -0.01347,7.988982 -1.577475,17.083131 -12.848103,31.733909 -28.841349,37.495936 -2.077637,0.748528 -3.368222,2.914327 -2.810822,5.051989 l 0.02597,0.0996 c 0.5574,2.137662 2.743695,3.41053 4.818641,2.654063 C 87.580845,92.185612 101.11589,71.329457 99.927574,48.635587 99.812083,46.429991 99.356387,42.87133 98.912014,40.707877 94.345461,18.475393 76.025092,1.9329717 53.995587,0.13475919 c -2.201205,-0.17967872 -5.789972,-0.17967873 -7.991178,4.4e-7 z"/> */}
                    </clipPath>
                    <mask id={maskID}>
                        <rect fill="white" x="0" y="0" width="100px" height="100px"/>
                        <g className="origin-center" style={{transform: `rotate(${rotation}deg)`}}>
                            <ellipse fill="black" cx="50%" cy="97" rx="6" ry="6"/>
                            <ellipse fill="white" cx="50%" cy="97" rx="3" ry="3"/>
                        </g>
                    </mask>
    
                    <foreignObject x="0" y="0" width="100%" height="100%" clipPath={`url(#${clipID})`} mask={`url(#${maskID})`}>
                        <div className="gradient" />
                    </foreignObject>
                </svg>
                <div>
                    <p>{value}</p>
                    <p>{message}</p>
                </div>
            </div>
            {/* <label>
                <span>{props.info.value} - {message}</span>
                <input type="range"  {...excess} disabled/>
            </label> */}
        </Widget>
    );
};

export default HazardLevelView;