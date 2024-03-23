import testIds from "@test-consts/testIDs";

import React from "react";
import * as d3 from "d3";

import { useChart } from "../Context";


export default function Axes() {
    const { x, y } = useChart();

    const xAxis = React.useRef<SVGGElement>(null);
    const yAxis = React.useRef<SVGGElement>(null);

    const xGrid = React.useRef<SVGGElement>(null);
    const yGrid = React.useRef<SVGGElement>(null);

    React.useEffect(() => {
        if (!xAxis.current || !yAxis.current || !xGrid.current || !yGrid.current) return;

        const axisBottom = d3.axisBottom(x).tickFormat(d3.timeFormat("%-I %p"));

        if ((x as d3.ScaleBand<Date>).bandwidth) {
            axisBottom.tickValues(x.domain().filter((_, i) => i % 6 === 0));
        } else {
            axisBottom.ticks(5);
        }

        // scale.range() is used to get the offsets of the axis.
        // y-axis is inverted since the origin is at the top left.

        d3.select(xGrid.current!).call(
            d3
                .axisBottom(x)
                .tickSize(-(y.range()[0] - y.range()[1]))
                .tickFormat(() => "")
                .ticks(10)
        );

        d3.select(yGrid.current!).call(
            d3
                .axisLeft(y)
                .tickSize(-(x.range()[1] - x.range()[0]))
                .tickFormat(() => "")
                .ticks(5)
        );

        d3.select(xAxis.current!).call(axisBottom);
        d3.select(yAxis.current!).call(d3.axisLeft(y).ticks(5));

        d3.selectAll([xGrid.current, yGrid.current])
            .selectAll("path, line")
            .attr("stroke", "#ffffff19");

        d3.selectAll([xGrid.current, xAxis.current]).attr(
            "transform",
            `translate(0, ${y.range()[0]})`
        );

        d3.selectAll([yGrid.current, yAxis.current]).attr(
            "transform",
            `translate(${x.range()[0]}, 0)`
        );
    }, [x, y]);

    return (
        <>
            <g ref={xAxis} style={{ font: "16px system-ui" }} data-testid={testIds.Chart.Axes_X} />
            <g ref={yAxis} style={{ font: "16px system-ui" }} data-testid={testIds.Chart.Axes_Y} />

            <g ref={xGrid} data-testid={testIds.Chart.Axes_X_Grid} />
            <g ref={yGrid} data-testid={testIds.Chart.Axes_Y_Grid} />
        </>
    );
}
