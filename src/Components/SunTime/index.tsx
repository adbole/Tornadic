import styled from "@emotion/styled";

import { useWeather } from "Contexts/WeatherContext";

import Widget from "Components/Widget";
import { Sunrise, Sunset } from "svgs/widget";

import { centerFlex } from "ts/StyleMixins";
import getTimeFormatted from "ts/TimeConversion";


const SunTimeWidget = styled(Widget)([
    centerFlex,
    {
        flexDirection: "row",
        justifyContent: "space-evenly",
        "> svg": { width: "5rem" },
    },
]);

/**
 * A helper component for SunTime to display when the sunrise/sunset will ocurr along with what comes next.
 */
function HelperWidget({
    isSunrise,
    time,
    nextTime,
}: {
    isSunrise: boolean;
    time: string;
    nextTime: string;
}) {
    return (
        <SunTimeWidget isTemplate size="widget-wide">
            <div>
                <p>{isSunrise ? "Sunrise" : "Sunset"}</p>
                <h1>{getTimeFormatted(time, "hourMinute")}</h1>
                <p>
                    {isSunrise ? "Sunset" : "Sunrise"} {getTimeFormatted(nextTime, "hourMinute")}
                </p>
            </div>
            {isSunrise ? <Sunrise /> : <Sunset />}
        </SunTimeWidget>
    );
}

/**
 * Displays when the sunrise/sunset will occur and what will come after that.
 * @returns The SunTime widget
 */
export default function SunTime() {
    const { weather } = useWeather();
    const sunrise = (x: number) => weather.getDay("sunrise", x);
    const sunset = (x: number) => weather.getDay("sunset", x);

    const currentDate = new Date();

    if (currentDate < new Date(sunrise(0))) {
        return <HelperWidget isSunrise={true} time={sunrise(0)} nextTime={sunset(0)} />;
    } else if (currentDate < new Date(sunset(0))) {
        return <HelperWidget isSunrise={false} time={sunset(0)} nextTime={sunrise(1)} />;
    }

    return <HelperWidget isSunrise={true} time={sunrise(1)} nextTime={sunset(1)} />;
}
