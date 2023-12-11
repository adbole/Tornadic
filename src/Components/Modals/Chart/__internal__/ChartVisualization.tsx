
import React from "react";
import * as d3 from "d3";

import { useReadLocalStorage } from "Hooks";

import { get_aq, get_uv, toHSL } from "ts/Helpers";

import type { ChartViews, DataPoint } from "..";

import { margin, useChart } from "./ChartContext";

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

    const { chart, x, y, view, dataPoints } = useChart()
    const settings = useReadLocalStorage("userSettings")

    const gradientId = React.useId()

    const visual = React.useRef<d3.Selection<SVGGElement, unknown, null, undefined> | undefined>()

    React.useEffect(() => {
        if(!chart) return () => {};

        console.log("change")

        visual.current = 
            chart.append('g')
                
        switch(view) {
            case "precipitation": {
                const xScale = x as d3.ScaleBand<Date>

                visual.current
                    .selectAll()
                    .data(dataPoints)
                    .join("rect")
                        .attr("fill", "#0078ef")
                        .attr("x", (d: DataPoint) => xScale(d.x) as number)
                        .attr("y", (d: DataPoint) => y(d.y1))
                        .attr("width", xScale.bandwidth())
                        .attr("height", (d: DataPoint) => y(0) - y(d.y1))
                
                break;
            }
            case "us_aqi":
            case "uv_index":
            case "temperature_2m": {               
                const xScale = x as d3.ScaleTime<number, number, never>

                const area = d3.area<DataPoint>()
                    .curve(d3.curveMonotoneX)
                    .x((d: DataPoint) => xScale(d.x))
                    .y0(y.range()[0])
                    .y1((d: DataPoint) => y(d.y1))
                    .defined((d: DataPoint) => Boolean(d.y1))

                visual.current
                    .append("path")
                        .attr("fill", `url(#${gradientId})`)
                        .attr("fill-opacity", "0.75")
                        .attr("d", area(dataPoints))

                break;
            }
            default: {
                const xScale = x as d3.ScaleTime<number, number, never>

                const line = d3.line<DataPoint>()
                    .curve(d3.curveMonotoneX)
                    .x((d: DataPoint) => xScale(d.x))
                    .y((d: DataPoint) => y(d.y1))
                    .defined((d: DataPoint) => Boolean(d.y1))

                    
                visual.current!
                    .append("path")
                    .attr("fill", "none")
                    .attr("stroke", "#0078ef")
                    .attr("stroke-width", 2)
                    .attr("d", line(dataPoints))
            }
        }

        if(dataPoints[0].y2) {
            const xScale = x as d3.ScaleTime<number, number, never>

            const line = d3.line<DataPoint>()
                .curve(d3.curveMonotoneX)
                .x((d: DataPoint) => xScale(d.x))
                .y((d: DataPoint) => y(d.y2!))
                .defined((d: DataPoint) => Boolean(d.y2))

            visual.current!
                .append("path")
                .attr("fill", "none")
                .attr("stroke", "#fff")
                .attr("stroke-width", 2)
                .attr("d", line(dataPoints))
        }

        return () => visual.current?.remove()
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