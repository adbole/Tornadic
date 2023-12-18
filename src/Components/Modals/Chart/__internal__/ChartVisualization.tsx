import React from "react";

import { useReadLocalStorage } from "Hooks";

import { get_aq, get_uv, toHSL } from "ts/Helpers";

import { useChart } from "./ChartContext";
import { Area, Bar, Line } from "./Visualizers";

/* eslint-disable no-fallthrough */
//Fallthrough here is intentional to allow for the gradient be built up.
function* getUVGradient(value: number) {
    const uv = get_uv(value);

    switch (uv) {
        case "Extreme":
            yield <stop offset="0%" stopColor="#FF00D6" key="Extreme" />;
        case "Very High":
            yield <stop offset="25%" stopColor="#FF2204" key="Very High" />;
        case "High":
            yield <stop offset="50%" stopColor="#FF9431" key="High" />;
        case "Moderate":
            yield <stop offset="75%" stopColor="#FFF501" key="Moderate" />;
        case "Low":
            yield <stop offset="100%" stopColor="#00FF66" key="Low" />;
    }
}

function* getAQGradient(value: number) {
    const aq = get_aq(value);

    switch (aq) {
        case "Hazardous":
            yield <stop offset="0%" stopColor="#6D0000" key="Hazardous" />;
        case "Very Unhealthy":
            yield <stop offset="20%" stopColor="#8400FF" key="Very Unhealthy" />;
        case "Unhealthy":
            yield <stop offset="40%" stopColor="#FF2204" key="Unhealthy" />;
        case "Unhealthy*":
            yield <stop offset="60%" stopColor="#FF9431" key="Unhealthy*" />;
        case "Moderate":
            yield <stop offset="80%" stopColor="#FFF501" key="Moderate" />;
        case "Good":
            yield <stop offset="100%" stopColor="#00FF66" key="Good" />;
    }
}
/* eslint-enable no-fallthrough */

export default function ChartVisualization() {
    const { view, dataPoints } = useChart()
    const settings = useReadLocalStorage("userSettings")

    const gradientId = React.useId()

    const visual = React.useMemo(() => {
        switch(view) {
            case "precipitation": 
                return <Bar yProp="y1" fill="#0078ef" />
            case "us_aqi":
            case "uv_index":
            case "temperature_2m": {
                return (
                    <Area 
                        yProp="y1" 
                        fill={`url(#${gradientId})`}
                        fillOpacity={0.75}
                    />
                )
            }
            default: {
                return (
                    <Line 
                        yProp="y1" 
                        fill="none"
                        stroke="#0078ef" 
                        strokeWidth={2}
                    />
                )
            }
        }
    }, [view, gradientId])

    const gradient = React.useMemo(() => {
        if(view === "temperature_2m" && settings) {
            const max = Math.max(...dataPoints.map(point => point.y1))
            const min = Math.min(...dataPoints.map(point => point.y1))
    
            return (
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={toHSL(max, settings.tempUnit)} />
                        <stop offset="100%" stopColor={toHSL(min, settings.tempUnit)} />
                    </linearGradient>
                </defs>
            )
        }
        else if(view === "uv_index" || view === "us_aqi") {
            const max = Math.max(...dataPoints.map(point => point.y1))
    
            return (
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        {[...view === "uv_index" ? getUVGradient(max) : getAQGradient(max)]}
                    </linearGradient>
                </defs>
            )
        }

        return null;
    }, [dataPoints, gradientId, settings, view])

    return (
        <g>
            {visual}
            {gradient}
            {
                dataPoints[0].y2 && 
                <Line
                    yProp="y2" 
                    fill="none"
                    stroke="#fff" 
                    strokeWidth={2}
                />
            }
        </g>
    );
}