import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/Weather";
import { Forecast } from "Contexts/Weather/index.types";

import Chart, { ChartViews } from "Components/Chart";
import { Widget } from "Components/SimpleComponents";
import { Down, Meter, Up } from "svgs/widget";

function getTrendIcon(forecast: Readonly<Forecast>) {
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
    const { forecast } = useWeather();
    const { showModal } = useModal();

    return (
        <Widget id="pressure" widgetIcon={<Meter/>} widgetTitle={"Air Pressure"} onClick={() => showModal(<Chart showView={ChartViews.Pressure}/>)}>
            <div>
                { getTrendIcon(forecast) }
                <p className="value">{(forecast.hourly.surface_pressure[forecast.nowIndex]).toFixed(2)}</p>
                <p>{forecast.hourly_units.surface_pressure}</p>
            </div>
        </Widget>
    );
};

export default Pressure;