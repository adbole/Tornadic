import React from "react";
import * as d3 from "d3";

import type { DataPoint } from "../..";
import { useChart } from "../ChartContext";

import type { YProp } from "./index.types";


export default function Area({
    yProp,
    ...SVGProps
}: {
    yProp: YProp;
} & React.SVGProps<SVGPathElement>) {
    const path = React.useRef<SVGPathElement | null>(null);
    const { x, y, dataPoints } = useChart();

    const clipId = React.useId();

    const area = React.useMemo(() => {
        const xScale = x as d3.ScaleTime<number, number, never>;

        return d3
            .area<DataPoint>()
            .curve(d3.curveMonotoneX)
            .x((d: DataPoint) => xScale(d.x))
            .y0(y.range()[0])
            .y1((d: DataPoint) => y(d[yProp] as number))
            .defined((d: DataPoint) => d[yProp] != null && !isNaN(d[yProp] as number));
    }, [x, y, yProp]);

    React.useEffect(() => {
        if (!path.current) return;

        d3.select(path.current)
            .transition()
            .duration(500)
            .ease(d3.easeSinInOut)
            .attr("d", area(dataPoints));
    }, [dataPoints, area]);

    const onRender = React.useCallback((node: SVGRectElement | null) => {
        if (!node) return;

        d3.select(node)
            .transition()
            .duration(1000)
            .ease(d3.easeSinInOut)
            .attr("width", x.range()[1] - x.range()[0])
            .on("end", () => d3.select(node).attr("width", "100%"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <clipPath id={clipId}>
                <rect ref={onRender} x={x.range()[0]} width={0} height={y.range()[0]} />
            </clipPath>
            <path ref={path} {...SVGProps} clipPath={`url(#${clipId})`} />
        </>
    );
}
