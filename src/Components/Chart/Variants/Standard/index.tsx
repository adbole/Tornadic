import React from "react";

import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Chart";
import { Axes, NowReference, Tooltip } from "Components/Chart/Components";

import { getMinMaxFunc } from "../Shared";

import ChartVisualization from "./ChartVisualization";
import { PrimaryInformation, SecondaryInformation, Time } from "./Tooltip";


function getY2Property(view: ChartViews) {
    switch (view) {
        case "temperature_2m":
            return "apparent_temperature";
        case "windspeed_10m":
            return "windgusts_10m";
        default:
            return null;
    }
}

export default function Standard({ view, day }: { view: ChartViews, day: number}) {
    const { weather } = useWeather()
    
    const dataPoints = React.useMemo(() => {
        const from = day * 24;
        const to = from + 24;

        const x = weather
            .getAllForecast("time")
            .slice(from, to)
            .map(time => new Date(time));
        const y1 = weather.getAllForecast(view).slice(from, to);

        const y2Prop = getY2Property(view);
        const y2 = y2Prop ? weather.getAllForecast(y2Prop).slice(from, to) : null;

        return x.map((x, i) => ({
            x,
            y: y2?.[i] == null ? [y1[i]] : [y1[i], y2[i]],
        }));
    }, [weather, view, day]);

    return (
        <Chart dataPoints={dataPoints} yBounds={getMinMaxFunc(view)} type={view === "precipitation" ? "band" : "linear"}>
            <Axes />
            <ChartVisualization view={view}/>
            <NowReference isShown={!day} />
            <Tooltip>
                {
                    dataPoints.every(d => d.y[0] == null) ? (
                        <h1>No Data</h1>
                    ) : (
                        <>
                            <Time day={day} />
                            <PrimaryInformation view={view} day={day} />
                            <SecondaryInformation view={view} day={day} />
                        </>
                    )
                }
            </Tooltip>
        </Chart>
    )
}