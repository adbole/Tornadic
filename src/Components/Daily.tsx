import { useModal } from "Contexts/ModalContext";
import { useWeather } from "Contexts/Weather";

import Chart, { ChartViews } from "Components/Chart";
import { Widget, WidgetSize } from "Components/SimpleComponents";
import { Calendar } from "svgs/widget";

import { Normalize } from "ts/Helpers";
import { DayInfo, WeatherData } from "ts/WeatherData";

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
            {WeatherData.hasChanceOfRain(dayInfo) && <span>{dayInfo.precipitation_probability}%</span>}
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
    const weather = useWeather();
    const { forecast: { daily } } = weather;
    const { showModal } = useModal();

    //Determine the weeks low and high
    let low_week = daily.temperature_2m_min[0];
    let high_week = daily.temperature_2m_max[0];

    for(let i = 1; i < daily.time.length; ++i) {
        if(daily.temperature_2m_min[i] < low_week) {
            low_week = daily.temperature_2m_min[i];
        }

        if(daily.temperature_2m_max[i] > high_week) {
            high_week = daily.temperature_2m_max[i];
        }
    }

    const calculateDualRangeCoverStyle = (min: number, max: number) => {
        min = Math.max(0, min);
        max = Math.min(120, max);

        const ToHSL = (x: number) => `hsl(${250 * ((120-x)/120)}deg, 100%, 50%)`;
        
        return {
            left: Normalize.Percent(min, low_week, high_week) + "%",
            right: Math.max(0, 100 - Normalize.Percent(max, low_week, high_week)) + "%",
            backgroundImage: `linear-gradient(90deg, ${ToHSL(min)} 0%, ${ToHSL(max)} 100%)`
        };
    };

    return (
        <Widget id="daily" size={WidgetSize.LARGE} widgetTitle="7-Day Forecast" widgetIcon={<Calendar/>}>
            <table>
                <tbody>
                    {
                        Array.from(weather.getDailyValues()).map((day, index) => (
                            <Day 
                                key={index} dayInfo={day} 
                                style={calculateDualRangeCoverStyle(day.temperature_low, day.temperature_high)} 
                                onClick={() => showModal(<Chart showView={ChartViews.Temperature} showDay={index}/>)}
                            />
                        ))
                    }
                </tbody>
            </table>
        </Widget>
    );
};

export default Daily;