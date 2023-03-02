import { Forecast, useWeather } from "./Contexes/WeatherContext";
import { Widget } from "./SimpleComponents";
import { Meter, Up, Down } from "../svgs/widget/widget.svgs";

function GetTrendIcon(forecast: Forecast) {
    const surface = forecast.hourly.surface_pressure;
    const total = (surface[forecast.nowIndex + 1] - surface[forecast.nowIndex]) / 33.864; //Division to convert to inHG

    //Changes greater than +- 0.02 are considered non-equal
    if(total > 0.02) {
        return <Up/>;
    }
    else if(total < -0.02) {
        return <Down/>;
    }
    else {
        return <p className="equal">=</p>;
    }
}

const Pressure = () => {
    const forecast = useWeather().forecast; //Pressure measured in hPa

    const inHg = (forecast.hourly.surface_pressure[forecast.nowIndex] / 33.864).toFixed(2);
    const trendIcon = GetTrendIcon(forecast);

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