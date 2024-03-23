import React from "react";

import { useReadLocalStorage } from "Hooks";

import { useChart } from "Components/Chart";
import { Area, Bar, Line } from "Components/Chart/Components";

import type { AQLevel, UVLevel } from "ts/Helpers";
import { getAQMaxValue, getUVMaxValue, toHSL } from "ts/Helpers";

import type { ChartViews } from "../..";


function UVGradient() {
    const { y } = useChart();

    if (y.domain().includes(NaN)) return null;

    const yCopy = y.copy().range([0, 1]);
    const getOffset = (key: UVLevel) => 1 - yCopy(getUVMaxValue(key));

    return (
        <>
            <stop offset={getOffset("Extreme")} stopColor="#FF00D6" key="Extreme" />
            <stop offset={getOffset("Very High")} stopColor="#FF2204" key="Very High" />
            <stop offset={getOffset("High")} stopColor="#FF9431" key="High" />
            <stop offset={getOffset("Moderate")} stopColor="#FFF501" key="Moderate" />
            <stop offset={getOffset("Low")} stopColor="#00FF66" key="Low" />
        </>
    );
}

function AQGradient() {
    const { y } = useChart();

    if (y.domain().includes(NaN)) return null;

    const yCopy = y.copy().range([0, 1]);
    const getOffset = (key: AQLevel) => 1 - yCopy(getAQMaxValue(key));

    return (
        <>
            <stop offset={getOffset("Hazardous")} stopColor="#6D0000" key="Hazardous" />
            <stop offset={getOffset("Very Unhealthy")} stopColor="#8400FF" key="Very Unhealthy" />
            <stop offset={getOffset("Unhealthy")} stopColor="#FF2204" key="Unhealthy" />
            <stop offset={getOffset("Unhealthy*")} stopColor="#FF9431" key="Unhealthy*" />
            <stop offset={getOffset("Moderate")} stopColor="#FFF501" key="Moderate" />
            <stop offset={getOffset("Good")} stopColor="#00FF66" key="Good" />
        </>
    );
}

export default function ChartVisualization({ view }: { view: ChartViews }) {
    const { dataPoints, y } = useChart();
    const settings = useReadLocalStorage("userSettings");

    const gradientId = React.useId();

    const visual = React.useMemo(() => {
        switch (view) {
            case "precipitation":
                return <Bar fill="#0078ef" />;
            case "us_aqi":
            case "uv_index":
            case "temperature_2m": {
                return <Area fill={`url(#${gradientId})`} fillOpacity={0.75} />;
            }
            default: {
                return <Line fill="none" stroke="#0078ef" strokeWidth={2} />;
            }
        }
    }, [view, gradientId]);

    const gradient = React.useMemo(() => {
        if (view === "temperature_2m" && settings) {
            const max = Math.max(...dataPoints.map(({ y: [value]}) => value));
            const min = Math.min(...dataPoints.map(({ y: [value]}) => value));

            return (
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={toHSL(max, settings.tempUnit)} />
                        <stop offset="100%" stopColor={toHSL(min, settings.tempUnit)} />
                    </linearGradient>
                </defs>
            );
        } else if (view === "uv_index" || view === "us_aqi") {
            return (
                <defs>
                    <linearGradient
                        id={gradientId}
                        gradientUnits="userSpaceOnUse"
                        x1="0"
                        y1={y.range()[1]}
                        x2="0"
                        y2={y.range()[0]}
                    >
                        {view === "uv_index" ? <UVGradient /> : <AQGradient />}
                    </linearGradient>
                </defs>
            );
        }

        return null;
    }, [dataPoints, gradientId, settings, view, y]);

    return (
        <g>
            {visual}
            {gradient}
            {dataPoints[0].y.length === 2 && <Line yIndex={1} fill="none" stroke="#fff" strokeWidth={2} />}
        </g>
    );
}
