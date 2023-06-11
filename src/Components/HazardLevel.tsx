/**
 * Some hazards like AQ and UV have indexes that can be easily represented using the HazardLevelView
 * Simply input the index into WeatherHelper to get the needed information to populate the view
 */

import { Widget } from './SimpleComponents';
import { HazardInfo } from 'ts/WeatherData';
import { Normalize } from 'ts/Helpers';
import React from 'react';
import { Lungs } from 'svgs/widget';
import { Sun } from 'svgs/conditions';

export enum HazardType {
    AirQuality,
    UV
}

enum AQLevels {
    GOOD = "Good",
    MODERATE = "Moderate",
    UNHEALTHY_SENS = "Unhealthy for Sensitive Groups",
    UNHEALTHY = "Unhealthy",
    VERY_UNHEALTHY = "Very Unhealthy",
    HAZARDOUS = "Hazardous"
}

enum UVLevels {
    LOW = "Low",
    MODERATE = "Moderate",
    HIGH = "High",
    VERY_HIGH = "Very High",
    EXTREME = "Extreme"
}

function getAQInfo(aq: number): HazardInfo {
    return {
        id: "AQ",
        title: "Air Quality",
        titleIcon: <Lungs />,
        value: aq,
        min: 0,
        max: 500,
        message: getMessage()
    };

    function getMessage() {
        if (aq <= 50)  return AQLevels.GOOD; 
        else if (aq <= 100)  return AQLevels.MODERATE; 
        else if (aq <= 150)  return AQLevels.UNHEALTHY_SENS; 
        else if (aq <= 200)  return AQLevels.UNHEALTHY; 
        else  return AQLevels.VERY_UNHEALTHY; 
    }
}

function getUVInfo(uv: number): HazardInfo {
    return {
        id: "UV",
        title: "UV Index",
        titleIcon: <Sun />,
        value: uv,
        min: 0,
        max: 11,
        message: getMessage()
    };

    function getMessage() {
        if (uv <= 2) return UVLevels.LOW; 
        else if (uv <= 5) return UVLevels.MODERATE;
        else if (uv <= 7) return UVLevels.HIGH;
        else if (uv <= 10) return UVLevels.VERY_HIGH;
        else return UVLevels.EXTREME; 
    }
}

function getHazardProps(hazard: HazardType, hazardValue: number) {
    if (hazard === HazardType.AirQuality)
        return getAQInfo(hazardValue);
    else
        return getUVInfo(hazardValue);
}

const Meter = ({ rotation }: { rotation: number }) => {
    const id = React.useId();
    const clipID = id + "clip";
    const maskID = id + "mask";

    return (
        <svg viewBox="0 0 100 100">
            <clipPath id={clipID}>
                <path d="m46.004 0.13243c-22.03 1.7671-40.35 18.023-44.916 39.87-0.44437 2.126-0.90007 5.623-1.0156 7.7904-1.1883 22.301 12.347 42.796 33.179 50.259 2.0749 0.74336 4.2612-0.50746 4.8186-2.6081l0.02597-0.09788c0.5574-2.1006-0.73318-4.2289-2.8108-4.9645-15.993-5.6622-27.264-20.059-28.841-36.847-0.20306-2.161-0.20852-5.6889-0.013465-7.8506 1.8806-20.841 18.589-37.442 39.575-39.328 2.1992-0.19764 5.7898-0.19764 7.989 3e-7 20.986 1.886 37.695 18.487 39.575 39.328 0.19506 2.1617 0.1896 5.6896-0.01347 7.8506-1.5775 16.787-12.848 31.184-28.841 36.847-2.0776 0.73556-3.3682 2.8639-2.8108 4.9645l0.02597 0.09788c0.5574 2.1006 2.7437 3.3515 4.8186 2.6081 20.832-7.4631 34.367-27.958 33.179-50.259-0.11549-2.1674-0.57119-5.6644-1.0156-7.7904-4.5666-21.847-22.887-38.103-44.916-39.87-2.2012-0.17657-5.79-0.17657-7.9912 4.3e-7z" fill="#a51d2d" />
            </clipPath>
            <mask id={maskID}>
                <rect fill="white" x="0" y="0" width="100px" height="100px" />
                <g className="origin-center" style={{ transform: `rotate(${rotation}deg)` }}>
                    <ellipse fill="black" cx="50%" cy="97" rx="6" ry="6" />
                    <ellipse fill="white" cx="50%" cy="97" rx="3" ry="3" />
                </g>
            </mask>

            <foreignObject x="0" y="0" width="100%" height="100%" clipPath={`url(#${clipID})`} mask={`url(#${maskID})`}>
                <div className="gradient" />
            </foreignObject>
        </svg>
    );
};

/**
 * Takes the information on a given hazard such as AQ or UV Index and displays it using a radial level indicator.
 * @returns The HazardLevel widget displaying the information on a given hazard
 */
export const HazardLevel = ({ hazard, hazardValue }: { hazard: HazardType, hazardValue: number }) => {
    //Extracts everything but value, min, and max which are spread on the input
    const { id, title, titleIcon, message, value, min, max } = getHazardProps(hazard, hazardValue);

    const rotation = 20 + (320 * Normalize.Decimal(value, min, max));

    return (
        <Widget className={`level-info`} id={id} widgetTitle={title} widgetIcon={titleIcon}>
            <div>
                <Meter rotation={rotation} />
                <div>
                    <p>{value}</p>
                    <p>{message}</p>
                </div>
            </div>
        </Widget>
    );
};

export default HazardLevel;