import React from "react";
import * as d3 from "d3"

import type { DataPoint } from "../.."
import { useChart } from "../ChartContext";

import type { YProp } from "./index.types";


export default function Bar({
    yProp,
    ...SVGProps
} : {
    yProp: YProp
} & React.SVGProps<SVGGElement>) {
    const group = React.useRef<SVGGElement | null>(null);
    const { x, y, dataPoints } = useChart()

    React.useEffect(() => {
        if(!group.current) return;

        const xScale = x as d3.ScaleBand<Date>

        d3.select(group.current)
            .selectAll("rect")
            .data(dataPoints)
            .join(
                enter => enter.append("rect")
                    //Filter helps to remove wasted time on 0 values making animation occur faster
                    .attr("x", (d: DataPoint) => x(d.x) as number)
                    .attr("y", y(0))
                    .attr("width", xScale.bandwidth())
                    .transition()
                    .attr("height", (d: DataPoint) => y(0) - y(d[yProp] as number))
                    .attr("y", (d: DataPoint) => y(d[yProp] as number))
                    .delay((_, i) => i * 50) as any
                ,
                update => update
                    .transition()
                    .duration(500)
                    .attr("y", (d: DataPoint) => y(d[yProp] as number))
                    .attr("height", (d: DataPoint) => y(0) - y(d[yProp] as number))
                ,
                remove => remove.remove()
            )
    })

    return <g ref={group} {...SVGProps}/>
}