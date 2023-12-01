import React from 'react';
import * as d3 from 'd3';

import { throwError } from 'ts/Helpers';

import type { DataPoint } from '..';


const ChartContext = React.createContext<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null)

export const margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40,
}

export const useChart = () => 
    React.useContext(ChartContext) ??
    throwError('useChart must be used within a ChartContextProvider')

export function getScales(chart: d3.Selection<SVGSVGElement, unknown, null, undefined>, dataPoints: DataPoint[]) {
    const boundingRect = chart.node()!.getBoundingClientRect()
    const width = boundingRect.width
    const height = boundingRect.height

    const xDomain = d3.extent(dataPoints, d => d.x) as [Date, Date]
    const yDomain = d3.extent(dataPoints, d => d.y1) as [number, number]

    return {
        x: d3.scaleTime()
            .domain(xDomain)
            .range([margin.left, width - margin.right]),
        y: d3.scaleLinear()
            .domain(yDomain)
            .range([height - margin.bottom, margin.top])
    }
}

export default function ChartContextProvider({ xDomain, yDomain, children }: { 
    xDomain: [Date, Date],
    yDomain: [number, number],
    children: React.ReactNode 
}) {
    const [chart, setChart] = React.useState<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null)

    React.useEffect(() => {
        if(!chart) return;

        const onResize = () => {
            const boundingRect = chart.node()!.getBoundingClientRect()
            const width = boundingRect.width
            const height = boundingRect.height

            chart.attr('viewBox', `0 0 ${width ?? 1200} ${height ?? 600}`)
        }

        onResize()

        window.addEventListener('resize', onResize)

        return () => window.removeEventListener('resize', onResize)
    }, [chart, xDomain, yDomain])

    return (
        <ChartContext.Provider value={chart}>
            <svg 
                className='recharts-surface'
                width="100%"
                height="100%"
                preserveAspectRatio='xMidYMid meet' 
                ref={(element) => {
                    if(!chart && element)
                        setChart(d3.select(element))
                }}
            >
                {chart && children}
            </svg>
            
        </ChartContext.Provider>
    )
}