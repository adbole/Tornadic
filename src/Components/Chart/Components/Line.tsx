import React from "react";
import * as d3 from "d3";

import type { DataPoint } from "..";
import { useChart } from "..";



export default function Line({
    yIndex = 0,
    ...SVGProps
}: {
    yIndex?: number;
} & React.SVGProps<SVGPathElement>) {
    const path = React.useRef<SVGPathElement | null>(null);
    const mounted = React.useRef(false);

    const { x, y, dataPoints } = useChart();

    const line = React.useMemo(() => {
        const xScale = x as d3.ScaleTime<number, number, never>;

        return d3
            .line<DataPoint>()
            .curve(d3.curveMonotoneX)
            .x((d: DataPoint) => xScale(d.x))
            .y((d: DataPoint) => y(d.y[yIndex] as number))
            .defined((d: DataPoint) => d.y[yIndex] != null && !isNaN(d.y[yIndex] as number));
    }, [x, y, yIndex]);

    React.useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        if (!path.current) return;

        d3.select(path.current)
            .attr("stroke-dashoffset", null)
            .attr("stroke-dasharray", null)
            .transition()
            .duration(500)
            .ease(d3.easeSinInOut)
            .attr("d", line(dataPoints));
    }, [dataPoints, line]);

    const onMount = React.useCallback((node: SVGPathElement | null) => {
        if (!node) return;

        path.current = node;

        // ?. and ?? used to satisfy jsdom lack of SVG support.
        // should be visually tested to ensure it works as expected.
        d3.select(node)
            .attr("d", line(dataPoints))
            .attr("stroke-dashoffset", node?.getTotalLength?.() ?? 0)
            .attr("stroke-dasharray", node?.getTotalLength?.() ?? 0)
            .transition()
            .ease(d3.easeSinInOut)
            .duration(1000)
            .attr("stroke-dashoffset", 0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <path fill="none" ref={onMount} {...SVGProps} />;
}
