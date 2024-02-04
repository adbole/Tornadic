import * as d3 from "d3";

import { trunc } from "ts/Helpers";
import type { CombinedHourly } from "ts/Weather";
import type Weather from "ts/Weather";

// Use Scientific Notation to truncate to at most 2 decimal places

export function getLowHigh(
    weather: Weather,
    prop: keyof Omit<CombinedHourly, "time">,
    day: number
) {
    const range = d3.extent(weather.getAllForecast(prop).slice(day * 24, (day + 1) * 24));
    if (range[0] === undefined) return;

    const unit = weather.getForecastUnit(prop);
    return `L: ${trunc(range[0])}${unit} H: ${trunc(range[1])}${unit}`;
}
