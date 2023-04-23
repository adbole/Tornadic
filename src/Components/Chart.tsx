import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area } from "recharts";
import { Widget } from "./SimpleComponents";
import { Forecast, useWeather } from "./Contexes/WeatherContext";
import { Tornadic } from "../svgs/svgs";
import React from "react";

//Helper method to ensure that a string matches a property on a type 
const nameof = <T,>(name: Extract<keyof T, string>): string => name;

enum HourlyProperties {
    Temperature = "temperature_2m",
    Humidity = "relativehumidity_2m",
    Precipitation = "precipitation",
    Dewpoint = "dewpoint_2m",
    Visibility = "visibility",
    Windspeed = "windspeed_10m",
    Pressure = "surface_pressure"
}

type DataPoint = {
    name: string,
    primaryKey: number,
    secondaryKey: number | null
}

function GetData(forecastData: Forecast, property: HourlyProperties, day: number) {
    let data: DataPoint[] = [];

    for(let i = 24 * (day); i < 24 * (day + 1); ++i) {
        data.push({
            name: new Date(forecastData.hourly.time[i]).toLocaleTimeString("en-us", {hour: "numeric", hour12: true}),
            primaryKey: forecastData.hourly[property][i],
            secondaryKey: GetSecondaryKey(i)
        });
    }

    return data;

    function GetSecondaryKey(i: number) {
        switch(property) {
            case HourlyProperties.Temperature:
                return forecastData.hourly.apparent_temperature[i];
            case HourlyProperties.Windspeed:
                return forecastData.hourly.windgusts_10m[i]; //TODO: Replace with wind gust
            default:
                return null;
        }
    }
}

// min = Math.max(0, min);
// max = Math.min(120, max);

const ToHSL = (x: number) => `hsl(${250 * ((120-x)/120)}deg, 100%, 50%)`;

function GetChart(forecastData: Forecast, property: HourlyProperties, day: number) {
    const data = GetData(forecastData, property, day);
    const minMax = GetMinMax();

    if(property === HourlyProperties.Precipitation) {
        return (
            <BarChart data={data} margin={{top: 0, left: 0, right: 0, bottom: 0}}>
                <CartesianGrid stroke="#ffffff19"/>
                <XAxis dataKey="name"/>
                <YAxis domain={[0, Math.max(0.5, minMax.max)]} dataKey={"key"} unit={forecastData.hourly_units[property]}/>

                <Bar dataKey={nameof<DataPoint>("primaryKey")} fill={"#0078ef"} />
            </BarChart>
        );
    }
    else if(property === HourlyProperties.Temperature) {
        return (
            <AreaChart data={data} margin={{top: 0, left: 0, right: 0, bottom: 0}}>
                <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={ToHSL(Math.min(120, minMax.max))} stopOpacity="0.5"/>
                        <stop offset="100%" stopColor={ToHSL(Math.max(0, minMax.min))} stopOpacity="0.5"/>
                    </linearGradient>
                </defs>

                <CartesianGrid stroke="#ffffff19"/>
                <XAxis dataKey="name"/>
                <YAxis domain={[minMax.min, minMax.max]} unit={forecastData.hourly_units[property]}/>
                <Tooltip/>

                <Area type="monotone" dataKey={nameof<DataPoint>("primaryKey")} fillOpacity={1} fill="url(#tempGradient)" />
                <Area type="monotone" dataKey={nameof<DataPoint>("secondaryKey")} stroke="#fff" fillOpacity={0}/>
            </AreaChart>
        );
    }
    else {
        return (
            <LineChart data={data} margin={{top: 0, left: 0, right: 0, bottom: 0}}>
                {data[0].secondaryKey != null && <Line type="monotone" dataKey={nameof<DataPoint>("secondaryKey")} stroke="#82ca9d"/>}
                <CartesianGrid stroke="#ffffff19"/>
                <XAxis dataKey="name"/>
                <YAxis dataKey={"key"} domain={[minMax.min, minMax.max]} unit={forecastData.hourly_units[property]}/>
                <Tooltip/>

                <Line type="monotone" dataKey={nameof<DataPoint>("primaryKey")} stroke="#82ca9d"/>
            </LineChart>
        );
    }

    function GetMinMax() {
        const dataKeys = data.map(point => point.primaryKey);
        if(data[0].secondaryKey != null) {
            dataKeys.push(...data.map(point => point.secondaryKey as number));
        }
    
        let min = Math.min(...dataKeys);
        let max = Math.max(...dataKeys);
    
        if(property === HourlyProperties.Pressure) {
            min -= 0.1;
            max += 0.1;
        }
        else {
            min = Math.floor((min * 0.95) / 10) * 10;
            max = Math.ceil((max * 1.10) / 10) * 10;
        }

        return {
            min: min,
            max: max
        };
    }
}

const Chart = () => {
    const forecastData = useWeather().forecast;
    const [property, setProperty] = React.useState(HourlyProperties.Temperature);
    const [day, setDay] = React.useState(0);

    return (
        <Widget id="chart" widgetIcon={<Tornadic/>} widgetTitle={"Charts"}>
            <select onChange={(e) => setProperty(e.currentTarget.value as HourlyProperties)}>
                {
                    Object.keys(HourlyProperties).map(key => (
                        <option key={key} value={(HourlyProperties as any)[key]}>{key}</option>
                    ))
                }
            </select>

            <ResponsiveContainer width="100%" height="100%">
                {GetChart(forecastData, property, day)}
            </ResponsiveContainer>
        </Widget>
    );
};

export default Chart;