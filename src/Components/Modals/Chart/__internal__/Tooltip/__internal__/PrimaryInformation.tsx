import React from "react";

import { useWeather } from "Contexts/WeatherContext";

import { useChart } from "../../ChartContext";

import { getLowHigh, trunc } from "./Helpers";


export default function PrimaryInformation({ day, hoverIndex }: { day: number; hoverIndex: number }) {
    const { view, dataPoints } = useChart()
    const { weather } = useWeather()

    const mainInformation = React.useMemo(() => {
        let string: string | undefined = undefined;

        if(hoverIndex !== -1) {
            string = trunc(dataPoints[hoverIndex].y1).toString()
        }
        else if(day === 0) {
            string = trunc(weather.getForecast(view)).toString()
        }
        else return getLowHigh(weather, view, day)

        return string && string + weather.getForecastUnit(view)
    }, [day, view, weather, hoverIndex, dataPoints])

    return <h1>{mainInformation}</h1>
}