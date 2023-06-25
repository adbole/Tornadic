import { useWeather } from "Contexts/Weather";

import { Widget, WidgetSize } from "Components/SimpleComponents";
import { Sunrise, Sunset } from "svgs/widget";

import * as TimeConversion from "ts/TimeConversion";

/**
 * A helper component for SunTime to display when the sunrise/sunset will ocurr along with what comes next.
 */
const HelperWidget = ({ isSunrise, time, nextTime }: { isSunrise: boolean,  time: string, nextTime: string }) => (
    <Widget id="suntime" isTemplate size={WidgetSize.WIDE}>
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
    const { forecast: { daily } } = useWeather();
    const currentDate = new Date();

    if(currentDate < new Date(daily.sunrise[0])) {
        return <HelperWidget isSunrise={true} time={daily.sunrise[0]} nextTime={daily.sunset[0]} />;
    }
    else if(currentDate < new Date(daily.sunset[0])) {
        return <HelperWidget isSunrise={false} time={daily.sunset[0]} nextTime={daily.sunrise[1]}/>;
    }
    else {
        return <HelperWidget isSunrise={true} time={daily.sunrise[1]} nextTime={daily.sunset[1]} />;
    }
};

export default SunTime;