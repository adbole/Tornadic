import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Widget } from "./SimpleComponents";
import { Forecast, useWeather } from "./Contexes/WeatherContext";
import { Tornadic } from "../svgs/svgs";
import React from "react";

// enum Hourly_Properties {
//     temperature_2m = "Temperature",
//     relativehumidity_2m = "Humidity",
//     precipitation = "Preciptiation",
//     dewpoint_2m = "Dewpoint",
//     visibility = "Visibility",
//     windspeed_10m = "Windspeed",
//     surface_pressure = "Pressure"
// }

enum Hourly_Properties {
    Temperature = "temperature_2m",
    Humidity = "relativehumidity_2m",
    Precipitation = "precipitation",
    Dewpoint = "dewpoint_2m",
    Visibility = "visibility",
    Windspeed = "windspeed_10m",
    Pressure = "surface_pressure"
}

function GetData(forecastData: Forecast, property: Hourly_Properties, day: number) {
    let data: any[] = [];

    for(let i = 24 * (day); i < 24 * (day + 1); ++i) {
        data.push({
            name: new Date(forecastData.hourly.time[i]).toLocaleTimeString("en-us", {hour: "numeric", hour12: true}),
            key: forecastData.hourly[property][i].toFixed(0)
        });
    }

    return data;
}

const Chart = () => {
    const forecastData = useWeather().forecast;
    const [property, setProperty] = React.useState(Hourly_Properties.Temperature);
    const [day, setDay] = React.useState(1);

    const data = GetData(forecastData, property, day);
    const dataKeys = data.map(point => point.key);
    let min = Math.min(...dataKeys);
    let max = Math.max(...dataKeys);

    min = Math.floor((min * 0.95) / 10) * 10;
    max = Math.ceil((max * 1.10) / 10) * 10;
    

    return (
        <Widget id="chart" widgetIcon={<Tornadic/>} widgetTitle={"Charts"}>
            <select onChange={(e) => setProperty(e.currentTarget.value as Hourly_Properties)}>
                {
                    Object.keys(Hourly_Properties).map(key => (
                        <option key={key} value={(Hourly_Properties as any)[key]}>{key}</option>
                    ))
                }
            </select>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} width={500} height={300} margin={{top: 0, left: 0, right: 0, bottom: 0}}>
                    <Line type="monotone" dataKey="key" stroke="#82ca9d"/>
                    <XAxis dataKey="name"/>
                    <YAxis tickSize={10} dataKey={"key"} domain={[min, max]} unit={forecastData.hourly_units[property]}/>
                    <Tooltip/>
                </LineChart>
            </ResponsiveContainer>
        </Widget>
    );
};

export default Chart;