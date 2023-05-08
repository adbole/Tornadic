import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area, TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";

import { Forecast, useWeather } from "./Contexes/WeatherContext";
import React from "react";
import { TimeConverter } from "../ts/Helpers";
import { Modal } from "./Contexes/ModalContext";

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
    property: HourlyProperties,
    name: string,
    primaryKey: number,
    secondaryKey: number | null
}

//Gets the data for the given day and property
function GetData(forecastData: Forecast, property: HourlyProperties, day: number) {
    let data: DataPoint[] = [];

    for(let i = 24 * (day); i < 24 * (day + 1); ++i) {
        data.push({
            property: property,
            name: TimeConverter.GetTimeFormatted(forecastData.hourly.time[i], TimeConverter.TimeFormat.Hour),
            primaryKey: forecastData.hourly[property][i],
            secondaryKey: GetSecondaryKey(i)
        });
    }

    return data;

    //Some properties have secondary values
    function GetSecondaryKey(i: number) {
        switch(property) {
            case HourlyProperties.Temperature:
                return forecastData.hourly.apparent_temperature[i];
            case HourlyProperties.Windspeed:
                return forecastData.hourly.windgusts_10m[i];
            default:
                return null;
        }
    }
}

const ToHSL = (x: number) => `hsl(${250 * ((120-x)/120)}deg, 100%, 50%)`;

//Airpressure needs a special tick in order to display properly
const PressureTick = ({x, y, payload, unit}: {x: number, y:number, payload: {value: number}, unit: string} & any) => (
    <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={5} fill="#666">
        <tspan textAnchor="end" x="0">{payload.value.toFixed(2)}</tspan>
        <tspan textAnchor="end" x="0" dy="20">{unit}</tspan>
        </text>
    </g>
);
  
//Customized tooltip to display primary and secondary data with labels if applicable
const CustomTooltip = ({active, payload}: TooltipProps<number, NameType>) => {
    if(!active || ! payload || !payload.length) return null;

    const FixDecimal = (property: HourlyProperties, value: number): string | number => 
        (property === HourlyProperties.Precipitation || property === HourlyProperties.Pressure) ? value.toFixed(2) : value.toFixed(0);

    const data: DataPoint = payload[0].payload;
    const unit = payload[0].unit;
    const label = (data.property === HourlyProperties.Temperature && "Feels: ") || (data.property === HourlyProperties.Windspeed && "Gust: ");

    return (
        <div className="chart-tooltip">
            <h1>{FixDecimal(data.property, data.primaryKey)}{unit}</h1>
            {data.secondaryKey && <p>{label}{FixDecimal(data.property, data.secondaryKey)}{unit}</p>}
        </div>
    );
};

function GetChart(forecastData: Forecast, property: HourlyProperties, day: number) {
    const data = GetData(forecastData, property, day);
    const dataValues = data.flatMap(point => [point.primaryKey, (point.secondaryKey as number) ?? 0]);

    if(property === HourlyProperties.Precipitation) {
        return (
            <BarChart data={data} margin={{top: 0, left: 0, right: 0, bottom: 0}}>
                {/* Bar uses a custom y-axis and when ordered before the common components one, it will get priority */}
                <YAxis width={45} domain={([_, dataMax]) => [0, Math.max(0.5, dataMax)]} unit={forecastData.hourly_units[property]}/>
                {GetCommonComponents()}

                <Bar dataKey={nameof<DataPoint>("primaryKey")} fill={"#0078ef"} />
            </BarChart>
        );
    }
    else if(property === HourlyProperties.Temperature) {
        const minMax = GetMinMax([Math.min(...dataValues), Math.max(...dataValues)]);

        return (
            <AreaChart data={data} margin={{top: 0, left: 0, right: 0, bottom: 0}}>
                <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={ToHSL(Math.min(120, minMax[1]))} stopOpacity="0.5"/>
                        <stop offset="100%" stopColor={ToHSL(Math.max(0, minMax[0]))} stopOpacity="0.5"/>
                    </linearGradient>
                </defs>

                {GetCommonComponents()}

                <Area type="monotone" dataKey={nameof<DataPoint>("primaryKey")} fillOpacity={1} fill="url(#tempGradient)" unit={forecastData.hourly_units[property]}/>
                <Area type="monotone" dataKey={nameof<DataPoint>("secondaryKey")} stroke="#fff" fillOpacity={0}/>
            </AreaChart>
        );
    }
    else {
        return (
            <LineChart data={data} margin={{top: 0, left: 0, right: 0, bottom: 0}}>
                {GetCommonComponents()}

                <Line type="monotone" dataKey={nameof<DataPoint>("primaryKey")} stroke="#2668f7" unit={forecastData.hourly_units[property]}/>
                {data[0].secondaryKey != null && <Line type="monotone" dataKey={nameof<DataPoint>("secondaryKey")} stroke="#2eff7d"/>}
            </LineChart>
        );
    }

    function GetCommonComponents() {
        return (
            <>
                <CartesianGrid stroke="#ffffff19"/>
                <XAxis dataKey="name" interval={5} textAnchor="start"/>
                {
                    property === HourlyProperties.Pressure ? 
                    <YAxis domain={([dataMin, dataMax]) => GetMinMax([dataMin, dataMax])} tick={<PressureTick unit={forecastData.hourly_units[property]}/>}/>
                    :
                    <YAxis domain={([dataMin, dataMax]) => GetMinMax([dataMin, dataMax])} unit={forecastData.hourly_units[property]} />       
                }
                {/* @ts-ignore */}
                <Tooltip wrapperStyle={{ outline: "none" }} position={{x: 'auto', y: 10}} content={<CustomTooltip/>}/>
            </>
        );
    };

    function GetMinMax([min, max]: [number, number]): [number, number] {
        if(property === HourlyProperties.Pressure) {
            min -= 0.1;
            max += 0.1;
        }
        else if (property === HourlyProperties.Humidity) {
            min = 0;
            max = 100;
        }
        else {
            min = Math.floor((min * 0.95) / 10) * 10;
            max = Math.ceil((max * 1.10) / 10) * 10;
        }

        return [min, max];
    }
}

const Chart = () => {
    const forecastData = useWeather().forecast;
    const [property, setProperty] = React.useState(HourlyProperties.Temperature);
    const [day, setDay] = React.useState(0);

    const select = (
        <select className="clear" title="Current Chart" onChange={(e) => setProperty(e.currentTarget.value as HourlyProperties)}>
            {
                Object.keys(HourlyProperties).map(key => (
                    <option key={key} value={(HourlyProperties as any)[key]}>{key}</option>
                ))
            }
        </select>
    );

    return (
       <Modal modalTitle={select} id="chart" className="wide">
            <div className="controls">
                {
                    forecastData.hourly.time.filter((_, i) =>  i % 24 === 0).map((time, i) => (
                        <div key={i} className="toggle-button" onClick={() => setDay(i)}>
                            <input type="radio" name="chart-radio" id={i.toString()} defaultChecked={i === day}/>
                            <label htmlFor={i.toString()}>{TimeConverter.GetTimeFormatted(time, TimeConverter.TimeFormat.Weekday)}</label>
                        </div>
                    ))
                }
            </div>

            <span>{TimeConverter.GetTimeFormatted(forecastData.hourly.time[day * 24], TimeConverter.TimeFormat.Date)}</span>

            <hr></hr>

            <ResponsiveContainer width={"100%"} height="100%">
                {GetChart(forecastData, property, day)}
            </ResponsiveContainer>
       </Modal>
    );
};

export default Chart;