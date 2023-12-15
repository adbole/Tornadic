import React from "react";
import * as d3 from "d3"

import type { DataPoint } from "../.."
import { useChart } from "../ChartContext";

import type { YProp } from "./index.types";


export default function Line({
    yProp,
    ...SVGProps
}: {
    yProp: YProp
} & React.SVGProps<SVGPathElement>) {
    const path = React.useRef<SVGPathElement | null>(null);
    const mounted = React.useRef(false)

    const { x, y, dataPoints } = useChart()

    const line = React.useMemo(() => {
        const xScale = x as d3.ScaleTime<number, number, never>

        return d3.line<DataPoint>()
            .curve(d3.curveMonotoneX)
            .x((d: DataPoint) => xScale(d.x))
            .y((d: DataPoint) => y(d[yProp] as number))
            .defined((d: DataPoint) => Boolean(d[yProp]))
        
    }, [x, y, yProp] )

    React.useEffect(() => {
        if(!mounted.current) {
            mounted.current = true;
            return;
        };
        if(!path.current) return;

        d3.select(path.current)
            .attr("stroke-dashoffset", null)
            .attr("stroke-dasharray", null)
            .transition()
            .duration(500)
            .ease(d3.easeSinInOut)
            .attr("d", line(dataPoints))
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataPoints, line])

    const onMount = React.useCallback((node: SVGPathElement | null) => {
        if(!node) return;

        path.current = node
        
        d3.select(node)
            .attr("d", line(dataPoints))
            .attr("stroke-dashoffset", node.getTotalLength())
            .attr("stroke-dasharray", node.getTotalLength())
            .transition()
            .ease(d3.easeSinInOut)
            .duration(1000)
            .attr("stroke-dashoffset", 0)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return <path ref={onMount} {...SVGProps} />
}