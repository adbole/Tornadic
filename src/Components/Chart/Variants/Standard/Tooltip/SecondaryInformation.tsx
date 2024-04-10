import React from "react";

import { useWeather } from "Contexts/WeatherContext";

import { useTooltip } from "Components/Chart/Components";
import type { ChartViews } from "Components/Modals/Chart";

import { get_aq, get_uv, trunc } from "ts/Helpers";
import type { CombinedHourly } from "ts/Weather";

import { getLowHigh } from "./Helpers";


function supportingInformation(
    view: ChartViews
): [keyof Omit<CombinedHourly, "time">, string] | undefined {
    switch (view) {
        case "precipitation":
            return ["precipitation_probability", "Chance of Precip"];
        case "temperature_2m":
            return ["apparent_temperature", "Feels"];
        case "relativehumidity_2m":
            return ["dewpoint_2m", "Dewpoint"];
        case "dewpoint_2m":
            return ["relativehumidity_2m", "Humidity"];
        case "windspeed_10m":
            return ["windgusts_10m", "Gust"];
        case "us_aqi":
            return ["us_aqi", ""];
        case "uv_index":
            return ["uv_index", ""];
        default:
            return undefined;
    }
}

export default function SecondaryInformation({day, view}: { day: number, view: ChartViews }) {
    const hoverIndex = useTooltip()
    const { weather } = useWeather();

    const secondaryInformation = React.useMemo(() => {
        const supporting = supportingInformation(view);
        if (!supporting) return null;

        const [property, label] = supporting;

        if (property === "uv_index" || property === "us_aqi") {
            const level = property === "uv_index" ? get_uv : get_aq;

            if (hoverIndex > -1) {
                const weatherIndex = day * 24 + hoverIndex;
                return level(weather.getForecast(property, weatherIndex));
            } else if (day === 0) {
                return level(weather.getForecast(property));
            }

            //Display nothing for days > 0
            return null;
        }

        let string = `${label}: `;

        if (hoverIndex > -1) {
            const weatherIndex = day * 24 + hoverIndex;
            string += trunc(weather.getForecast(property, weatherIndex)).toString();
        } else if (day === 0) {
            string += trunc(weather.getForecast(property)).toString();
        } else return `${label} ${getLowHigh(weather, property, day)}`;

        return string + weather.getForecastUnit(property);
    }, [day, view, weather, hoverIndex]);

    return secondaryInformation ? <h3>{secondaryInformation}</h3> : null;
}
