import { useCallback } from 'react';
import { Widget, WidgetSize } from './SimpleComponents';
import { Normalize } from 'ts/Helpers';
import { useWeather } from './Contexts/Weather';
import { Calendar } from 'svgs/widget';
import { DayInfo, WeatherData } from './Contexts/Weather/WeatherData';

import { useModal } from './Contexts/ModalContext';
import Chart, { HourlyProperties } from './Chart';

/**
 * A helper component for Daily to display the individual days of the week
 * @returns A single day as a table row entry
 */
const Day = ({dayInfo, style, onClick}: {
    //Information on the day's values
    dayInfo: DayInfo,
    //The style to display the low and high for the week and where this day falls in the range
    style: React.CSSProperties

    onClick: (e: React.MouseEvent<HTMLTableRowElement>) => void
}) =>(
    <tr onClick={onClick}>
        <td><p>{dayInfo.day}</p></td>
        <td className={"condition"}>      
            {dayInfo.conditionInfo.icon}
            {WeatherData.IsRaining(dayInfo) && <span>{dayInfo.precipitation_probability}%</span>}
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
    const dailyData = useWeather().forecast.daily;
    const {showModal} = useModal();

    //Determine the weeks low and high
    let low_week = dailyData.temperature_2m_min[0];
    let high_week = dailyData.temperature_2m_max[0];

    for(let i = 1; i < dailyData.time.length; ++i) {
        if(dailyData.temperature_2m_min[i] < low_week) {
            low_week = dailyData.temperature_2m_min[i];
        }

        if(dailyData.temperature_2m_max[i] > high_week) {
            high_week = dailyData.temperature_2m_max[i];
        }
    }

    const calculateDualRangeCoverStyle = useCallback((min: number, max: number) => {
        min = Math.max(0, min);
        max = Math.min(120, max);

        const ToHSL = (x: number) => `hsl(${250 * ((120-x)/120)}deg, 100%, 50%)`;
        
        return {
            left: Normalize.Percent(min, low_week, high_week) + "%",
            right: Math.max(0, 100 - Normalize.Percent(max, low_week, high_week)) + "%",
            backgroundImage: `linear-gradient(90deg, ${ToHSL(min)} 0%, ${ToHSL(max)} 100%)`
        };
    }, [low_week, high_week]);

    return (
        <Widget id="daily" size={WidgetSize.LARGE} widgetTitle="7-Day Forecast" widgetIcon={<Calendar/>}>
            <table>
                <tbody>
                    {
                        Array.from(useWeather().GetDailyValues()).map((day, index) => {
                            return <Day key={index} dayInfo={day} 
                                        style={calculateDualRangeCoverStyle(day.temperature_low, day.temperature_high)} 
                                        onClick={() => showModal(<Chart showProperty={HourlyProperties.Temperature} showDay={index}/>)}/>;
                        })
                    }
                </tbody>
            </table>
        </Widget>
    );
};

export default Daily;