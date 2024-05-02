import React from "react";
import styled from "@emotion/styled";

import type WeatherCondition from "ts/WeatherCondition";


const Cover = styled.div({
    position: "fixed",
    top: 0,
    left: 0,

    width: "100%",
    height: "100%",

    zIndex: -1,
});

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
                return isDay ? ["#7a98b2", "#bfc5c6"] : ["#151618", "#18202d"];
        }
    }, [isDay, condition]);

    const background = `linear-gradient(to bottom, ${from}, ${to})`;

    return <Cover style={{ background }} data-test-style-background={background} />;
}
