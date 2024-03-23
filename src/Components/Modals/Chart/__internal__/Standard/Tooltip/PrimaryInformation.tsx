import React from "react";

import { useWeather } from "Contexts/WeatherContext";

import { useChart } from "Components/Chart";
import { useTooltip } from "Components/Chart/Components";
import type { ChartViews } from "Components/Modals/Chart";

import { trunc } from "ts/Helpers";

import { getLowHigh } from "./Helpers";


export default function PrimaryInformation({day, view}: { day: number, view: ChartViews }) {
    const { dataPoints } = useChart();
    const hoverIndex = useTooltip()
    const { weather } = useWeather();

    const mainInformation = React.useMemo(() => {
        let string: string | undefined = undefined;

        if (hoverIndex > -1) {
            string = trunc(dataPoints[hoverIndex].y[0]).toString();
        } else if (day === 0) {
            string = trunc(weather.getForecast(view)).toString();
        } else return getLowHigh(weather, view, day);

        return string + weather.getForecastUnit(view);
    }, [day, view, weather, hoverIndex, dataPoints]);

    return mainInformation ? <h1>{mainInformation}</h1> : null;
}
