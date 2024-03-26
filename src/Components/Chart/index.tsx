import React from "react";
import styled from "@emotion/styled";
import * as d3 from "d3";

import { throwError } from "ts/Helpers";
import { vars } from "ts/StyleMixins";


export type ChartType = "band" | "linear"

export type DataPoint = {
    x: Date;
    y: number[]
};

const ChartContext = React.createContext<{
    chart: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    x: d3.ScaleTime<number, number, never> | d3.ScaleBand<Date>;
    y: d3.ScaleLinear<number, number, never>;
    dataPoints: DataPoint[];
    type: ChartType
} | null>(null);

export const margin = {
    top: 120,
    right: 10,
    bottom: 40,
    left: 40,
};

export const useChart = () =>
    React.useContext(ChartContext) ??
    throwError("useChart must be used within a ChartContextProvider");

const ResponsiveSVG = styled.svg({
    position: "relative",
    border: "1px solid #ffffff19",
    borderRadius: vars.borderRadius,
    overflow: "hidden",
    width: "100%",
    height: "100%",
    display: "block",
});

const defaultYBounds = ([min, max]: [number, number]): [number, number] => {
    const range = max - min;
    const rangePadding = range * 0.1;

    return [min - rangePadding, max + rangePadding];
}

export default function ChartContextProvider({
    dataPoints,
    type,
    children,
    yBounds = defaultYBounds,
}: {
    dataPoints: DataPoint[]
    type: ChartType
    children: React.ReactNode;
    yBounds?: ([min, max]: [number, number]) => [number, number]
}) {
    const [chart, setChart] = React.useState<d3.Selection<
        SVGSVGElement,
        unknown,
        null,
        undefined
    > | null>(null);

    const [width, setWidth] = React.useState<number | null>(null);
    const [height, setHeight] = React.useState<number | null>(null);

    const x = React.useMemo<d3.ScaleTime<number, number> | d3.ScaleBand<Date> | null>(() => {
        if (width === null) return null;

        const range = [margin.left, width - margin.right];

        if (type === "band") {
            return d3
                .scaleBand<Date>()
                .domain(dataPoints.map(point => point.x))
                .range(range)
                .padding(0.1);
        }

        const xDomain = d3.extent(dataPoints, d => d.x) as [Date, Date];

        return d3.scaleTime().domain(xDomain).range(range);
    }, [width, dataPoints, type]);

    const y = React.useMemo<d3.ScaleLinear<number, number> | null>(() => {
        if (height === null) return null;

        const yValues = dataPoints.flatMap(point => point.y);
        const yDomain = yBounds(d3.extent(yValues) as [number, number]);

        return d3
            .scaleLinear()
            .domain(yDomain)
            .range([height - margin.bottom, margin.top]);
    }, [height, dataPoints, yBounds]);

    React.useEffect(() => {
        if (!chart) return;

        const onResize = () => {
            const boundingRect = chart.node()!.getBoundingClientRect();

            const width = boundingRect.width;
            const height = boundingRect.height;

            setWidth(width);
            setHeight(height);

            chart.attr("viewBox", `0 0 ${width ?? 1200} ${height ?? 600}`);
        };

        onResize();

        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
    }, [chart]);

    const value = React.useMemo(() => {
        if (!chart || x === null || y === null) return null;

        return {
            chart,
            x,
            y,
            dataPoints,
            type,
        };
    }, [chart, x, y, dataPoints, type]);

    return (
        <ChartContext.Provider value={value}>
            <ResponsiveSVG
                preserveAspectRatio="xMidYMid meet"
                ref={element => {
                    if (!chart && element) setChart(d3.select(element));
                }}
            >
                {value && children}
            </ResponsiveSVG>
        </ChartContext.Provider>
    );
}
