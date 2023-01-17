import { Widget } from './SimpleComponents'
import { Sunrise, Sunset } from '../svgs/widget/widget.svgs'
import { useWeather } from './WeatherContext'

const HelperWidget = (props: {isSunrise: boolean,  time: string, nextTime: string}) => (
    <Widget id="suntime" className="widget-wide">
        <div>
            <p>{props.isSunrise ? "Sunrise" : "Sunset"}</p>
            <h1>{new Date(props.time).toLocaleTimeString(undefined, {hour:"numeric", minute:"2-digit", hourCycle: "h12"})}</h1>
            <p>{!props.isSunrise ? "Sunrise" : "Sunset"} {new Date(props.nextTime).toLocaleTimeString(undefined, {hour:"numeric", minute:"2-digit", hourCycle: "h12"})}</p>
        </div>
        <div>
            {props.isSunrise ? <Sunrise /> : <Sunset />}
        </div>
    </Widget>
)

const SunTime = () => {
    const forecastData = useWeather()!.forecast
    const currentDate = new Date();

    if(currentDate < new Date(forecastData.daily.sunrise[0])) {
        return <HelperWidget isSunrise={true} time={forecastData.daily.sunrise[0]} nextTime={forecastData.daily.sunset[0]} />
    }
    else if(currentDate < new Date(forecastData.daily.sunrise[0])) {
        return <HelperWidget isSunrise={false} time={forecastData.daily.sunset[0]} nextTime={forecastData.daily.sunrise[1]}/>
    }
    else {
        return <HelperWidget isSunrise={true} time={forecastData.daily.sunrise[1]} nextTime={forecastData.daily.sunset[1]} />
    }
}

export default SunTime;