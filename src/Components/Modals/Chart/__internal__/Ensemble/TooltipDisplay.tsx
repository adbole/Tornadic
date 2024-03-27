import { useWeather } from "Contexts/WeatherContext";

import { useChart } from "Components/Chart";
import { useTooltip } from "Components/Chart/Components";

import { trunc } from "ts/Helpers";

import type { ChartViews } from "../..";


export default function TooltipDisplay({day, view}: { day: number, view: ChartViews }) {
    const { dataPoints } = useChart();
    const hoverIndex = useTooltip()
    const { weather } = useWeather();

    const forecastUnit = weather.getForecastUnit(view)

    if (hoverIndex > - 1) {
        return (
            <>
                <h1 style={{ marginBottom: "5px"}}>Avg: {trunc(dataPoints[hoverIndex].y[2])}{forecastUnit}</h1>
                <p>Min {trunc(dataPoints[hoverIndex].y[0])} | Max {trunc(dataPoints[hoverIndex].y[1])}</p>
            </>
        );
    } else if (day === 0) {
        return (
            <>
                <h1 style={{ marginBottom: "5px"}}>Avg: {trunc(dataPoints[weather.nowIndex].y[2])}{forecastUnit}</h1>
                <p>Min {trunc(dataPoints[weather.nowIndex].y[0])} | Max {trunc(dataPoints[weather.nowIndex].y[1])}</p>
            </>
        )
    }

    return null;
}
