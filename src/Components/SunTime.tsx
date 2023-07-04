import { useWeather } from "Contexts/WeatherContext";

import Widget from "Components/Widget";
import { Sunrise, Sunset } from "svgs/widget";

import * as TimeConversion from "ts/TimeConversion";

/**
 * A helper component for SunTime to display when the sunrise/sunset will ocurr along with what comes next.
 */
const HelperWidget = ({ isSunrise, time, nextTime }: { isSunrise: boolean,  time: string, nextTime: string }) => (
    <Widget id="suntime" isTemplate size={"widget-wide"}>
        <div>
            <p>{isSunrise ? "Sunrise" : "Sunset"}</p>
            <h1>{TimeConversion.getTimeFormatted(time, TimeConversion.TimeFormat.HourMinute)}</h1>
            <p>{isSunrise ? "Sunset" : "Sunrise"} {TimeConversion.getTimeFormatted(nextTime, TimeConversion.TimeFormat.HourMinute)}</p>
        </div>
        {isSunrise ? <Sunrise /> : <Sunset />}
    </Widget>
);

/**
 * Displays when the sunrise/sunset will occur and what will come after that.
 * @returns The SunTime widget
 */
const SunTime = () => {
    const { weather } = useWeather();
    const sunrise = (x: number) => weather.getDay("sunrise", x);
    const sunset = (x: number) => weather.getDay("sunset", x);

    const currentDate = new Date();

    if(currentDate < new Date(sunrise(0))) {
        return <HelperWidget isSunrise={true} time={sunrise(0)} nextTime={sunset(0)} />;
    }
    else if(currentDate < new Date(sunset(0))) {
        return <HelperWidget isSunrise={false} time={sunset(0)} nextTime={sunrise(1)}/>;
    }
    else {
        return <HelperWidget isSunrise={true} time={sunrise(1)} nextTime={sunset(1)} />;
    }
};

export default SunTime;