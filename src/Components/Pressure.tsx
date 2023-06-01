import { Forecast, useWeather } from "./Contexts/Weather";
import { Widget } from "./SimpleComponents";
import { Meter, Up, Down } from "svgs/widget";

import { useModal } from "./Contexts/ModalContext";
import Chart, { HourlyProperties } from "./Chart";

function GetTrendIcon(forecast: Forecast) {
    const surface = forecast.hourly.surface_pressure;
    const total = (surface[forecast.nowIndex + 1] - surface[forecast.nowIndex]);

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
    const forecast = useWeather().forecast;
    const trendIcon = GetTrendIcon(forecast);
    const {showModal} = useModal();

    return (
        <Widget id="pressure" widgetIcon={<Meter/>} widgetTitle={"Air Pressure"} onClick={() => showModal(<Chart showProperty={HourlyProperties.Pressure}/>)}>
            <div>
                {trendIcon}
                <h1>{(forecast.hourly.surface_pressure[forecast.nowIndex]).toFixed(2)}</h1>
                <p>{forecast.hourly_units.surface_pressure}</p>
            </div>
        </Widget>
    );
};

export default Pressure;