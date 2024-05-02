import React from "react";
import styled from "@emotion/styled";
import * as d3 from "d3";

import { throwError } from "ts/Helpers";

import type { DataPoint } from "..";
import { useChart } from "..";


const TooltipContext = React.createContext<number>(-1);

export const useTooltip = () =>
    React.useContext(TooltipContext) ??
    throwError("useTootlip must be used within a Chart Tooltip");

const Container = styled.div({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    height: "100px",
    padding: "10px",
    whiteSpace: "nowrap",
});

function getTime(scale: d3.ScaleTime<number, number, never> | d3.ScaleBand<Date>, x: number) {
    if ((scale as d3.ScaleTime<number, number>).invert) {
        return (scale as d3.ScaleTime<number, number>).invert(x);
    }

    const bandScale = scale as d3.ScaleBand<Date>;

    const [min, max] = bandScale.range();
    const range = d3.range(min, max, bandScale.step());

    const index = Math.min(Math.max(d3.bisect(range, x) - 1, 0), scale.domain().length - 1);
    return scale.domain()[index];
}

export default function Tooltip({ children }: { children: React.ReactNode }) {
    const { chart, x, y, dataPoints } = useChart();

    const [hoverIndex, setHoverIndex] = React.useState(-1);

    const div = React.useRef<HTMLDivElement | null>(null);
    const referenceLine = React.useRef<SVGLineElement | null>(null);

    React.useEffect(() => {
        if (!div.current) {
            chart
                .on("touchstart mouseenter", null)
                .on("touchmove mousemove", null)
                .on("touchend mouseleave", null);

            return;
        }

        function onEnter() {
            div.current!.style.alignItems = "center";
        }

        function onMove(event: MouseEvent | TouchEvent) {
            const [mouseXPos] = d3.pointer(
                event instanceof TouchEvent ? event.touches[0] : event,
                event.currentTarget
            );

            const time = getTime(x, mouseXPos);
            const bisectDate = d3.bisector((d: DataPoint) => d.x).center;
            const index = bisectDate(dataPoints, time);

            //Position the div
            const divWidth = div.current!.getBoundingClientRect().width;
            const parentWidth = div.current!.parentElement!.getBoundingClientRect().width;

            let newLeft = mouseXPos - divWidth / 2;

            if (newLeft + divWidth > parentWidth) {
                newLeft = parentWidth - divWidth;
            } else if (newLeft < 0) {
                newLeft = 0;
            }

            div.current!.style.left = `${newLeft}px`;

            //Position the reference line and dots
            const dataPoint = dataPoints[index];
            const selection = d3
                .select(referenceLine.current!)
                .attr("y1", y.range()[0])
                .attr("y2", y.range()[1]);

            const xPos = x(dataPoint.x) as number;

            if ((x as d3.ScaleBand<Date>).bandwidth) {
                const xBandWidth = (x as d3.ScaleBand<Date>).bandwidth() / 2;

                selection.attr("x1", xPos + xBandWidth).attr("x2", xPos + xBandWidth);
            } else {
                selection.attr("x1", xPos).attr("x2", xPos);
            }

            setHoverIndex(index);
        }

        function onLeave() {
            div.current!.style.alignItems = "flex-start";
            div.current!.style.left = "0px";

            setHoverIndex(-1);
        }

        chart
            .on("touchstart mouseenter", onEnter)
            .on("touchmove mousemove", onMove)
            .on("touchend mouseleave", onLeave);
    }, [chart, x, y, dataPoints]);

    return (
        <g>
            <line x1={0} x2="100%" y1={100} y2={100} stroke="#ffffff19" strokeWidth={1} />
            <foreignObject width="100%" height="100px">
                <Container ref={div}>
                    <TooltipContext.Provider value={hoverIndex}>{children}</TooltipContext.Provider>
                </Container>
            </foreignObject>
            <line
                ref={referenceLine}
                stroke="#fff"
                strokeWidth={2}
                style={{ display: hoverIndex === -1 ? "none" : "block" }}
            />
        </g>
    );
}
