import { ResponsiveContainer, Line, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Area, ReferenceLine } from "recharts";
import { CustomTooltip, PressureTick, ChartDisplay } from "./Chart.Components";

import { Forecast, useWeather } from "../Contexes/Weather";
import React from "react";
import { TimeConverter, nameof } from "../../ts/Helpers";
import { Modal, ModalContent, ModalTitle } from "../Contexes/ModalContext";

//Properties denoted here represent values supported for displaying by a Chart
export enum HourlyProperties {
    Temperature = "temperature_2m",
    Humidity = "relativehumidity_2m",
    Precipitation = "precipitation",
    Dewpoint = "dewpoint_2m",
    Visibility = "visibility",
    Windspeed = "windspeed_10m",
    Pressure = "surface_pressure"
}

export type DataPoint = {
    property: HourlyProperties,
    name: string,
    primaryKey: number,
    secondaryKey: number | null
}

const ToHSL = (x: number) => `hsl(${250 * ((120-x)/120)}deg, 100%, 50%)`;

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

function GetMinMax([min, max]: [number, number], property: HourlyProperties): [number, number] {
    if(property === HourlyProperties.Pressure) {
        min -= 0.1;
        max += 0.1;
    }
    else if(property === HourlyProperties.Precipitation) {
        min = 0;
        max = Math.max(0.5, max);
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

function GetDataVisual(forecastData: Forecast, property: HourlyProperties, data: DataPoint[]) {
    switch(property) {
        case HourlyProperties.Precipitation:
            return <Bar dataKey={nameof<DataPoint>("primaryKey")} fill={"#0078ef"} />;
        case HourlyProperties.Temperature:
            const dataValues = data.flatMap(point => [point.primaryKey, (point.secondaryKey as number) ?? 0]);
            const minMax = GetMinMax([Math.min(...dataValues), Math.max(...dataValues)], property);

            return (
                <>
                    <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={ToHSL(Math.min(120, minMax[1]))} stopOpacity="0.5"/>
                            <stop offset="100%" stopColor={ToHSL(Math.max(0, minMax[0]))} stopOpacity="0.5"/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey={nameof<DataPoint>("primaryKey")} stroke="#ffffff00" fillOpacity={1} fill="url(#tempGradient)" unit={forecastData.hourly_units[property]}/>
                    <Area type="monotone" dataKey={nameof<DataPoint>("secondaryKey")} stroke="#fff" fillOpacity={0}/>
                </>
            );
        default:
            return (
                <>
                    <Line type="monotone" dataKey={nameof<DataPoint>("primaryKey")} stroke="#2668f7" unit={forecastData.hourly_units[property]}/>
                    {data[0].secondaryKey != null && <Line type="monotone" dataKey={nameof<DataPoint>("secondaryKey")} stroke="#2eff7d"/>}
                </>
            );
    }
}

const Chart = ({showProperty, showDay = 0}: {showProperty: HourlyProperties, showDay?: number}) => {
    const forecastData = useWeather().forecast;
    const [property, setProperty] = React.useState(showProperty);
    const [day, setDay] = React.useState(showDay);

    const chartData = React.useMemo(() => GetData(forecastData, property, day), [forecastData, property, day]);

    const timeRef = React.useRef<HTMLSpanElement>(null);
    const setTimeText = React.useCallback((s: string) => {
        if(!timeRef.current) return;

        timeRef.current.innerText = s;
    }, []);

    const onMouseMove = React.useCallback((e: any) => e.activeLabel ? setTimeText(", " + e.activeLabel) : setTimeText(""), [setTimeText]);
    const onMouseLeave = React.useCallback(() => setTimeText(""), [setTimeText]);

    return (
       <Modal id="chart">
            <ModalTitle>
                <select className="clear" title="Current Chart" onChange={(e) => setProperty(e.currentTarget.value as HourlyProperties)} value={property}>
                    {
                        Object.keys(HourlyProperties).map(key => (
                            <option key={key} value={HourlyProperties[key as keyof typeof HourlyProperties]}>{key}</option>
                        ))
                    }
                </select>
            </ModalTitle>
            <ModalContent>
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

                <p><span>{TimeConverter.GetTimeFormatted(forecastData.hourly.time[day * 24], TimeConverter.TimeFormat.Date)}</span><span ref={timeRef}></span></p>

                <hr></hr>

                <ResponsiveContainer width={"100%"} height="100%">
                    <ChartDisplay property={property} data={chartData} margin={{top: 0, left: 0, right: 0, bottom: 0}} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
                        {GetDataVisual(forecastData, property, chartData)}
                        <CartesianGrid stroke="#ffffff19"/>
                        <XAxis dataKey="name" interval={5} textAnchor="start"/>
                        {
                            property === HourlyProperties.Pressure 
                            ? <YAxis domain={([dataMin, dataMax]) => GetMinMax([dataMin, dataMax], property)} tick={<PressureTick unit={forecastData.hourly_units[property]}/>}/>
                            : <YAxis domain={([dataMin, dataMax]) => GetMinMax([dataMin, dataMax], property)} unit={forecastData.hourly_units[property]} />
                        }
                        
                        {/* @ts-ignore */}
                        <Tooltip wrapperStyle={{ outline: "none" }} position={{x: 'auto', y: 10}} content={<CustomTooltip/>}/>
                        {day === 0 && <ReferenceLine x={TimeConverter.GetTimeFormatted(forecastData.hourly.time[forecastData.nowIndex], TimeConverter.TimeFormat.Hour)}/>}
                    </ChartDisplay>
                </ResponsiveContainer>
            </ModalContent>
       </Modal>
    );
};

export default React.memo(Chart);