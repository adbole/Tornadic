import React from "react";
import { Global } from "@emotion/react";

import type WeatherCondition from "ts/WeatherCondition";


export default function Gradient({
    isDay,
    condition,
}: {
    isDay: boolean;
    condition: WeatherCondition["type"];
}) {
    const [from, to] = React.useMemo(() => {
        switch (condition) {
            case "Overcast":
                return isDay ? ["#acb7bd", "#73bae1"] : ["#2d3438", "#1a1b1c"];
            case "Rain":
            case "Drizzle":
            case "Freezing Drizzle":
            case "Freezing Rain":
            case "Rain Showers":
                return ["#0f1c50", "#8da3bd"];
            case "Thunderstorms":
            case "Thunderstorms and Hail":
                return ["#4f5158", "#8da3bd"];
            case "Snow":
            case "Snow Grains":
            case "Snow Showers":
                return ["#797c87", "#acb7bd"];
            default:
                return isDay ? ["#7a98b2", "#bfc5c6"] : ["#1a1b1c", "#1a1b1c"];
        }
    }, [isDay, condition]);

    return (
        <Global styles={{ body: { background: `linear-gradient(to bottom, ${from}, ${to})` } }} />
    );
}
