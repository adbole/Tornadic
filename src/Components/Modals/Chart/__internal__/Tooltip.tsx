import React from "react";
import styled from "@emotion/styled";
import * as d3 from "d3";

import { useWeather } from "Contexts/WeatherContext";

import { get_aq, get_uv } from "ts/Helpers";
import getTimeFormatted from "ts/TimeConversion";
import type { CombinedHourly } from "ts/Weather";
import type Weather from "ts/Weather";

import type { ChartViews, DataPoint } from "..";

import { useChart } from "./ChartContext";


const Container = styled.div({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    height: "100px",
    padding: "10px"
})

function getTime(scale: d3.ScaleTime<number, number, never> | d3.ScaleBand<Date>, x: number) {
    if((scale as d3.ScaleTime<number, number>).invert) {
        return (scale as d3.ScaleTime<number, number>).invert(x)
    } 

    const bandScale = scale as d3.ScaleBand<Date>

    const index = Math.max(Math.round(x / bandScale.step()) - 1, 0)
    return scale.domain()[index]
}

function supportingInformation(view: ChartViews): [keyof Omit<CombinedHourly, "time">, string] | undefined {
    switch(view) {
        case "precipitation":
            return ["precipitation_probability", "Chance of Precip"]
        case "temperature_2m":
            return ["apparent_temperature", "Feels"]
        case "relativehumidity_2m":
            return ["dewpoint_2m", "Dewpoint"]
        case "dewpoint_2m":
            return ["relativehumidity_2m", "Humidity"]
        case "windspeed_10m":
            return ["windgusts_10m", "Gust"]
        case "us_aqi": 
            return ["us_aqi", ""]
        case "uv_index":
            return ["uv_index", ""]
        default:
            return undefined
    }
}

function trunc(value: number) {
    return Math.floor(value * 100) / 100
}

function getLowHigh(weather: Weather, prop: keyof Omit<CombinedHourly, "time">, day: number) {
    const range = d3.extent(weather.getAllForecast(prop).slice(day * 24, (day + 1) * 24))
    if(range[0] === undefined) return

    const unit = weather.getForecastUnit(prop)
    return `L: ${trunc(range[0])}${unit} H: ${trunc(range[1])}${unit}`
}

export default function Tooltip({ day }: { day: number }) {
    const { chart, x, y, view, dataPoints } = useChart()
    const { weather } = useWeather()

    const [hoverIndex, setHoverIndex] = React.useState(-1);

    const div = React.useRef<HTMLDivElement | null>(null)
    const referenceLine = React.useRef<SVGLineElement | null>(null)

    const time = React.useMemo(() => {
        if(hoverIndex !== -1) {
            const dataPoint = dataPoints[hoverIndex]
            return getTimeFormatted(dataPoint.x, "hourMinute")
        }

        if(day === 0) {
            return "Now"
        }

        return "Min and Max"
    }, [day, hoverIndex, dataPoints])

    const mainInformation = React.useMemo(() => {
        let string: string | undefined = undefined;

        if(hoverIndex !== -1) {
            const dataPoint = dataPoints[hoverIndex]
            string = trunc(dataPoint.y1).toString()
        }
        else if(day === 0) {
            string = trunc(weather.getForecast(view)).toString()
        }
        else return getLowHigh(weather, view, day)

        return string && string + weather.getForecastUnit(view)
    }, [day, view, weather, hoverIndex, dataPoints])

    const secondaryInformation = React.useMemo(() => {
        const supporting = supportingInformation(view);
        if(!supporting) return null;

        const [property, label] = supporting;

        if(property === "uv_index" || property === "us_aqi") {
            const level = property === "uv_index" ? get_uv : get_aq

            if(hoverIndex !== -1) {
                const weatherIndex = (day * 24) + hoverIndex
                return level(weather.getForecast(property, weatherIndex))
            }
            else if(day === 0) {
                return level(weather.getForecast(property))
            }
            
            return null;
        }

        let string = `${label}: `;

        if(hoverIndex !== -1) {
            const weatherIndex = (day * 24) + hoverIndex
            string += trunc(weather.getForecast(property, weatherIndex)).toString()
        }
        else if(day === 0) {
            string += trunc(weather.getForecast(property)).toString()
        }
        else return getLowHigh(weather, property, day)

        return string + weather.getForecastUnit(property)
    }, [day, view, weather, hoverIndex])

    React.useEffect(() => {
        if(!div.current) {
            chart
                .on("touchstart mouseenter", null)
                .on("touchmove mousemove", null)
                .on("touchend mouseleave", null)

            return;
        };

        function onMouseEnter() {
            div.current!.style.alignItems = "center"
            referenceLine.current!.style.display = "block"
        }

        function onMouseMove(event: MouseEvent | TouchEvent) {
            const mousePosition = d3.pointer(event instanceof TouchEvent ? event.touches[0] : event)
            const time = getTime(x, mousePosition[0])
            const bisectDate = d3.bisector((d: DataPoint) => d.x).center
            const index = bisectDate(dataPoints, time);

            //Position the div
            const divWidth = div.current!.getBoundingClientRect().width
            const parentWidth = div.current!.parentElement!.getBoundingClientRect().width
            
            let newLeft = mousePosition[0] - (divWidth / 2);

            if(newLeft + divWidth > parentWidth) { 
                newLeft = parentWidth - divWidth
            }
            else if(newLeft < 0) {
                newLeft = 0
            }

            div.current!.style.left = `${newLeft}px`

            //Position the reference line and dots
            const dataPoint = dataPoints[index]
            const selection = d3.select(referenceLine.current!)
                .attr("y1", y.range()[0])
                .attr("y2", y.range()[1])
                .attr("x1", x(dataPoint.x) as number)
                .attr("x2", x(dataPoint.x) as number)

            const xPos = x(dataPoint.x) as number

            if((x as d3.ScaleBand<Date>).bandwidth) {
                const xBandWidth = (x as d3.ScaleBand<Date>).bandwidth() / 2

                selection
                    .attr("x1", xPos + xBandWidth)
                    .attr("x2", xPos + xBandWidth)
            }
            else {
                selection
                    .attr("x1", xPos)
                    .attr("x2", xPos)
            }

            setHoverIndex(index);
        }

        function onMouseLeave() {
            div.current!.style.alignItems = "flex-start"
            div.current!.style.left = "0px"
            referenceLine.current!.style.display = "none"

            setHoverIndex(-1);
        }

        chart
            .on("touchstart mouseenter", onMouseEnter)
            .on("touchmove mousemove", onMouseMove)
            .on("touchend mouseleave", onMouseLeave)

    }, [chart, x, y, dataPoints])

    if(dataPoints.every(d => d.y1 == null)) return (
        <g>
            <foreignObject width="100%" height="100px">
                <Container style={{ left: "50%", transform: "translateX(-50%)" }}>
                    <h1>No Data</h1>
                </Container>
            </foreignObject>
        </g>
    );

    return (
        <g>
            <foreignObject width="100%" height="100px" >
                <Container ref={div}>
                    <span>{time}</span>
                    <h1>{mainInformation}</h1>
                    <h3>{secondaryInformation}</h3>
                </Container>
            </foreignObject>
            <line ref={referenceLine} stroke="#fff" strokeWidth={2}/>
        </g>
    )
}