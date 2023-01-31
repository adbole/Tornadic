import { Widget, WidgetSize } from './SimpleComponents';
import { Sunrise, Sunset } from '../svgs/widget/widget.svgs';
import { useWeather } from './Contexes/WeatherContext';

/**
 * A helper component for SunTime to display when the sunrise/sunset will ocurr along with what comes next.
 */
const HelperWidget = (props: {isSunrise: boolean,  time: string, nextTime: string}) => (
    <Widget id="suntime" size={WidgetSize.WIDE}>
        <div>
            <p>{props.isSunrise ? "Sunrise" : "Sunset"}</p>
            <h1>{new Date(props.time).toLocaleTimeString(undefined, {hour:"numeric", minute:"2-digit", hourCycle: "h12"})}</h1>
            <p>{props.isSunrise ? "Sunset" : "Sunrise"} {new Date(props.nextTime).toLocaleTimeString(undefined, {hour:"numeric", minute:"2-digit", hourCycle: "h12"})}</p>
        </div>
        <div>
            {props.isSunrise ? <Sunrise /> : <Sunset />}
        </div>
    </Widget>
);

/**
 * Displays when the sunrise/sunset will occur and what will come after that.
 * @returns The SunTime widget
 */
const SunTime = () => {
    const dailyData = useWeather().forecast.daily;
    const currentDate = new Date();

    //When the date is before the sunrise of the current day, show that days sunrise and sunset
    if(currentDate < new Date(dailyData.sunrise[0])) {
        return <HelperWidget isSunrise={true} time={dailyData.sunrise[0]} nextTime={dailyData.sunset[0]} />;
    }
    //When the date is before the sunset of the current day, show taht days sunset and tomorrows sunrise
    else if(currentDate < new Date(dailyData.sunset[0])) {
        return <HelperWidget isSunrise={false} time={dailyData.sunset[0]} nextTime={dailyData.sunrise[1]}/>;
    }
    //When the current date passes the current day's sunrise and sunset show tomorrow's sunrise and sunset
    else {
        return <HelperWidget isSunrise={true} time={dailyData.sunrise[1]} nextTime={dailyData.sunset[1]} />;
    }
};

export default SunTime;