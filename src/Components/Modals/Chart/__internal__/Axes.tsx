import React from 'react';
import * as d3 from 'd3';

import type { DataPoint } from '..';

import { getScales, margin, useChart } from './ChartContext';


export default function Axes({ dataPoints }: { dataPoints: DataPoint[] }) {
    const chart = useChart();

    const xAxis = React.useRef<d3.Selection<SVGGElement, unknown, null, undefined> | undefined>()
    const yAxis = React.useRef<d3.Selection<SVGGElement, unknown, null, undefined> | undefined>()
    
    React.useEffect(() => {
        const fontSize = "16px system-ui"

        xAxis.current = chart.append('g').style("font", fontSize)
        yAxis.current = chart.append('g').style("font", fontSize)

        return () => {
            xAxis.current?.remove()
            yAxis.current?.remove()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if(!xAxis.current && !yAxis.current) return;

        const draw = () => {
            const boundingRect = chart.node()!.getBoundingClientRect()
            const height = boundingRect.height

            const { x, y } = getScales(chart, dataPoints)

            xAxis.current!
                .attr('transform', `translate(0, ${height - margin.bottom})`)    
                .call(d3.axisBottom(x).ticks(5))
            yAxis.current!
                .attr('transform', `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(y).ticks(5))
        }

        draw()

        window.addEventListener('resize', draw)

        return () => window.removeEventListener('resize', draw)
    }, [dataPoints, chart])

    return null;
}