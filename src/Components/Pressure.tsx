import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Chart";
import Widget from "Components/Widget";
import { Down, Meter, Up } from "svgs/widget";

import type Weather from "ts/Weather";


function getTrendIcon(weather: Weather) {
    const surface = (x: number) => weather.getForecast("surface_pressure", x);
    const total = surface(weather.nowIndex + 1) - surface(weather.nowIndex);

    //Changes greater than +- 0.02 are considered non-equal
    if (total > 0.02) return <Up />;
    else if (total < -0.02) return <Down />;

    return <p className="equal">=</p>;
}

export default function Pressure() {
    const { weather } = useWeather();
    const [modalOpen, showModal, hideModal] = useBooleanState(false);

    return (
        <>
            <Widget
                className="pressure"
                widgetIcon={<Meter />}
                widgetTitle={"Air Pressure"}
                onClick={showModal}
            >
                <div>
                    {getTrendIcon(weather)}
                    <p className="value">{weather.getForecast("surface_pressure").toFixed(2)}</p>
                    <p>{weather.getForecastUnit("surface_pressure")}</p>
                </div>
            </Widget>
            <Chart showView={"surface_pressure"} isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
