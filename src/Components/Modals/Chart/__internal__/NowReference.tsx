import React from "react";
import type * as d3 from "d3";

import { useWeather } from "Contexts/WeatherContext";

import { useChart } from "./ChartContext";


export default function NowReference({ isShown }: { isShown: boolean }) {
    const { x, y } = useChart();
    const { weather } = useWeather();

    const nowX = React.useMemo(
        () =>
            (x(new Date(weather.getForecast("time"))) as number) +
            ((x as d3.ScaleBand<Date>)?.bandwidth?.() ?? 0) / 2,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [x, weather]
    );

    if (!isShown) return null;

    return (
        <g>
            <rect
                width={nowX - x.range()[0]}
                height={y.range()[0] - y.range()[1]}
                x={x.range()[0]}
                y={y.range()[1]}
                fill="#000"
                fillOpacity={0.25}
            />
            <line
                x1={nowX}
                x2={nowX}
                y1={y.range()[1]}
                y2={y.range()[0]}
                stroke="#fff"
                strokeWidth={1}
            />
        </g>
    );
}
