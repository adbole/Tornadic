import React from "react";

import { useWeather } from "Components/Contexts/Weather";
import { Forecast } from "Components/Contexts/Weather/index.types";
import { Modal, ModalContent, ModalTitle } from "Components/Contexts/ModalContext";

import { ResponsiveContainer, Line, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Area, ReferenceLine, YAxisProps } from "recharts";
import { CustomTooltip, ChartDisplay } from "./Components";

import * as TimeConversion from 'ts/TimeConversion';
import { nameof, toHSL } from "ts/Helpers";

//Properties denoted here represent values supported for displaying by a Chart
export enum ChartViews {
    Temperature = "temperature_2m",
    Humidity = "relativehumidity_2m",
    Precipitation = "precipitation",
    Dewpoint = "dewpoint_2m",
    Visibility = "visibility",
    Windspeed = "windspeed_10m",
    Pressure = "surface_pressure"
}

export type DataPoint = {
    property: ChartViews,
    name: string,
    primaryKey: number,
    secondaryKey: number | null
}

//Gets the data for the given day and property
function getData(forecast: Readonly<Forecast>, property: ChartViews, day: number) {
    let data: DataPoint[] = [];

    for(let i = 24 * (day); i < 24 * (day + 1); ++i) {
        data.push({
            property: property,
            name: TimeConversion.getTimeFormatted(forecast.hourly.time[i], TimeConversion.TimeFormat.Hour),
            primaryKey: forecast.hourly[property][i],
            secondaryKey: GetSecondaryKey(i)
        });
    }

    return data;

    //Some properties have secondary values
    function GetSecondaryKey(i: number) {
        switch(property) {
            case ChartViews.Temperature:
                return forecast.hourly.apparent_temperature[i];
            case ChartViews.Windspeed:
                return forecast.hourly.windgusts_10m[i];
            default:
                return null;
        }
    }
}

function getMinMax([min, max]: [number, number], property: ChartViews): [number, number] {
    if(property === ChartViews.Pressure) {
        min -= 0.3;
        max += 0.3;
    }
    else if(property === ChartViews.Precipitation) {
        min = 0;
        max = Math.max(0.5, max);
    }
    else if (property === ChartViews.Humidity) {
        min = 0;
        max = 100;
    }
    else {
        min = Math.floor((min * 0.95) / 10) * 10;
        max = Math.ceil((max * 1.10) / 10) * 10;
    }

    return [min, max];
}

function getDataVisual(unit: string, view: ChartViews, dataPoints: DataPoint[]) {
    switch(view) {
        case ChartViews.Precipitation:
            return <Bar dataKey={nameof<DataPoint>("primaryKey")} fill={"#0078ef"} />;
        case ChartViews.Temperature:
            const dataValues = dataPoints.flatMap(point => [point.primaryKey, (point.secondaryKey as number) ?? 0]);
            const minMax = getMinMax([Math.min(...dataValues), Math.max(...dataValues)], view);

            return (
                <>
                    <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={toHSL(Math.min(120, minMax[1]))} stopOpacity="0.5"/>
                            <stop offset="100%" stopColor={toHSL(Math.max(0, minMax[0]))} stopOpacity="0.5"/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey={nameof<DataPoint>("primaryKey")} stroke="#ffffff00" fillOpacity={1} fill="url(#tempGradient)" unit={unit}/>
                    <Area type="monotone" dataKey={nameof<DataPoint>("secondaryKey")} stroke="#fff" fillOpacity={0}/>
                </>
            );
        default:
            return (
                <>
                    <Line type="monotone" dataKey={nameof<DataPoint>("primaryKey")} stroke="#2668f7" unit={unit}/>
                    {dataPoints[0].secondaryKey != null && <Line type="monotone" dataKey={nameof<DataPoint>("secondaryKey")} stroke="#2eff7d"/>}
                </>
            );
    }
}

