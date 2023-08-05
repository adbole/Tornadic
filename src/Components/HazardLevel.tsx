/**
 * Some hazards like AQ and UV have indexes that can be easily represented using the HazardLevelView
 * Simply input the index into WeatherHelper to get the needed information to populate the view
 */

import React, { ReactNode } from "react";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Chart";
import Widget from "Components/Widget";
import { Sun } from "svgs/conditions";
import { Lungs } from "svgs/widget";

import { get_aq, get_uv, Normalize } from "ts/Helpers";
import { CombinedHourly } from "ts/Weather";


export type HazardInfo = Readonly<{
    id: string; //Used to distinguish the different gradient requirements in CSS
    title: string;
    titleIcon: ReactNode;
    min: number;
    max: number;
    message: string;
}>;

type HazardType = keyof Pick<CombinedHourly, "us_aqi" | "uv_index">;

function getHazardProps(hazard: HazardType, hazardValue: number) {
    if (hazard === "us_aqi") return getAQInfo(hazardValue);
    return getUVInfo(hazardValue);
}

const getAQInfo = (aq: number): HazardInfo => ({
    id: "AQ",
    title: "Air Quality",
    titleIcon: <Lungs />,
    min: 0,
    max: 500,
    message: get_aq(aq),
});

const getUVInfo = (uv: number): HazardInfo => ({
    id: "UV",
    title: "UV Index",
    titleIcon: <Sun />,
    min: 0,
    max: 11,
    message: get_uv(uv),
});

function Meter({ rotation }: { rotation: number }) {
    const id = React.useId();
    const clipID = id + "clip";
    const maskID = id + "mask";

    return (
        <svg viewBox="0 0 100 100">
            <clipPath id={clipID}>
                <path
                    d="m46.004 0.13243c-22.03 1.7671-40.35 18.023-44.916 39.87-0.44437 2.126-0.90007 5.623-1.0156 7.7904-1.1883 22.301 12.347 42.796 33.179 50.259 2.0749 0.74336 4.2612-0.50746 4.8186-2.6081l0.02597-0.09788c0.5574-2.1006-0.73318-4.2289-2.8108-4.9645-15.993-5.6622-27.264-20.059-28.841-36.847-0.20306-2.161-0.20852-5.6889-0.013465-7.8506 1.8806-20.841 18.589-37.442 39.575-39.328 2.1992-0.19764 5.7898-0.19764 7.989 3e-7 20.986 1.886 37.695 18.487 39.575 39.328 0.19506 2.1617 0.1896 5.6896-0.01347 7.8506-1.5775 16.787-12.848 31.184-28.841 36.847-2.0776 0.73556-3.3682 2.8639-2.8108 4.9645l0.02597 0.09788c0.5574 2.1006 2.7437 3.3515 4.8186 2.6081 20.832-7.4631 34.367-27.958 33.179-50.259-0.11549-2.1674-0.57119-5.6644-1.0156-7.7904-4.5666-21.847-22.887-38.103-44.916-39.87-2.2012-0.17657-5.79-0.17657-7.9912 4.3e-7z"
                    fill="#a51d2d"
                />
            </clipPath>
            <mask id={maskID}>
                <rect fill="white" x="0" y="0" width="100px" height="100px" />
                <g className="origin-center" style={{ transform: `rotate(${rotation}deg)` }}>
                    <ellipse fill="black" cx="50%" cy="97" rx="6" ry="6" />
                    <ellipse fill="white" cx="50%" cy="97" rx="3" ry="3" />
                </g>
            </mask>

            <foreignObject
                x="0"
                y="0"
                width="100%"
                height="100%"
                clipPath={`url(#${clipID})`}
                mask={`url(#${maskID})`}
            >
                <div className="gradient" />
            </foreignObject>
        </svg>
    );
}

/**
 * Takes the information on a given hazard such as AQ or UV Index and displays it using a radial level indicator.
 * @returns The HazardLevel widget displaying the information on a given hazard
 */
export default function HazardLevel({ hazard }: { hazard: HazardType }) {
    const { weather } = useWeather();
    const [modalOpen, showModal, hideModal] = useBooleanState(false);

    const hazardValue = Math.round(weather.getForecast(hazard));
    const { id, title, titleIcon, message, min, max } = getHazardProps(hazard, hazardValue);

    const rotation = 20 + 320 * Normalize.Decimal(hazardValue, min, max);

    return (
        <>
            <Widget
                className={"level-info"}
                id={id}
                widgetTitle={title}
                widgetIcon={titleIcon}
                onClick={showModal}
            >
                <div>
                    <Meter rotation={rotation} />
                    <div>
                        <p>{hazardValue}</p>
                        <p className="level-message">{message}</p>
                    </div>
                </div>
            </Widget>
            <Chart showView={hazard} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
