import styled from "@emotion/styled";

import { useBooleanState } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Modals/Chart";
import Widget from "Components/Widget";
import { Down, Meter, Up } from "svgs/widget";

import { centerFlex, varNames } from "ts/StyleMixins";
import type Weather from "ts/Weather";


const Container = styled.div(centerFlex, {
    flexDirection: "column",
    gap: "5px",
});

function getTrendIcon(weather: Weather) {
    const surface = (x: number) => weather.getForecast("surface_pressure", x);
    const total = surface(weather.nowIndex + 1) - surface(weather.nowIndex);

    //Changes greater than +- 0.02 are considered non-equal
    if (total > 0.02) return <Up />;
    else if (total < -0.02) return <Down />;

    return <span>=</span>;
}

export default function Pressure() {
    const { weather } = useWeather();
    const [modalOpen, showModal, hideModal] = useBooleanState(false);

    return (
        <>
            <Widget widgetIcon={<Meter />} widgetTitle="Air Pressure" onClick={showModal}>
                <Container>
                    <p style={{ margin: "-0.5rem", fontSize: "2rem", [varNames.svgSize]: "2rem" }}>
                        {getTrendIcon(weather)}
                    </p>
                    <p style={{ fontSize: "2rem" }}>
                        {weather.getForecast("surface_pressure").toFixed(2)}
                    </p>
                    <p>{weather.getForecastUnit("surface_pressure")}</p>
                </Container>
            </Widget>
            <Chart showView="surface_pressure" isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
