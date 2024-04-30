import React from "react";
import * as d3 from "d3";

import type { DataPoint } from "..";
import { useChart } from "..";


export default function Bar({
    yIndex = 0,
    ...SVGProps
}: {
    yIndex?: number;
} & React.SVGProps<SVGGElement>) {
    const group = React.useRef<SVGGElement | null>(null);
    const { x, y, dataPoints } = useChart();

    React.useEffect(() => {
        if (!group.current) return;

        const xScale = x as d3.ScaleBand<Date>;

        d3.select(group.current)
            .selectAll("rect")
            .data(dataPoints)
            .join(
                enter =>
                    enter
                        .append("rect")
                        .attr("x", (d: DataPoint) => x(d.x) as number)
                        .attr("y", y(0))
                        .attr("width", xScale.bandwidth())
                        .transition()
                        .attr("height", (d: DataPoint) => y(0) - y(d.y[yIndex] as number))
                        .attr("y", (d: DataPoint) => y(d.y[yIndex] as number))
                        //Filter helps to remove wasted time on 0 values making animation occur faster
                        .filter((d: DataPoint) => d.y[yIndex] !== 0)
                        .delay((_, i) => i * 50) as any,
                update =>
                    update
                        .transition()
                        .duration(500)
                        .attr("y", (d: DataPoint) => y(d.y[yIndex] as number))
                        .attr("height", (d: DataPoint) => y(0) - y(d.y[yIndex] as number)),
                remove => remove.remove()
            );
    }, [dataPoints, x, y, yIndex]);

    return <g ref={group} {...SVGProps} />;
}
