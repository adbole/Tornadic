/* eslint-disable no-fallthrough */

import React from "react";
import * as d3 from "d3";

import { useReadLocalStorage } from "Hooks";

import { get_aq, get_uv, toHSL } from "ts/Helpers";

import type { ChartViews, DataPoint } from "..";

import { margin, useChart } from "./ChartContext";


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

export default function ChartVisualization({ view, dataPoints }: { view: ChartViews; dataPoints: DataPoint[] }) {

    const { chart, x, y } = useChart()
    const settings = useReadLocalStorage("userSettings")

    const gradientId = React.useId()

    const path = React.useRef<d3.Selection<SVGPathElement, unknown, null, undefined> | undefined>()

    React.useEffect(() => {
        if(!chart) return () => {};

        console.log("change")

        path.current = 
            chart.append('path')
                
        switch(view) {
            case "us_aqi":
            case "uv_index":
            case "temperature_2m": {
                const area = d3.area<DataPoint>()
                    .x((d: DataPoint) => x(d.x))
                    .y0(y.range()[0])
                    .y1((d: DataPoint) => y(d.y1))
                    .defined((d: DataPoint) => d.y1 !== null)

                path.current
                    .attr("fill", `url(#${gradientId})`)
                    .attr("d", area(dataPoints))
            }
        }

        return () => path.current?.remove()
    }, [chart, dataPoints, gradientId, view, x, y])

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
}