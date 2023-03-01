import { useWeather } from "./Contexes/WeatherContext";
import { Widget } from "./SimpleComponents";
import { Meter, Up, Down } from "../svgs/widget/widget.svgs";

function GetTrendIcon(values: number[]) {
    let total = values[1] - values[0];

    //Get trend based on next 3 hours
    for(let i = 1; i < 4; ++i) {
        total += values[i + 1] - values[i];
    }

    //Changes greater than +- 0.1 are considered non-equal
    if(total > 0.1) {
        return <Up/>;
    }
    else if(total < -0.1) {
        return <Down/>;
    }
    else {
        return <p className="equal">=</p>;
    }
}

const Pressure = () => {
    const forecast = useWeather().forecast;

    const inHg = (forecast.hourly.surface_pressure[forecast.nowIndex] * 0.03).toFixed(2);
    const trendIcon = GetTrendIcon(forecast.hourly.surface_pressure);

    return (
        <Widget id="pressure" widgetIcon={<Meter/>} widgetTitle={"Air Pressure"}>
            <div>
                {trendIcon}
                <h1>{inHg}</h1>
                <p>inHG</p>
            </div>
        </Widget>
    );
};

export default Pressure;