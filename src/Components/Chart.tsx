import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Widget } from "./SimpleComponents";
import { useWeather } from "./Contexes/WeatherContext";
import { Tornadic } from "../svgs/svgs";

enum Hourly_Properties {
    temperature_2m = "Temperature",
    relativehumidity_2m = "Humidity",
    precipitation = "Preciptiation",
    dewpoint_2m = "Dewpoint",
    visibility = "Visibility",
    windspeed_10m = "Windspeed",
    surface_pressure = "Pressure"
}

const Chart = () => {
    const forecastData = useWeather().forecast;

    function generate() {
        let data: any[] = [];

        for(let i = 0; i < 24; ++i) {
            data.push({
                name: new Date(forecastData.hourly.time[i]).toLocaleTimeString("en-us", {hour: "numeric", hour12: true}),
                Temperature: forecastData.hourly.temperature_2m[i].toFixed(0)
            });
        }

        return data;
    }

    return (
        <Widget id="chart" widgetIcon={<Tornadic/>} widgetTitle={"Charts"}>
            <select>
                {
                    Object.keys(Hourly_Properties).map(key => (
                        <option key={key} value={key}>{(Hourly_Properties as any)[key]}</option>
                    ))
                }
            </select>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generate()} width={500} height={300} margin={{top: 0, left: 0, right: 0, bottom: 0}}>
                    <Line type="monotone" dataKey="Temperature" stroke="#82ca9d"/>
                    <XAxis dataKey="name"/>
                    <YAxis width={30} tickFormatter={(value: string) => value + "°"}/>
                    <Tooltip/>
                </LineChart>
            </ResponsiveContainer>
        </Widget>
    );
};

export default Chart;