import { extent } from "d3";

import { useWeather } from "Contexts/WeatherContext";

import { useChart } from "Components/Chart";
import { useTooltip } from "Components/Chart/Components";
import type { ChartViews } from "Components/Modals/Chart";

import { trunc } from "ts/Helpers";

import { AVG_INDEX, MAX_INDEX, MIN_INDEX } from "./Constants";


export default function TooltipDisplay({day, view}: { day: number, view: ChartViews }) {
    const { dataPoints } = useChart();
    const hoverIndex = useTooltip()
    const { weather } = useWeather();

    const forecastUnit = weather.getForecastUnit(view)

    if (hoverIndex > - 1) {
        return (
            <>
                <h1 style={{ marginBottom: "5px"}}>Avg: {trunc(dataPoints[hoverIndex].y[AVG_INDEX])}{forecastUnit}</h1>
                <p>Min {trunc(dataPoints[hoverIndex].y[MIN_INDEX])} | Max {trunc(dataPoints[hoverIndex].y[MAX_INDEX])}</p>
            </>
        );
    } else if (day === 0) {
        return (
            <>
                <h1 style={{ marginBottom: "5px"}}>Avg: {trunc(dataPoints[weather.nowIndex].y[AVG_INDEX])}{forecastUnit}</h1>
                <p>Min {trunc(dataPoints[weather.nowIndex].y[MIN_INDEX])} | Max {trunc(dataPoints[weather.nowIndex].y[MAX_INDEX])}</p>
            </>
        )
    }

    const [low, high] = extent(dataPoints, point => point.y[AVG_INDEX])
    const unit = weather.getForecastUnit(view)

    return (
        <>
            <h1>L: {trunc(low!)} H: {trunc(high!)}</h1>
            { unit !== "" && <p>In Unit: {unit}</p> }
        </>
    );
}