const Chart = ({showView, showDay = 0}: {showView: ChartViews, showDay?: number}) => {
    const { forecast } = useWeather();
    const [view, setView] = React.useState(showView);
    const [day, setDay] = React.useState(showDay);

    const chartData = React.useMemo(() => getData(forecast, view, day), [forecast, view, day]);

    const timeRef = React.useRef<HTMLSpanElement>(null);
    const selectRef = React.useRef<HTMLSelectElement>(null);

    //Autosize the select element for style points
    React.useEffect(() => {
        if(!selectRef.current) return;

        const canvasContext = document.createElement('canvas').getContext('2d')!;
        //16px is default font-size and select is within a h1 getting 2rem font-size, therefore 32px is used here.
        canvasContext.font = '32px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';

        //Incase textContent is null Temperature is default since its the largest option
        const width = canvasContext.measureText(selectRef.current.children[selectRef.current.selectedIndex].textContent ?? "Temperature").width;

        selectRef.current.style.width = Math.round(width) + 30 + "px";
    }, [view, selectRef]);

    const setTimeText = React.useCallback((s: string) => {
        if(!timeRef.current) return;

        timeRef.current.innerText = s;
    }, [timeRef]);

    const onMouseMove = React.useCallback((e: any) => e.activeLabel ? setTimeText(", " + e.activeLabel) : setTimeText(""), [setTimeText]);
    const onMouseLeave = React.useCallback(() => setTimeText(""), [setTimeText]);

    const yAxisProps: YAxisProps = {
        width: 50,
        domain: ([dataMin, dataMax]) => getMinMax([dataMin, dataMax], view),
    };

    return (
       <Modal id="chart">
            <ModalTitle>
                <select ref={selectRef} className="clear" title="Current Chart" onChange={(e) => setView(e.currentTarget.value as ChartViews)} value={view}>
                    {
                        Object.keys(ChartViews).map(key => (
                            <option key={key} value={ChartViews[key as keyof typeof ChartViews]}>{key}</option>
                        ))
                    }
                </select>
            </ModalTitle>
            <ModalContent>
                <div className="day-controls">
                    {
                        forecast.hourly.time.filter((_, i) =>  i % 24 === 0).map((time, i) => (
                            <div key={i} className="toggle-button" onClick={() => setDay(i)}>
                                <input type="radio" name="chart-radio" id={i.toString()} defaultChecked={i === day}/>
                                <label htmlFor={i.toString()}>{TimeConversion.getTimeFormatted(time, TimeConversion.TimeFormat.Weekday)}</label>
                            </div>
                        ))
                    }
                </div>

                <p>{TimeConversion.getTimeFormatted(forecast.hourly.time[day * 24], TimeConversion.TimeFormat.Date)}<span ref={timeRef}></span></p>

                <ResponsiveContainer width={"100%"} height="100%">
                    <ChartDisplay property={view} data={chartData} margin={{top: 0, left: 0, right: 0, bottom: 0}} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
                        {getDataVisual(forecast.hourly_units[view], view, chartData)}
                        <CartesianGrid stroke="#ffffff19"/>
                        <XAxis dataKey="name" interval={5} textAnchor="start"/>
                        {
                            view === ChartViews.Temperature || view === ChartViews.Dewpoint || view === ChartViews.Humidity
                            ? <YAxis {...yAxisProps} unit={forecast.hourly_units[view]}/>
                            : <YAxis {...yAxisProps} tickFormatter={(value: number) => (Math.round(value * 10) / 10).toString()}/>
                        }
                        
                        {/* @ts-ignore */}
                        <Tooltip wrapperStyle={{ outline: "none" }} position={{x: 'auto', y: 10}} content={<CustomTooltip/>}/>
                        {day === 0 && <ReferenceLine x={TimeConversion.getTimeFormatted(forecast.hourly.time[forecast.nowIndex], TimeConversion.TimeFormat.Hour)}/>}
                    </ChartDisplay>
                </ResponsiveContainer>
            </ModalContent>
       </Modal>
    );
};

export default React.memo(Chart);