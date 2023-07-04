import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Chart";
import { Widget } from "Components/SimpleComponents";
import { Down, Meter, Up } from "svgs/widget";

import Weather from "ts/Weather";


function getTrendIcon(weather: Weather) {
    const surface = (x: number) => weather.getForecast("surface_pressure", x);
    const total = (surface(weather.nowIndex + 1) - surface(weather.nowIndex));

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
    const { weather } = useWeather();
    const { showModal } = useModal();

    return (
        <Widget id="pressure" widgetIcon={<Meter/>} widgetTitle={"Air Pressure"} onClick={() => showModal(<Chart showView={"surface_pressure"}/>)}>
            <div>
                { getTrendIcon(weather) }
                <p className="value">{weather.getForecast("surface_pressure").toFixed(2)}</p>
                <p>{weather.getForecastUnit("surface_pressure")}</p>
            </div>
        </Widget>
    );
};

export default Pressure;