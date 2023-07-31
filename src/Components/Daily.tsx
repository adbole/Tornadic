import { useRef } from "react";

import { useBooleanState } from "Hooks";

import { useSettings } from "Contexts/SettingsContext";
import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Chart";
import Widget from "Components/Widget";
import { Calendar } from "svgs/widget";

import { Normalize, toHSL } from "ts/Helpers";
import { DayInfo } from "ts/Weather";


/**
 * A helper component for Daily to display the individual days of the week
 * @returns A single day as a table row entry
 */
const Day = ({ dayInfo, style, onClick }: {
    //Information on the day's values
    dayInfo: DayInfo,
    //The style to display the low and high for the week and where this day falls in the range
    style: React.CSSProperties

    onClick: (e: React.MouseEvent<HTMLTableRowElement>) => void
}) =>(
    <tr onClick={onClick}>
        <td><p>{dayInfo.day}</p></td>
        <td className={"condition"}>      
            <dayInfo.conditionInfo.icon/>
            {dayInfo.has_chance_of_rain && <span>{dayInfo.precipitation_probability}%</span>}
        </td>
        <td>
            <div className='temp-range'>
                <p>{dayInfo.temperature_low}°</p>    
                <div className="dual-range">
                    <div className="covered" style={style}></div>
                </div>
                <p>{dayInfo.temperature_high}°</p>
            </div>
        </td>
    </tr>
);

/**
 * Displays the week's temperatures and conditions along with the highest and lowest temp across the week.
 * @returns The Daily widget
 */
const Daily = () => {
    const { weather } = useWeather();
    const { settings } = useSettings();

    const [chartOpen, showChart, hideChart] = useBooleanState(false);
    const chartDay = useRef(0);

    const dailyValues = Array.from(weather.getDailyValues());

    const low_week = Math.min(...dailyValues.flatMap(day => day.temperature_low));
    const high_week = Math.max(...dailyValues.flatMap(day => day.temperature_high));

    const calculateDualRangeCoverStyle = (min: number, max: number) => {
        min = Math.max(0, min);
        max = Math.min(120, max);
        
        return {
            left: Normalize.Percent(min, low_week, high_week) + "%",
            right: Math.max(0, 100 - Normalize.Percent(max, low_week, high_week)) + "%",
            backgroundImage: `linear-gradient(90deg, ${toHSL(min, settings.tempUnit)} 0%, ${toHSL(max, settings.tempUnit)} 100%)`
        };
    };

    return (
        <>
            <Widget id="daily" size={"widget-large"} widgetTitle="7-Day Forecast" widgetIcon={<Calendar/>}>
                <table>
                    <tbody>
                        {
                            dailyValues.map((day, index) => (
                                <Day 
                                    key={index} dayInfo={day} 
                                    style={calculateDualRangeCoverStyle(day.temperature_low, day.temperature_high)} 
                                    onClick={() => {
                                        chartDay.current = index;
                                        showChart();
                                    }}
                                />
                            ))
                        }
                    </tbody>
                </table>
            </Widget>
            <Chart showView={"temperature_2m"} showDay={chartDay.current} isOpen={chartOpen} onClose={hideChart}/>
        </>
    );
};

export default Daily;