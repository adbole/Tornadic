import React from "react";
import styled from "@emotion/styled";

import { useWeather } from "Contexts/WeatherContext";

import { useChart } from "./ChartContext";


const Container = styled.div({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    height: "100px",
    padding: "10px"
})


export default function Tooltip({ day }: { day: number }) {
    const { chart, x, y, view } = useChart()
    const { weather } = useWeather()

    const mainInformation = React.useMemo(() => {
        if(day === 0) {
            return (
                <h1>{weather.getForecast(view)}{weather.getForecastUnit(view)}</h1>
            )
        }
    }, [day, view, weather])

    const secondaryInformation = React.useMemo(() => {
        if(day !== 0) return null;

        if(view === "precipitation") {
            return (
                <h2>{weather.getForecast("precipitation_probability")}% chance of rain</h2>
            )
        }

        if(view === "temperature_2m") {
            return (
                <h3 style={{ fontWeight: 400 }}>
                    Feels: {weather.getForecast("apparent_temperature")}{weather.getForecastUnit("apparent_temperature")}
                </h3>
            )
        }
    }, [day, view, weather])

    return (
        <g>
            <foreignObject width="100%" height="100px" >
                <Container>
                    {mainInformation}
                    {secondaryInformation}
                </Container>
            </foreignObject>
            <line 
                x1={0} 
                x2="100%" 
                y1={100}
                y2={100} 
                stroke="#ffffff19" 
                strokeWidth={1}
            />
        </g>
    )
}