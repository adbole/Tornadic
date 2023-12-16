import React from 'react';
import styled from '@emotion/styled';
import * as d3 from 'd3';

import { useWeather } from 'Contexts/WeatherContext';

import { throwError } from 'ts/Helpers';
import { vars } from 'ts/StyleMixins';

import type { ChartViews, DataPoint } from '..';


const ChartContext = React.createContext<{
    chart: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: d3.ScaleTime<number, number, never> | d3.ScaleBand<Date>,
    y: d3.ScaleLinear<number, number, never>,
    dataPoints: DataPoint[],
    view: ChartViews
} | null>(null)

export const margin = {
    top: 120,
    right: 10,
    bottom: 40,
    left: 40,
}

export const useChart = () => 
    React.useContext(ChartContext) ??
    throwError('useChart must be used within a ChartContextProvider')

const ResponsiveSVG = styled.svg({
    position: "relative",
    border: "1px solid #ffffff19",
    borderRadius: vars.borderRadius,
    overflow: "hidden",
    width: "100%",
    height: "100%",
    display: "block"
})
    
function getMinMax([min, max]: [number, number], property: ChartViews): [number, number] {
    switch (property) {
        case "surface_pressure":
            return [min - 0.3, max + 0.3];
        case "precipitation":
            return [0, Math.max(0.5, max + 0.25)];
        case "relativehumidity_2m":
            return [0, 100];
        case "uv_index":
            return [0, Math.max(11, max)];
        default:
            return [Math.floor(min / 10) * 10, Math.ceil(max / 10) * 10 + 10];
    }
}

function getY2Property(view: ChartViews) {
    switch (view) {
        case "temperature_2m":
            return "apparent_temperature"
        case "windspeed_10m":
            return "windgusts_10m"
        default: 
            return null
    }
}

export default function ChartContextProvider({ view, day, children }: { 
    view: ChartViews,
    day: number,
    children: React.ReactNode 
}) {
    const [chart, setChart] = React.useState<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null)
    const { weather } = useWeather()

    const [width, setWidth] = React.useState<number | null>(null)
    const [height, setHeight] = React.useState<number | null>(null)

    const dataPoints = React.useMemo(() => {
        const from = day * 24;
        const to = from + 24

        const x = weather.getAllForecast("time").slice(from, to).map(time => new Date(time))
        const y1 = weather.getAllForecast(view).slice(from, to)

        const y2Prop = getY2Property(view)
        const y2 = y2Prop ? weather.getAllForecast(y2Prop).slice(from, to) : null

        return x.map((x, i) => ({
            x,
            y1: y1[i],
            y2: y2?.[i] ?? null
        }))
    }, [weather, view, day])

    const x = React.useMemo<d3.ScaleTime<number, number> | d3.ScaleBand<Date> | null>(() => {
        if(!chart || !width) return null;

        const range = [margin.left, width - margin.right]

        if(view === "precipitation") {
            return (
                d3.scaleBand<Date>()
                    .domain(dataPoints.map(point => point.x))
                    .range(range)
                    .padding(0.1)
            )
        }
        
        const xDomain = d3.extent(dataPoints, d => d.x) as [Date, Date]

        return (
            d3.scaleTime()
                .domain(xDomain)
                .range(range)
        )
    }, [width, chart, dataPoints, view])

    const y = React.useMemo<d3.ScaleLinear<number, number> | null>(() => {
        if(!chart || !height) return null;

        const yValues = dataPoints.flatMap(point => point.y2 ? [point.y1, point.y2] : point.y1)
        const yDomain = getMinMax(d3.extent(yValues) as [number, number], view)

        return (
            d3.scaleLinear()
                .domain(yDomain)
                .range([height - margin.bottom, margin.top])
        )
    }, [height, chart, dataPoints, view])

    React.useEffect(() => {
        if(!chart) return;

        const onResize = () => {
            const boundingRect = chart.node()!.getBoundingClientRect()

            const width = boundingRect.width
            const height = boundingRect.height

            setWidth(width)
            setHeight(height)

            chart.attr('viewBox', `0 0 ${width ?? 1200} ${height ?? 600}`)
        }

        onResize()

        window.addEventListener('resize', onResize)

        return () => window.removeEventListener('resize', onResize)
    }, [chart, dataPoints])

    const value = React.useMemo(() => {
        if(!chart || x === null || y === null) return null;

        return {
            chart,
            x,
            y,
            dataPoints,
            view
        }
    }, [chart, x, y, dataPoints, view])

    return (
        <ChartContext.Provider value={value}>
            <ResponsiveSVG 
                preserveAspectRatio='xMidYMid meet' 
                ref={(element) => {
                    if(!chart && element)
                        setChart(d3.select(element))
                }}
            >
                {value && children}
            </ResponsiveSVG>
            
        </ChartContext.Provider>
    )
}