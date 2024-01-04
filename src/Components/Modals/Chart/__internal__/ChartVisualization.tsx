import React from "react";

import { useReadLocalStorage } from "Hooks";

import type { AQLevel, UVLevel } from "ts/Helpers";
import { getAQMaxValue, getUVMaxValue, Normalize, toHSL } from "ts/Helpers";

import { useChart } from "./ChartContext";
import { Area, Bar, Line } from "./Visualizers";


function UVGradient() {
    const { y } = useChart()
    const getOffset = (key: UVLevel) => Normalize.Decimal(y(getUVMaxValue(key)), y.range()[1], y.range()[0]);

    return (
        <>
            <stop offset={getOffset("Extreme")} stopColor="#FF00D6" key="Extreme" />
            <stop offset={getOffset("Very High")} stopColor="#FF2204" key="Very High" />
            <stop offset={getOffset("High")} stopColor="#FF9431" key="High" />
            <stop offset={getOffset("Moderate")} stopColor="#FFF501" key="Moderate" />
            <stop offset={getOffset("Low")} stopColor="#00FF66" key="Low" />
        </>
    )
}

function AQGradient() {
    const { y } = useChart()
    const getOffset = (key: AQLevel) => Normalize.Decimal(y(getAQMaxValue(key)), y.range()[1], y.range()[0]);

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

export default function ChartVisualization() {
    const { view, dataPoints, y } = useChart()
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
            return (
                <defs>
                    <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1={y.range()[1]} x2="0" y2={y.range()[0]}>
                        {view === "uv_index" ? <UVGradient /> : <AQGradient />}
                    </linearGradient>
                </defs>
            )
        }

        return null;
    }, [dataPoints, gradientId, settings, view, y])

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