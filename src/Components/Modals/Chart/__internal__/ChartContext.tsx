import React from 'react';
import * as d3 from 'd3';

import { throwError } from 'ts/Helpers';


const ChartContext = React.createContext<{
    chart: d3.Selection<SVGSVGElement, unknown, null, undefined>
    x: d3.ScaleTime<number, number>
    y: d3.ScaleLinear<number, number>
} | null>(null)

export const margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40,
}

export const useChart = () => 
    React.useContext(ChartContext) ??
    throwError('useChart must be used within a ChartContextProvider')

export default function ChartContextProvider({ xDomain, yDomain, children }: { 
    xDomain: [Date, Date],
    yDomain: [number, number],
    children: React.ReactNode 
}) {
    const [chart, setChart] = React.useState<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null)

    const [x, setX] = React.useState<d3.ScaleTime<number, number> | null>(null)
    const [y, setY] = React.useState<d3.ScaleLinear<number, number> | null>(null)

    React.useEffect(() => {
        if(!chart) return;

        const onResize = () => {
            const boundingRect = chart.node()!.getBoundingClientRect()
            const width = boundingRect.width
            const height = boundingRect.height

            setX(
                () => d3.scaleTime()
                    .domain(xDomain)
                    .range([margin.left, width - margin.right])
            )

            setY(
                () => d3.scaleLinear()
                    .domain(yDomain)
                    .range([height - margin.bottom, margin.top])
            )

            chart.attr('viewBox', `0 0 ${width ?? 1200} ${height ?? 600}`)
        }

        onResize()

        window.addEventListener('resize', onResize)

        return () => window.removeEventListener('resize', onResize)
    }, [chart, xDomain, yDomain])

    const value = React.useMemo(() => {
        if(!chart || !x || !y) return null;

        return { chart, x, y }
    }, [chart, x, y])

    return (
        <ChartContext.Provider value={value}>
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
                {value && children}
            </svg>
            
        </ChartContext.Provider>
    )
}